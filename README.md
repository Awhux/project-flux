# PROJECT BLUEPRINT: ZapLink Tracker (v1.0)

## 1. PROJECT OVERVIEW
**Core Value:** A specialized link redirection engine for Brazilian WhatsApp marketers that fixes attribution loss (iOS 14+), captures "ghost leads," and automates message personalization.
**Tech Stack:** - **Frontend/Backend:** Next.js (App Router), Tailwind CSS
- **Auth:** Better-Auth
- **Database:** PostgreSQL
- **Caching/Queue:** Redis
- **Infrastructure:** Vercel (recommended for Next.js) or Railway/VPS.

---

## 2. BUSINESS RULES & LOGIC

### 2.1. The "Pixel Proxy" (Server-Side Attribution)
**Objective:** Bypass client-side blockers (iOS) by sending events directly from the server to Meta/TikTok APIs.
* **Rule 1:** Every click must generate a `fbp` (Facebook Browser ID) and `fbc` (Facebook Click ID) cookie if not present.
* **Rule 2:** The system must capture `User-Agent` and `IP Address` from the incoming request headers.
* **Rule 3:** Integration Logic:
    1.  User clicks `zap.lk/promo`.
    2.  Server looks up the Pixel ID associated with that link.
    3.  Server sends a `POST` request to Meta Conversions API (CAPI) with event `Lead` or `InitiateCheckout` (configurable).
    4.  *Crucial:* This happens **before** or **asynchronously** during the redirect to prevent latency.

### 2.2. The "Contextual Pre-fill" (Dynamic Message Builder)
**Objective:** Inject ad context into the WhatsApp message.
* **Logic:**
    * **Base URL:** `wa.me/5511999999999?text=`
    * **Template:** defined by user, e.g., "Olá, vi o anúncio sobre {{product}}."
    * **Substitution:** Look for UTM params in the incoming link.
    * *Example:* Incoming link `zap.lk/promo?utm_content=TenisVermelho`.
    * *Result:* Redirects to `wa.me/...?text=Olá, vi o anúncio sobre TenisVermelho.`
* **Fallback:** If the specific UTM param is missing, use a generic default text defined in the link settings.

### 2.3. The "Ghost Lead" Interstitial (Lead Gate)
**Objective:** Capture phone/email before the user talks on WhatsApp.
* **Flow:**
    * If `ghost_mode_enabled = false`: 302 Direct Redirect.
    * If `ghost_mode_enabled = true`: 
        1.  Render a lightweight Server Component page (Next.js).
        2.  Show a simple form: "Para acessar o desconto, confirme seu WhatsApp."
        3.  On Submit -> Save to DB -> Fire 'Lead' Pixel -> Redirect to WhatsApp.

### 2.4. Limits & Tiers (Hard Constraints)
* **Free Plan:** Max 100 clicks/month, 1 Active Link, No CAPI.
* **Pro Plan:** Max 5,000 clicks/month, Unlimited Links, CAPI Enabled, Ghost Mode Enabled.
* **Agency Plan:** Sub-accounts supported (Team logic).

---

## 3. DATABASE SCHEMA (PostgreSQL)

*Designed for generic SQL, compatible with Drizzle/Prisma.*

### `users`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID | PK |
| `email` | VARCHAR | Unique |
| `plan_tier` | ENUM | 'FREE', 'PRO', 'AGENCY' |
| `created_at` | TIMESTAMP | |

### `links` (The Core Entity)
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID | PK |
| `user_id` | UUID | FK -> users.id |
| `slug` | VARCHAR | Unique Index. The "xyz" in zap.lk/xyz |
| `destination_number` | VARCHAR | Clean format (e.g., 5511999999999) |
| `default_message` | TEXT | URL Encoded message template |
| `pixel_id_fb` | VARCHAR | Optional: Facebook Pixel ID |
| `api_token_fb` | TEXT | Optional: CAPI Token (Encrypted) |
| `ghost_mode` | BOOLEAN | Default: false |
| `click_count` | INT | Default: 0 (Counter cache sync) |
| `is_active` | BOOLEAN | Default: true |

### `analytics_events` (High Volume)
*Note: For scale, consider moving this to a separate store (ClickHouse/Tinybird) later. For now, Postgres is fine.*
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID | PK |
| `link_id` | UUID | FK -> links.id |
| `timestamp` | TIMESTAMP | |
| `ip_address` | VARCHAR | Anonymize if required by LGPD |
| `user_agent` | VARCHAR | |
| `referer` | VARCHAR | |
| `utm_source` | VARCHAR | |
| `utm_medium` | VARCHAR | |
| `utm_campaign` | VARCHAR | |
| `conversion_status` | ENUM | 'CLICKED', 'LEAD_CAPTURED' |

### `leads` (Ghost Mode Captures)
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID | PK |
| `link_id` | UUID | FK -> links.id |
| `phone` | VARCHAR | Captured input |
| `name` | VARCHAR | Optional |
| `created_at` | TIMESTAMP | |

---

## 4. REDIS ARCHITECTURE

**Why Redis?** Speed is the product. Querying Postgres on every click is too slow and hits connection limits.

### 4.1. Key-Value Structures
* **Link Cache:** * **Key:** `link:{slug}`
    * **Value:** JSON String `{ "destination": "...", "pixels": {...}, "ghost_mode": false, "owner_id": "..." }`
    * **TTL:** 24 hours (Invalidate on update).
