# ZapLink Tracker - MVP Implementation Checklist

> A complete task list for building the MVP of the ZapLink Tracker link redirection engine for Brazilian WhatsApp marketers.

---

## 🚀 Core Infrastructure (4 tasks)

- [ ] **Project Setup**: Initialize Next.js with App Router, TypeScript, and Tailwind CSS
- [ ] **Database Setup**: Configure PostgreSQL with Drizzle ORM
- [ ] **Redis Setup**: Configure Redis for caching and rate limiting
- [ ] **Auth Setup**: Implement Better-Auth with Google Provider and Magic Link

---

## 🗄️ Database Schema (4 tasks)

- [ ] Create `users` table with plan_tier ENUM (FREE, PRO, AGENCY)
- [ ] Create `links` table with all required fields (slug, destination_number, pixel_id_fb, ghost_mode, etc.)
- [ ] Create `analytics_events` table for high-volume click tracking
- [ ] Create `leads` table for Ghost Mode captures

---

## ⚡ Redis Architecture (3 tasks)

- [ ] Implement link cache with key structure `link:{slug}` and 24h TTL
- [ ] Implement rate limiting with key `ratelimit:{ip_address}` and 60s TTL
- [ ] Implement write-behind pattern for analytics using Redis queue

---

## 🔄 Redirect Engine (6 tasks)

- [ ] Create dynamic route handler at `app/[slug]/route.ts`
- [ ] Implement Redis cache lookup (fast path) with DB fallback (slow path)
- [ ] Parse incoming request data (UTM params, user-agent, IP, referer)
- [ ] Implement Ghost Mode conditional logic for interstitial page
- [ ] Build WhatsApp URL constructor with template substitution ({{product}} with UTM params)
- [ ] Implement fallback to default message when UTM params missing

---

## 📊 Pixel Proxy (Server-Side Attribution) (4 tasks)

- [ ] Generate/read fbp and fbc cookies on every click
- [ ] Create Facebook CAPI helper function in `lib/facebook.ts`
- [ ] Implement async CAPI event sending (Lead/InitiateCheckout) without blocking redirect
- [ ] Send user_data to CAPI (IP, user-agent, hashed emails if available)

---

## 👻 Ghost Mode (Lead Capture) (5 tasks)

- [ ] Create interstitial page at `/interstitial/[slug]/page.tsx`
- [ ] Build lightweight form UI (WhatsApp confirmation + optional name)
- [ ] Implement form submission handler to save lead to `leads` table
- [ ] Fire 'Lead' pixel event after form submission
- [ ] Redirect to WhatsApp after lead capture

---

## 🛠️ Utilities (3 tasks)

- [ ] Create Brazilian phone number sanitization function (handle multiple formats)
- [ ] Implement URL encoding for WhatsApp message templates
- [ ] Create encryption/decryption utilities for storing Facebook API tokens

---

## 📱 Dashboard (6 tasks)

- [ ] Create protected `/dashboard` route with middleware auth check
- [ ] Build 'Create Link' form with all fields (slug, destination, message template, pixel settings)
- [ ] Implement link management UI (list, edit, delete, toggle active status)
- [ ] Build analytics charts using Recharts (clicks over time, UTM breakdown)
- [ ] Create leads table view (show captured Ghost Mode leads)
- [ ] Display current plan tier and usage limits (clicks/month counter)

---

## 💎 Plan Limits & Tiers (4 tasks)

- [ ] Implement Free Plan restrictions (max 100 clicks/month, 1 active link, no CAPI)
- [ ] Implement Pro Plan features (5,000 clicks/month, unlimited links, CAPI, Ghost Mode)
- [ ] Add validation checks before link creation and click processing
- [ ] Display upgrade prompts when limits are reached

---

## 💳 Payment Integration (Mercado Pago Pix) (6 tasks)

- [ ] Set up Mercado Pago API credentials and SDK
- [ ] Create payment flow to generate Pix QR code on upgrade
- [ ] Store external_reference (User ID) in MP transaction
- [ ] Build webhook endpoint `/api/webhooks/mercadopago`
- [ ] Verify MP signature in webhook
- [ ] Update user plan_tier to PRO on approved payment

---

## 📈 Analytics (5 tasks)

- [ ] Implement click tracking and save to analytics_events (async)
- [ ] Store UTM parameters (source, medium, campaign, content) for each click
- [ ] Track conversion_status (CLICKED vs LEAD_CAPTURED)
- [ ] Implement click_count counter cache on links table
- [ ] Create API endpoints for dashboard analytics queries

---

## 🌐 Landing Page (4 tasks)

- [ ] Create marketing landing page with value proposition
- [ ] Add pricing section (Free, Pro, Agency tiers)
- [ ] Build using shadcn/ui components for modern UI
- [ ] Add call-to-action buttons (Sign Up / Login)

---

## 🧪 Testing (6 tasks)

- [ ] Test redirect engine with various UTM parameter combinations
- [ ] Test Ghost Mode flow on mobile devices
- [ ] Verify CAPI events appear in Facebook Events Manager
- [ ] Test phone number sanitization with various Brazilian formats
- [ ] Smoke test on iOS (Safari) and Android devices
- [ ] Test Pix payment flow end-to-end with Mercado Pago

---

## 🚢 Deployment (6 tasks)

- [ ] Set up Vercel project and configure environment variables
- [ ] Configure PostgreSQL database (Vercel Postgres or Railway)
- [ ] Configure Redis instance (Upstash or Railway)
- [ ] Set up custom domain and configure DNS (zap.lk or similar)
- [ ] Configure SSL certificates and ensure HTTPS
- [ ] Set up monitoring and error tracking (optional but recommended)

---

## 🔒 Security (4 tasks)

- [ ] Implement rate limiting to prevent abuse
- [ ] Sanitize and validate all user inputs
- [ ] Encrypt Facebook API tokens before storing in database
- [ ] Implement LGPD-compliant IP address anonymization (if required)

---

## 🎨 UI/UX (4 tasks)

- [ ] Install and configure shadcn/ui component library
- [ ] Create responsive design for mobile-first experience
- [ ] Add loading states and error handling in UI
- [ ] Implement toast notifications for user actions

---

## ✨ Polish (4 tasks)

- [ ] Add 404 page for invalid slugs
- [ ] Create onboarding flow for new users
- [ ] Add copy-to-clipboard functionality for generated links
- [ ] Create QR code generator for each link (optional feature)

---

## 📅 7-Day Sprint Timeline

Based on the project blueprint, here's the recommended execution order:

### Day 1: Foundation
- Complete Core Infrastructure tasks
- Complete Database Schema tasks
- Build "Create Link" form (Dashboard)

### Day 2: Core Functionality
- Complete Redirect Engine tasks (without Redis first)
- Complete Utilities tasks
- Test WhatsApp URL generation

### Day 3: Advanced Features
- Complete Redis Architecture tasks
- Complete Pixel Proxy tasks
- Test CAPI integration

### Day 4: Lead Capture
- Complete Ghost Mode tasks
- Test interstitial flow end-to-end

### Day 5: Dashboard & Analytics
- Complete remaining Dashboard tasks
- Complete Analytics tasks
- Implement Recharts visualizations

### Day 6: Payments & Landing
- Complete Payment Integration tasks
- Complete Landing Page tasks
- Complete UI/UX tasks

### Day 7: Deploy & Test
- Complete Deployment tasks
- Complete Security tasks
- Complete Testing tasks
- Complete Polish tasks
- Domain DNS setup
- Production smoke tests

---

## 🎯 Critical Path Items

These are the absolute must-haves for a functional MVP:

1. ✅ Project setup (Next.js + PostgreSQL + Redis)
2. ✅ Redirect engine with UTM parsing
3. ✅ WhatsApp URL generation
4. ✅ Basic dashboard with link creation
5. ✅ Click analytics storage
6. ✅ Authentication system
7. ✅ Deployment to production

---

## 📝 Notes

- Focus on speed over perfection for MVP
- The accumulated lead data creates product lock-in
- Start without Redis, add caching later if needed
- Use `waitUntil` in Next.js 15 for async CAPI calls
- Test on actual iOS devices (Safari) - attribution is the core value prop
- Keep deployment simple: Vercel + Vercel Postgres + Upstash Redis

---

**Last Updated**: January 23, 2026  
**Version**: 1.0  
**Project**: ZapLink Tracker MVP