* **Rate Limiting:**
    * **Key:** `ratelimit:{ip_address}`
    * **Value:** Int (Count)
    * **TTL:** 60 seconds.

### 4.2. The "Write-Behind" Pattern (Analytics)
Instead of writing to Postgres `analytics_events` on every click (blocking):
1.  Push event data to a Redis List: `queue:analytics`
2.  **Next.js Cron / Worker:** Pop 100 items every minute and bulk-insert into Postgres.
    * *7-Day Hack:* If configuring a worker is too complex, just write to Postgres asynchronously using `waitUntil` (Next.js 15) or standard non-awaiting promise (risky but fast for MVP).

---

## 5. TECHNICAL IMPLEMENTATION STEPS

### Step 1: The Redirect Engine (Route Handler)
**Path:** `app/[slug]/route.ts` (Dynamic Route)

```typescript
// Pseudo-code for route.ts
import { redis } from '@/lib/redis';
import { db } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const slug = params.slug;
  
  // 1. FAST PATH: Check Redis
  let linkData = await redis.get(`link:${slug}`);
  
  // 2. SLOW PATH: Database Fallback
  if (!linkData) {
    linkData = await db.query.links.findFirst({ where: eq(links.slug, slug) });
    if (!linkData) return Response.redirect('/404');
    await redis.set(`link:${slug}`, JSON.stringify(linkData), 'EX', 86400);
  }

  // 3. Parse Incoming Data
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent');
  const ip = request.headers.get('x-forwarded-for');
  const searchParams = url.searchParams; // UTMs are here

  // 4. Ghost Mode Check
  if (linkData.ghost_mode) {
    // Return the Interstitial HTML Page instead of redirecting
    // We rewrite to an internal page handling the UI
    return new Response(null, {
        status: 307,
        headers: { Location: `/interstitial/${slug}?${searchParams.toString()}` }
    });
  }

  // 5. CAPI Trigger (Fire and Forget)
  // Use context.waitUntil in Next.js 15 or just don't await
  sendFacebookEvent(linkData.pixel_id, linkData.api_token, { ip, userAgent, ... });

  // 6. Construct Final WhatsApp URL
  // Logic: Replace {{utm_x}} in message with actual params
  const finalUrl = buildWhatsAppUrl(linkData.destination_number, linkData.default_message, searchParams);

  // 7. Execute Redirect
  return Response.redirect(finalUrl);
}

```

### Step 2: The Facebook CAPI Helper

**Path:** `lib/facebook.ts`

```typescript
export async function sendFacebookEvent(pixelId: string, token: string, userData: any) {
  if (!pixelId || !token) return;

  const payload = {
    data: [{
      event_name: 'Lead',
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      user_data: {
        client_ip_address: userData.ip,
        client_user_agent: userData.userAgent,
        // Hash these if you have them from Ghost Mode, otherwise send empty/fbp
      }
    }],
    access_token: token
  };

  try {
    await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('CAPI Failed', e);
  }
}

```

### Step 3: Better-Auth Setup

* Configure Google Provider (Primary for Brazil).
* Add a "Magic Link" provider (Good for mobile users).
* Protect `/dashboard` routes using Middleware.

---

## 6. BRAZILIAN MARKET SPECIFICS (IMPLEMENTATION)

### 6.1. Phone Number Sanitization

Brazilians format numbers in chaos: `(11) 99999-9999`, `11999999999`, `+5511...`.
You need a strict util function before saving to DB:

```typescript
function sanitizeBRLPhone(input: string): string {
  // Remove all non-numeric
  let nums = input.replace(/\D/g, '');
  
  // If starts with 0 (011...), remove 0
  if (nums.startsWith('0')) nums = nums.substring(1);
  
  // If missing country code but has 11 digits (11 9xxxx xxxx), add 55
  if (nums.length === 11) nums = '55' + nums;
  
  return nums;
}

```

### 6.2. Pix Payment Integration (Mercado Pago)

**Endpoint:** `/api/webhooks/mercadopago`

1. **Create Payment:** When user upgrades, call MP API to generate a Pix QR Code.
2. **Store Reference:** Save `external_reference` (your User ID) in the MP transaction.
3. **Webhook Listener:**
* Verify MP Signature.
* Check if `status === 'approved'`.
* Read `external_reference`.
* Update `users.plan_tier` to 'PRO' in DB.



---

## 7. EXECUTION CHECKLIST (7-DAY SPRINT)

* **Day 1:** Init Next.js, Setup Better-Auth, Setup Postgres/Drizzle. Build "Create Link" Form.
* **Day 2:** Implement the Redirect Logic (Route Handler) without Redis first. Test WhatsApp URL generation.
* **Day 3:** Implement Redis caching and the "Pixel Proxy" (CAPI integration).
* **Day 4:** Build the "Ghost Mode" interstitial page and form.
* **Day 5:** Dashboard (Analytics Charts - simple Recharts implementation).
* **Day 6:** Mercado Pago Pix Integration + Landing Page (Copy-paste shadcn/ui components).
* **Day 7:** Deploy to Vercel. Domain DNS setup. Smoke test on iOS and Android.

## 8. DEFENSIBILITY & SCALE

* **Defensibility:** The accumulated data (leads captured in Ghost Mode) creates lock-in. It's hard to migrate leads away.
* **Scale:** If you hit 1M clicks, move the Redirect Engine to Cloudflare Workers (Edge) and use HTTP Log Streams for analytics to reduce DB load.
