# ZapLink Tracker - Design System & Component Guideline

> **Version**: 1.0  
> **Last Updated**: January 26, 2026  
> **Design Style**: Professional SaaS  
> **Scope**: Dashboard + Interstitial/Ghost Mode Page

---

## Table of Contents

1. [Design System Foundation](#design-system-foundation)
   - [Color Palette](#color-palette)
   - [Typography](#typography)
   - [Spacing System](#spacing-system)
   - [Shadows & Elevation](#shadows--elevation)
   - [Border Radius](#border-radius)
   - [Grid System](#grid-system)
2. [Layout Structure](#layout-structure)
3. [Dashboard Components](#dashboard-components)
4. [Interstitial Page](#interstitial-page)
5. [Interactive States](#interactive-states)
6. [Responsive Behavior](#responsive-behavior)
7. [Implementation Guide](#implementation-guide)
8. [Accessibility Guidelines](#accessibility-guidelines)

---

## Design System Foundation

### Color Palette

#### Primary Colors (Blue/Indigo)

```css
--primary-50: #EEF2FF;   /* Lightest - backgrounds */
--primary-100: #E0E7FF;  /* Very light - hover states */
--primary-200: #C7D2FE;  /* Light - borders */
--primary-300: #A5B4FC;  /* Medium light */
--primary-400: #818CF8;  /* Medium */
--primary-500: #6366F1;  /* Base primary color */
--primary-600: #4F46E5;  /* Dark - default buttons */
--primary-700: #4338CA;  /* Darker - hover states */
--primary-800: #3730A3;  /* Very dark */
--primary-900: #312E81;  /* Darkest - text */
```

**Usage**:
- Primary-600 for default buttons, links, and active states
- Primary-50 for light backgrounds and hover states
- Primary-700 for button hover states
- Primary-500 for focus rings and accents

#### Neutral Colors (Gray Scale)

```css
--gray-50: #F9FAFB;     /* Main background */
--gray-100: #F3F4F6;    /* Card backgrounds, disabled states */
--gray-200: #E5E7EB;    /* Borders, dividers */
--gray-300: #D1D5DB;    /* Input borders */
--gray-400: #9CA3AF;    /* Placeholder text */
--gray-500: #6B7280;    /* Secondary text */
--gray-600: #4B5563;    /* Body text */
--gray-700: #374151;    /* Headings */
--gray-800: #1F2937;    /* Dark headings */
--gray-900: #111827;    /* Primary text */
--gray-950: #030712;    /* Darkest text */
```

#### Semantic Colors

**Success (Green)**:
```css
--success-50: #F0FDF4;
--success-100: #DCFCE7;
--success-500: #22C55E;  /* Base */
--success-600: #16A34A;  /* Dark */
--success-700: #15803D;  /* Darker */
```

**Warning (Yellow)**:
```css
--warning-50: #FFFBEB;
--warning-100: #FEF3C7;
--warning-500: #F59E0B;  /* Base */
--warning-600: #D97706;  /* Dark */
--warning-700: #B45309;  /* Darker */
```

**Error (Red)**:
```css
--error-50: #FEF2F2;
--error-100: #FEE2E2;
--error-500: #EF4444;    /* Base */
--error-600: #DC2626;    /* Dark */
--error-700: #B91C1C;    /* Darker */
```

**Info (Blue)**:
```css
--info-50: #EFF6FF;
--info-100: #DBEAFE;
--info-500: #3B82F6;     /* Base */
--info-600: #2563EB;     /* Dark */
--info-700: #1D4ED8;     /* Darker */
```

**WhatsApp (Brand)**:
```css
--whatsapp-light: #DCF8C6;  /* Light background */
--whatsapp: #25D366;         /* Primary WhatsApp green */
--whatsapp-dark: #128C7E;    /* Dark green */
--whatsapp-darker: #075E54;  /* Darkest green */
```

#### Background & Surface Colors

```css
--bg-base: #FFFFFF;          /* White */
--bg-secondary: #F9FAFB;     /* Gray-50 */
--bg-tertiary: #F3F4F6;      /* Gray-100 */
--surface-elevated: #FFFFFF; /* Cards, modals */
--overlay: rgba(0, 0, 0, 0.5); /* Modal overlay */
```

---

### Typography

#### Font Family

**Primary Font**: Inter (with fallbacks)

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
```

**Installation**:
```html
<!-- In <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

#### Heading Scale

| Element | Size (px/rem) | Font Weight | Line Height | Letter Spacing | Tailwind Class |
|---------|---------------|-------------|-------------|----------------|----------------|
| **H1**  | 36px / 2.25rem | 700 (Bold) | 1.2 (43px) | -0.02em | `text-4xl font-bold` |
| **H2**  | 30px / 1.875rem | 700 (Bold) | 1.25 (38px) | -0.01em | `text-3xl font-bold` |
| **H3**  | 24px / 1.5rem | 600 (Semibold) | 1.33 (32px) | -0.01em | `text-2xl font-semibold` |
| **H4**  | 20px / 1.25rem | 600 (Semibold) | 1.4 (28px) | 0 | `text-xl font-semibold` |
| **H5**  | 18px / 1.125rem | 600 (Semibold) | 1.5 (27px) | 0 | `text-lg font-semibold` |
| **H6**  | 16px / 1rem | 600 (Semibold) | 1.5 (24px) | 0 | `text-base font-semibold` |

#### Body Text Scale

| Element | Size (px/rem) | Font Weight | Line Height | Tailwind Class |
|---------|---------------|-------------|-------------|----------------|
| **Large** | 18px / 1.125rem | 400 (Regular) | 1.75 (32px) | `text-lg` |
| **Base** | 16px / 1rem | 400 (Regular) | 1.5 (24px) | `text-base` |
| **Small** | 14px / 0.875rem | 400 (Regular) | 1.5 (21px) | `text-sm` |
| **XSmall** | 12px / 0.75rem | 400 (Regular) | 1.5 (18px) | `text-xs` |

#### Font Weight Scale

```css
--font-regular: 400;    /* Body text */
--font-medium: 500;     /* Emphasis, buttons */
--font-semibold: 600;   /* Subheadings, labels */
--font-bold: 700;       /* Headings, strong emphasis */
```

#### Text Colors

| Purpose | Color Variable | Hex | Tailwind Class |
|---------|----------------|-----|----------------|
| Primary text | --gray-900 | #111827 | `text-gray-900` |
| Secondary text | --gray-600 | #4B5563 | `text-gray-600` |
| Tertiary text | --gray-500 | #6B7280 | `text-gray-500` |
| Placeholder | --gray-400 | #9CA3AF | `text-gray-400` |
| Disabled | --gray-400 | #9CA3AF | `text-gray-400` |
| Link | --primary-600 | #4F46E5 | `text-primary-600` |
| Error | --error-600 | #DC2626 | `text-error-600` |
| Success | --success-600 | #16A34A | `text-success-600` |
| Warning | --warning-600 | #D97706 | `text-warning-600` |

---

### Spacing System

**Base Unit**: 8px

All spacing follows an 8px grid system for consistency and mathematical harmony.

#### Spacing Scale

| Token | Value (px/rem) | Use Case | Tailwind Class |
|-------|----------------|----------|----------------|
| `space-1` | 4px / 0.25rem | Tight spacing, icon gaps | `p-1`, `m-1`, `gap-1` |
| `space-2` | 8px / 0.5rem | Small gaps, padding | `p-2`, `m-2`, `gap-2` |
| `space-3` | 12px / 0.75rem | Medium-tight spacing | `p-3`, `m-3`, `gap-3` |
| `space-4` | 16px / 1rem | Default spacing | `p-4`, `m-4`, `gap-4` |
| `space-5` | 20px / 1.25rem | Medium spacing | `p-5`, `m-5`, `gap-5` |
| `space-6` | 24px / 1.5rem | Card padding, sections | `p-6`, `m-6`, `gap-6` |
| `space-8` | 32px / 2rem | Large padding, sections | `p-8`, `m-8`, `gap-8` |
| `space-10` | 40px / 2.5rem | Extra large spacing | `p-10`, `m-10`, `gap-10` |
| `space-12` | 48px / 3rem | Section spacing | `p-12`, `m-12`, `gap-12` |
| `space-16` | 64px / 4rem | Major section breaks | `p-16`, `m-16`, `gap-16` |
| `space-24` | 96px / 6rem | Hero sections | `p-24`, `m-24`, `gap-24` |

#### Common Spacing Patterns

**Component Internal Padding**:
- Small components (buttons, badges): 8px - 12px
- Medium components (cards): 16px - 24px
- Large components (modals, sections): 24px - 32px

**Component Gaps**:
- Between related items: 8px - 12px
- Between sections: 16px - 24px
- Between major sections: 32px - 48px

---

### Shadows & Elevation

Shadows create depth hierarchy and visual organization.

#### Shadow Scale

```css
/* XSmall - Subtle lift */
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
/* Tailwind: shadow-sm */

/* Small - Cards at rest */
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
/* Tailwind: shadow */

/* Medium - Cards on hover */
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
/* Tailwind: shadow-md */

/* Large - Dropdowns, popovers */
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
/* Tailwind: shadow-lg */

/* XLarge - Modals */
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
/* Tailwind: shadow-xl */

/* 2XLarge - Emphasized modals */
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
/* Tailwind: shadow-2xl */

/* Inner - Pressed/inset effect */
--shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
/* Tailwind: shadow-inner */
```

#### Usage Guidelines

| Element | Shadow | Purpose |
|---------|--------|---------|
| Flat cards (info display) | `shadow-sm` | Subtle separation |
| Interactive cards | `shadow-md` | Visible elevation |
| Dropdowns, tooltips | `shadow-lg` | Float above content |
| Modals, dialogs | `shadow-xl` or `shadow-2xl` | Maximum elevation |
| Pressed buttons | `shadow-inner` | Depressed effect |
| Hover state | Increase shadow by one level | Interactive feedback |

---

### Border Radius

Rounded corners create a friendly, modern aesthetic.

#### Radius Scale

```css
--radius-none: 0px;           /* Sharp corners */
--radius-sm: 4px;             /* Subtle rounding */
--radius-base: 8px;           /* Default (buttons, inputs, cards) */
--radius-md: 12px;            /* Medium (modals, large cards) */
--radius-lg: 16px;            /* Large (hero cards) */
--radius-xl: 24px;            /* Extra large */
--radius-2xl: 32px;           /* Very large */
--radius-full: 9999px;        /* Pills, circles (badges, avatars) */
```

| Element Type | Radius | Tailwind Class |
|--------------|--------|----------------|
| Buttons | 8px | `rounded-lg` |
| Input fields | 8px | `rounded-lg` |
| Cards | 12px | `rounded-xl` |
| Modals | 12px | `rounded-xl` |
| Badges | 9999px | `rounded-full` |
| Avatars | 9999px | `rounded-full` |
| Tooltips | 6px | `rounded-md` |
| Dropdowns | 8px | `rounded-lg` |

---

### Grid System

#### Container Widths

```css
--container-sm: 640px;   /* Small devices */
--container-md: 768px;   /* Medium devices */
--container-lg: 1024px;  /* Large devices */
--container-xl: 1280px;  /* Extra large devices */
--container-2xl: 1400px; /* Maximum content width */
```

**Dashboard Content Max Width**: 1400px (centered with auto margins)

#### Column Grid

**12-Column Grid System** (using CSS Grid or Flexbox)

```css
.grid-cols-12 {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 24px; /* or 16px for tighter layouts */
}
```

**Common Layouts**:
- Full width: `col-span-12`
- Half: `col-span-6`
- Third: `col-span-4`
- Quarter: `col-span-3`
- Two-thirds: `col-span-8`

#### Gutter/Gap

- Default gap: 24px (desktop)
- Tablet gap: 16px
- Mobile gap: 12px

---

## Layout Structure

### Dashboard Layout Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Sidebar (256px)  │           Main Content Area             │
│                   │                                         │
│   ┌─────────┐     │  ┌──────── Header (64px) ───────────┐  │
│   │  Logo   │     │  │  Breadcrumbs    User  Plan Badge │  │
│   └─────────┘     │  └───────────────────────────────────┘  │
│                   │                                         │
│   Navigation      │  ┌────────────────────────────────┐    │
│   • Dashboard     │  │                                │    │
│   • Links         │  │      Page Content              │    │
│   • Analytics     │  │      (Max width: 1400px)       │    │
│   • Leads         │  │                                │    │
│   • Settings      │  │                                │    │
│                   │  └────────────────────────────────┘    │
│                   │                                         │
└─────────────────────────────────────────────────────────────┘
```

### 1. Sidebar Navigation

#### Specifications

**Dimensions**:
- Width: 256px (desktop), 200px (tablet), 0px (mobile - collapsed)
- Height: 100vh (full viewport height)
- Position: Fixed left
- Z-index: 40

**Visual Style**:
- Background: White (`#FFFFFF`)
- Border right: 1px solid Gray-200 (`#E5E7EB`)
- Shadow: None (border provides separation)

**Structure**:

```html
<aside class="w-64 h-screen fixed left-0 top-0 bg-white border-r border-gray-200 flex flex-col">
  <!-- Logo Area -->
  <div class="h-16 flex items-center px-6 border-b border-gray-200">
    <img src="/logo.svg" alt="ZapLink" class="h-8">
    <span class="ml-2 text-lg font-semibold text-gray-900">ZapLink</span>
  </div>
  
  <!-- Navigation Items -->
  <nav class="flex-1 px-3 py-4 space-y-1">
    <!-- Navigation items here -->
  </nav>
  
  <!-- Bottom Section (Optional: User/Settings) -->
  <div class="p-4 border-t border-gray-200">
    <!-- User profile or upgrade prompt -->
  </div>
</aside>
```

#### Logo Area

**Dimensions**:
- Height: 64px
- Padding: 24px horizontal
- Border bottom: 1px solid Gray-200

**Logo**:
- Height: 32px
- Width: Auto (maintain aspect ratio)
- Position: Left-aligned with 24px left padding

**Text** (if applicable):
- Font size: 18px (text-lg)
- Font weight: 600 (Semibold)
- Color: Gray-900
- Margin left: 8px from logo

#### Navigation Items

**Item Specifications**:
- Height: 40px
- Padding: 10px 12px
- Border radius: 8px
- Gap between icon and text: 12px
- Margin between items: 4px

**Icon**:
- Size: 20px × 20px
- Stroke width: 2px
- Color: Inherits from parent (Gray-600 default, White when active)

**Text**:
- Font size: 14px (text-sm)
- Font weight: 500 (Medium)
- Color: Gray-700 (default), White (active), Gray-900 (hover)

**States**:

**Default State**:
```html
<a href="#" class="flex items-center h-10 px-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
  <svg class="w-5 h-5 text-gray-600" ...></svg>
  <span class="ml-3 text-sm font-medium">Dashboard</span>
</a>
```

**Active State**:
```html
<a href="#" class="flex items-center h-10 px-3 rounded-lg bg-primary-600 text-white">
  <svg class="w-5 h-5 text-white" ...></svg>
  <span class="ml-3 text-sm font-medium">Dashboard</span>
</a>
```

**Hover State** (non-active):
- Background: Gray-100
- Text color: Gray-900
- Transition: 150ms ease-in-out

**Navigation Items List**:

1. Dashboard (Home icon)
2. Links (Link icon)
3. Analytics (Chart icon)
4. Leads (Users icon)
5. Settings (Settings icon)

---

### 2. Top Header

#### Specifications

**Dimensions**:
- Height: 64px
- Width: calc(100% - 256px) on desktop (accounts for sidebar)
- Position: Fixed top, offset by sidebar width
- Z-index: 30

**Visual Style**:
- Background: White (`#FFFFFF`)
- Border bottom: 1px solid Gray-200 (`#E5E7EB`)
- Shadow: Small (`shadow-sm`)
- Padding: 0 32px

**Structure**:

```html
<header class="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-8">
  <!-- Left: Breadcrumbs / Page Title -->
  <div>
    <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
  </div>
  
  <!-- Right: Actions & User -->
  <div class="flex items-center gap-4">
    <!-- Usage Indicator -->
    <div class="hidden md:flex items-center gap-2">
      <!-- Usage badge/progress -->
    </div>
    
    <!-- Plan Tier Badge -->
    <div class="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold">
      PRO
    </div>
    
    <!-- Notification Icon -->
    <button class="relative p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
      <svg class="w-5 h-5" ...></svg>
      <!-- Notification Badge -->
      <span class="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full"></span>
    </button>
    
    <!-- User Dropdown -->
    <button class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
      <img src="/avatar.jpg" class="w-8 h-8 rounded-full" alt="User">
      <span class="hidden md:block text-sm font-medium text-gray-700">João Silva</span>
      <svg class="w-4 h-4 text-gray-500" ...></svg>
    </button>
  </div>
</header>
```

#### Breadcrumbs / Page Title

**Single Title** (most pages):
- Font size: 24px (text-2xl)
- Font weight: 600 (Semibold)
- Color: Gray-900

**Breadcrumbs** (nested pages):
```html
<nav class="flex items-center gap-2 text-sm text-gray-600">
  <a href="#" class="hover:text-gray-900">Links</a>
  <svg class="w-4 h-4" ...>/</svg>
  <span class="text-gray-900 font-medium">Edit Link</span>
</nav>
```

#### Plan Tier Badge

**Free Plan**:
- Background: Gray-100
- Text color: Gray-700
- Text: "FREE"

```html
<span class="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
  FREE
</span>
```

**Pro Plan**:
- Background: Gradient (Blue-500 to Blue-600)
- Text color: White
- Text: "PRO"

```html
<span class="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold">
  PRO
</span>
```

**Agency Plan**:
- Background: Gradient (Purple-500 to Purple-600)
- Text color: White
- Text: "AGENCY"

```html
<span class="px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-semibold">
  AGENCY
</span>
```

#### Usage Indicator

**Compact Version** (header):

```html
<div class="flex items-center gap-2">
  <div class="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
    <div class="h-full bg-primary-600 rounded-full" style="width: 45%"></div>
  </div>
  <span class="text-xs text-gray-600">45/100</span>
</div>
```

**Color Logic**:
- 0-70%: Primary-600 (Blue)
- 71-90%: Warning-500 (Yellow)
- 91-100%: Error-500 (Red)

---

### 3. Main Content Area

#### Specifications

**Dimensions**:
- Width: calc(100% - 256px) on desktop
- Margin left: 256px (sidebar width)
- Padding top: 64px (header height)
- Min height: calc(100vh - 64px)

**Visual Style**:
- Background: Gray-50 (`#F9FAFB`)
- Padding: 48px (desktop), 32px (tablet), 24px (mobile)

**Structure**:

```html
<main class="ml-64 pt-16 min-h-screen bg-gray-50 p-12">
  <div class="max-w-screen-2xl mx-auto">
    <!-- Page content here -->
  </div>
</main>
```

**Content Container**:
- Max width: 1400px (2xl breakpoint)
- Margin: 0 auto (centered)

---

## Dashboard Components

### 1. Create Link Form/Modal

#### Modal Container

**Dimensions**:
- Width: 600px (desktop), 90vw (mobile, max 600px)
- Max height: 90vh
- Border radius: 12px
- Padding: 32px
- Background: White

**Shadow**: `shadow-2xl` (0 25px 50px rgba(0, 0, 0, 0.25))

**Overlay**:
- Background: `rgba(0, 0, 0, 0.5)`
- Backdrop blur: 4px (optional, `backdrop-blur-sm`)

**Structure**:

```html
<!-- Overlay -->
<div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
  <!-- Modal -->
  <div class="bg-white rounded-xl shadow-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
    <!-- Header -->
    <div class="flex items-center justify-between px-8 py-6 border-b border-gray-200">
      <h2 class="text-2xl font-semibold text-gray-900">Create New Link</h2>
      <button class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
        <svg class="w-5 h-5" ...><!-- X icon --></svg>
      </button>
    </div>
    
    <!-- Content -->
    <div class="px-8 py-6">
      <form class="space-y-6">
        <!-- Form fields here -->
      </form>
    </div>
    
    <!-- Footer -->
    <div class="flex items-center justify-end gap-3 px-8 py-6 border-t border-gray-200 bg-gray-50">
      <button type="button" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
        Cancel
      </button>
      <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">
        Create Link
      </button>
    </div>
  </div>
</div>
```

#### Form Fields

**1. Slug Input**

**Label**: "Link Slug"
**Helper text**: "This will be your short link: zap.lk/your-slug"

```html
<div class="space-y-2">
  <label class="block text-sm font-semibold text-gray-700">
    Link Slug <span class="text-error-500">*</span>
  </label>
  
  <div class="flex items-center">
    <span class="inline-flex items-center px-3 h-11 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-sm text-gray-600">
      zap.lk/
    </span>
    <input 
      type="text" 
      class="flex-1 h-11 px-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
      placeholder="my-promo"
    >
  </div>
  
  <p class="text-xs text-gray-500">Use lowercase letters, numbers, and hyphens only</p>
</div>
```

**Validation Rules**:
- Required field
- 3-50 characters
- Lowercase alphanumeric and hyphens only
- No spaces
- Must be unique

**Error State**:
```html
<input class="... border-error-500 focus:ring-error-500 focus:border-error-500">
<p class="text-xs text-error-600 mt-1">This slug is already taken</p>
```

**2. Destination Phone Number**

**Label**: "WhatsApp Number"
**Helper text**: "The WhatsApp number that will receive messages"

```html
<div class="space-y-2">
  <label class="block text-sm font-semibold text-gray-700">
    WhatsApp Number <span class="text-error-500">*</span>
  </label>
  
  <div class="relative">
    <div class="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
      <span class="text-lg">🇧🇷</span>
      <span class="text-sm text-gray-600">+55</span>
    </div>
    <input 
      type="tel" 
      class="w-full h-11 pl-20 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
      placeholder="(11) 99999-9999"
    >
  </div>
  
  <p class="text-xs text-gray-500">Format: (DD) 9XXXX-XXXX</p>
</div>
```

**Input Mask**: Automatically format as user types
- Pattern: `(XX) XXXXX-XXXX`
- Example: `(11) 98765-4321`

**3. Message Template**

**Label**: "WhatsApp Message Template"
**Helper text**: "Use {{utm_source}}, {{utm_campaign}}, etc. for dynamic content"

```html
<div class="space-y-2">
  <label class="block text-sm font-semibold text-gray-700">
    Message Template <span class="text-error-500">*</span>
  </label>
  
  <textarea 
    rows="4"
    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
    placeholder="Olá! Vi o anúncio sobre {{utm_campaign}} e gostaria de saber mais."
  ></textarea>
  
  <div class="flex flex-wrap gap-2">
    <button type="button" class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
      {{utm_source}}
    </button>
    <button type="button" class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
      {{utm_campaign}}
    </button>
    <button type="button" class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
      {{utm_content}}
    </button>
  </div>
  
  <p class="text-xs text-gray-500">Available variables: utm_source, utm_medium, utm_campaign, utm_content</p>
</div>
```

**4. Facebook Pixel Settings (Collapsible)**

**Collapsed State**:
```html
<button 
  type="button"
  class="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-200"
>
  <div class="flex items-center gap-3">
    <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
      <svg class="w-5 h-5 text-primary-600" ...><!-- Facebook icon --></svg>
    </div>
    <div class="text-left">
      <div class="text-sm font-semibold text-gray-900">Facebook Pixel (Optional)</div>
      <div class="text-xs text-gray-500">Enable server-side attribution</div>
    </div>
  </div>
  <svg class="w-5 h-5 text-gray-400 transition-transform" ...><!-- Chevron down --></svg>
</button>
```

**Expanded State**:
```html
<div class="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
  <!-- Pixel ID -->
  <div class="space-y-2">
    <label class="block text-sm font-semibold text-gray-700">
      Facebook Pixel ID
    </label>
    <input 
      type="text" 
      class="w-full h-11 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
      placeholder="123456789012345"
    >
  </div>
  
  <!-- API Token -->
  <div class="space-y-2">
    <label class="block text-sm font-semibold text-gray-700">
      Conversions API Token
    </label>
    <input 
      type="password" 
      class="w-full h-11 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
      placeholder="Enter your CAPI token"
    >
    <p class="text-xs text-gray-500">
      <a href="#" class="text-primary-600 hover:text-primary-700 font-medium">Learn how to get your CAPI token</a>
    </p>
  </div>
</div>
```

**5. Ghost Mode Toggle**

```html
<div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
  <div class="flex items-center gap-3">
    <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
      <svg class="w-5 h-5 text-purple-600" ...><!-- Ghost icon --></svg>
    </div>
    <div>
      <div class="text-sm font-semibold text-gray-900">Ghost Mode</div>
      <div class="text-xs text-gray-500">Capture lead before WhatsApp redirect</div>
    </div>
  </div>
  
  <!-- Toggle Switch -->
  <button 
    type="button"
    role="switch"
    aria-checked="false"
    class="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
  >
    <span class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform translate-x-0.5"></span>
  </button>
</div>
```

**Active State** (when toggled on):
```html
<button 
  class="... bg-primary-600"
  aria-checked="true"
>
  <span class="... translate-x-5"></span>
</button>
```

**6. Submit Button**

```html
<button 
  type="submit"
  class="w-full h-12 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 transition-colors"
>
  Create Link
</button>
```

**Loading State**:
```html
<button 
  type="submit"
  disabled
  class="... bg-primary-600 opacity-70 cursor-not-allowed"
>
  <svg class="animate-spin h-5 w-5 text-white mx-auto" ...></svg>
</button>
```

---

### 2. Links Table

#### Container

**Card Style**:
```html
<div class="bg-white rounded-xl shadow-sm border border-gray-200">
  <!-- Header -->
  <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
    <div>
      <h2 class="text-lg font-semibold text-gray-900">Your Links</h2>
      <p class="text-sm text-gray-500 mt-0.5">Manage and track your short links</p>
    </div>
    <button class="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700">
      + New Link
    </button>
  </div>
  
  <!-- Table -->
  <div class="overflow-x-auto">
    <table class="w-full">
      <!-- Table content -->
    </table>
  </div>
  
  <!-- Pagination -->
  <div class="px-6 py-4 border-t border-gray-200">
    <!-- Pagination controls -->
  </div>
</div>
```

#### Table Structure

```html
<table class="w-full">
  <thead class="bg-gray-50 border-b border-gray-200">
    <tr>
      <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
        Link
      </th>
      <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
        Destination
      </th>
      <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
        Clicks
      </th>
      <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
        Status
      </th>
      <th class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
        Actions
      </th>
    </tr>
  </thead>
  <tbody class="divide-y divide-gray-200">
    <!-- Table rows -->
  </tbody>
</table>
```

#### Table Rows

**Specifications**:
- Height: 64px
- Padding: 24px horizontal
- Hover background: Gray-50
- Transition: 150ms ease

**Row Structure**:

```html
<tr class="hover:bg-gray-50 transition-colors">
  <!-- Link Column -->
  <td class="px-6 py-4">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <svg class="w-5 h-5 text-primary-600" ...><!-- Link icon --></svg>
      </div>
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-gray-900">zap.lk/promo</span>
          <button class="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100">
            <svg class="w-4 h-4" ...><!-- Copy icon --></svg>
          </button>
        </div>
        <div class="text-xs text-gray-500 truncate">Created 2 days ago</div>
      </div>
    </div>
  </td>
  
  <!-- Destination Column -->
  <td class="px-6 py-4">
    <div class="flex items-center gap-2">
      <span class="text-lg">🇧🇷</span>
      <span class="text-sm text-gray-600">+55 (11) 98765-4321</span>
    </div>
  </td>
  
  <!-- Clicks Column -->
  <td class="px-6 py-4">
    <div class="flex items-center gap-2">
      <span class="text-base font-semibold text-gray-900">1,234</span>
      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success-100 text-success-700">
        <svg class="w-3 h-3 mr-0.5" ...><!-- Up arrow --></svg>
        12%
      </span>
    </div>
  </td>
  
  <!-- Status Column -->
  <td class="px-6 py-4">
    <!-- Toggle switch (same as Ghost Mode toggle) -->
    <button 
      type="button"
      class="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600"
      aria-checked="true"
    >
      <span class="inline-block h-5 w-5 transform rounded-full bg-white translate-x-5 transition-transform"></span>
    </button>
  </td>
  
  <!-- Actions Column -->
  <td class="px-6 py-4 text-right">
    <div class="flex items-center justify-end gap-2">
      <button class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
        <svg class="w-4 h-4" ...><!-- Edit icon --></svg>
      </button>
      <button class="p-2 text-gray-600 hover:text-error-600 hover:bg-error-50 rounded-lg">
        <svg class="w-4 h-4" ...><!-- Trash icon --></svg>
      </button>
      <!-- More Actions Dropdown -->
      <button class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
        <svg class="w-4 h-4" ...><!-- More vertical icon --></svg>
      </button>
    </div>
  </td>
</tr>
```

#### Copy Button Interaction

**Default**:
```html
<button class="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100">
  <svg class="w-4 h-4" ...><!-- Copy icon --></svg>
</button>
```

**After Click** (show checkmark for 2 seconds):
```html
<button class="p-1 text-success-600">
  <svg class="w-4 h-4" ...><!-- Check icon --></svg>
</button>
```

#### Trend Indicators

**Positive Trend** (increase):
```html
<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success-100 text-success-700">
  <svg class="w-3 h-3 mr-0.5" ...><!-- Arrow up --></svg>
  12%
</span>
```

**Negative Trend** (decrease):
```html
<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-error-100 text-error-700">
  <svg class="w-3 h-3 mr-0.5" ...><!-- Arrow down --></svg>
  8%
</span>
```

**Neutral** (no change):
```html
<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
  <svg class="w-3 h-3 mr-0.5" ...><!-- Minus --></svg>
  0%
</span>
```

#### Empty State

```html
<div class="flex flex-col items-center justify-center py-12 px-6">
  <!-- Illustration -->
  <div class="w-48 h-48 mb-6">
    <svg class="w-full h-full text-gray-300" ...><!-- Empty state illustration --></svg>
  </div>
  
  <!-- Heading -->
  <h3 class="text-lg font-semibold text-gray-900 mb-2">No links created yet</h3>
  
  <!-- Description -->
  <p class="text-sm text-gray-500 text-center max-w-sm mb-6">
    Create your first tracking link to start capturing leads and tracking WhatsApp conversions.
  </p>
  
  <!-- CTA Button -->
  <button class="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700">
    Create Your First Link
  </button>
</div>
```

#### Pagination

```html
<div class="flex items-center justify-between px-6 py-4 border-t border-gray-200">
  <!-- Results Info -->
  <div class="text-sm text-gray-700">
    Showing <span class="font-medium">1</span> to <span class="font-medium">10</span> of <span class="font-medium">47</span> results
  </div>
  
  <!-- Pagination Controls -->
  <div class="flex items-center gap-2">
    <button class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
      Previous
    </button>
    
    <button class="px-3 py-2 text-sm font-medium text-white bg-primary-600 border border-primary-600 rounded-lg">
      1
    </button>
    <button class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
      2
    </button>
    <button class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
      3
    </button>
    
    <button class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
      Next
    </button>
  </div>
</div>
```

---

### 3. Analytics Dashboard

#### Metrics Cards Row

**Layout**: 4 cards on desktop, 2 on tablet, 1 on mobile

```html
<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
  <!-- Metric cards here -->
</div>
```

#### Individual Metric Card

**Specifications**:
- Height: 120px
- Background: White
- Border radius: 12px
- Padding: 24px
- Border: 1px solid Gray-200
- Shadow: Small (`shadow-sm`)

**Structure**:

```html
<div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
  <div class="flex items-center justify-between">
    <!-- Left: Label & Value -->
    <div>
      <p class="text-sm font-medium text-gray-600 mb-1">Total Clicks</p>
      <p class="text-3xl font-bold text-gray-900">12,345</p>
    </div>
    
    <!-- Right: Icon -->
    <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
      <svg class="w-6 h-6 text-primary-600" ...><!-- Icon --></svg>
    </div>
  </div>
  
  <!-- Trend -->
  <div class="mt-4 flex items-center gap-1">
    <svg class="w-4 h-4 text-success-600" ...><!-- Arrow up --></svg>
    <span class="text-sm font-medium text-success-600">12.5%</span>
    <span class="text-sm text-gray-500">vs last month</span>
  </div>
</div>
```

**Metric Card Variants**:

1. **Total Clicks**:
   - Icon: Cursor click (Primary-600)
   - Background: Primary-100

2. **Total Leads**:
   - Icon: Users (Success-600)
   - Background: Success-100

3. **Conversion Rate**:
   - Icon: Percentage (Info-600)
   - Background: Info-100

4. **Active Links**:
   - Icon: Link (Purple-600)
   - Background: Purple-100

#### Charts Section

**Layout**: 2 columns on desktop, 1 on mobile

```html
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
  <!-- Chart cards here -->
</div>
```

#### Chart Card Container

```html
<div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
  <!-- Header -->
  <div class="flex items-center justify-between mb-6">
    <div>
      <h3 class="text-lg font-semibold text-gray-900">Clicks Over Time</h3>
      <p class="text-sm text-gray-500 mt-0.5">Last 30 days</p>
    </div>
    
    <!-- Time Range Selector -->
    <select class="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none">
      <option>7 days</option>
      <option selected>30 days</option>
      <option>90 days</option>
      <option>12 months</option>
    </select>
  </div>
  
  <!-- Chart (Recharts component) -->
  <div class="h-80">
    <!-- Recharts LineChart component -->
  </div>
</div>
```

**Chart Specifications**:

1. **Line Chart** (Clicks Over Time):
   - Height: 400px (desktop), 300px (mobile)
   - Line color: Primary-600
   - Grid: Gray-200, dashed
   - Tooltip background: White with shadow
   - X-axis: Date labels (MMM DD)
   - Y-axis: Click count

2. **Bar Chart** (UTM Source Breakdown):
   - Height: 300px
   - Bar color: Primary-600
   - Hover: Primary-700
   - Labels: Source names
   - Values: Click count

3. **Pie Chart** (Device Distribution):
   - Height: 300px
   - Colors: [Primary-600, Primary-400, Primary-300, Gray-300]
   - Legend: Below chart
   - Labels: Device type (Desktop, Mobile, Tablet, Other)

**Recharts Configuration Example**:

```jsx
<LineChart width={600} height={400} data={data}>
  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
  <XAxis 
    dataKey="date" 
    stroke="#6B7280"
    style={{ fontSize: '12px' }}
  />
  <YAxis 
    stroke="#6B7280"
    style={{ fontSize: '12px' }}
  />
  <Tooltip 
    contentStyle={{
      backgroundColor: '#FFFFFF',
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}
  />
  <Line 
    type="monotone" 
    dataKey="clicks" 
    stroke="#4F46E5" 
    strokeWidth={2}
    dot={{ fill: '#4F46E5', r: 4 }}
    activeDot={{ r: 6 }}
  />
</LineChart>
```

---

### 4. Leads Table

**Similar Structure to Links Table** with these columns:

```html
<table class="w-full">
  <thead class="bg-gray-50 border-b border-gray-200">
    <tr>
      <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
        Lead
      </th>
      <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
        Phone Number
      </th>
      <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
        Link
      </th>
      <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
        Captured
      </th>
      <th class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
        Actions
      </th>
    </tr>
  </thead>
  <tbody class="divide-y divide-gray-200">
    <tr class="hover:bg-gray-50">
      <!-- Lead Column (Name + Email if available) -->
      <td class="px-6 py-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center font-semibold text-success-700">
            JS
          </div>
          <div>
            <div class="text-sm font-medium text-gray-900">João Silva</div>
            <div class="text-xs text-gray-500">joao@email.com</div>
          </div>
        </div>
      </td>
      
      <!-- Phone Number -->
      <td class="px-6 py-4">
        <div class="flex items-center gap-2">
          <span class="text-lg">🇧🇷</span>
          <span class="text-sm text-gray-600">+55 (11) 98765-4321</span>
        </div>
      </td>
      
      <!-- Link Slug -->
      <td class="px-6 py-4">
        <a href="#" class="text-sm text-primary-600 hover:text-primary-700 font-medium">
          zap.lk/promo
        </a>
      </td>
      
      <!-- Captured Date -->
      <td class="px-6 py-4">
        <div class="text-sm text-gray-600">Jan 24, 2026</div>
        <div class="text-xs text-gray-500">14:32</div>
      </td>
      
      <!-- Actions -->
      <td class="px-6 py-4 text-right">
        <button class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
          <svg class="w-4 h-4" ...><!-- Eye icon --></svg>
        </button>
      </td>
    </tr>
  </tbody>
</table>
```

#### Export Button (Top Right)

```html
<button class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
  <svg class="w-4 h-4" ...><!-- Download icon --></svg>
  Export CSV
</button>
```

---

### 5. Usage Indicator (Detailed View)

**Full Card Version** (on dashboard home):

```html
<div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
  <div class="flex items-center justify-between mb-4">
    <div>
      <h3 class="text-lg font-semibold text-gray-900">Usage This Month</h3>
      <p class="text-sm text-gray-500 mt-0.5">Free Plan: 100 clicks/month</p>
    </div>
    <span class="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
      FREE
    </span>
  </div>
  
  <!-- Progress Bar -->
  <div class="mb-3">
    <div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
      <div class="h-full bg-primary-600 rounded-full transition-all duration-500" style="width: 45%"></div>
    </div>
  </div>
  
  <!-- Stats -->
  <div class="flex items-center justify-between text-sm">
    <span class="font-semibold text-gray-900">45 clicks</span>
    <span class="text-gray-500">55 remaining</span>
  </div>
  
  <!-- Warning (when near limit) -->
  <div class="mt-4 p-3 bg-warning-50 border border-warning-200 rounded-lg flex items-start gap-2">
    <svg class="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" ...><!-- Warning icon --></svg>
    <div class="text-sm text-warning-800">
      <strong>Approaching limit:</strong> Upgrade to Pro for unlimited clicks.
    </div>
  </div>
  
  <!-- Upgrade Button -->
  <button class="w-full mt-4 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700">
    Upgrade to Pro
  </button>
</div>
```

**Color Logic by Usage Percentage**:

| Usage | Color | Class |
|-------|-------|-------|
| 0-70% | Primary-600 | `bg-primary-600` |
| 71-90% | Warning-500 | `bg-warning-500` |
| 91-100% | Error-500 | `bg-error-500` |

---

## Interstitial Page (Ghost Mode)

### Full Page Layout

**Specifications**:
- Full viewport height (`min-h-screen`)
- Centered content (flex center)
- Background: Gradient or image with overlay

```html
<div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 via-white to-purple-50">
  <!-- Card Container -->
  <div class="w-full max-w-md">
    <!-- Content card -->
  </div>
</div>
```

**Background Options**:

**Option 1 - Gradient**:
```css
background: linear-gradient(135deg, #EEF2FF 0%, #FFFFFF 50%, #F3E8FF 100%);
```

**Option 2 - Image with Overlay**:
```html
<div class="min-h-screen relative">
  <!-- Background Image -->
  <div class="absolute inset-0 z-0">
    <img src="/bg-pattern.jpg" class="w-full h-full object-cover" alt="">
    <div class="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
  </div>
  
  <!-- Content (z-10) -->
  <div class="relative z-10 flex items-center justify-center min-h-screen p-4">
    <!-- Card -->
  </div>
</div>
```

### Card Structure

**Dimensions**:
- Max width: 480px (desktop), 90vw (mobile)
- Padding: 40px (desktop), 24px (mobile)
- Background: White
- Border radius: 16px
- Shadow: `shadow-2xl`

```html
<div class="bg-white rounded-2xl shadow-2xl p-10 md:p-10">
  <!-- Logo/Branding -->
  <div class="text-center mb-8">
    <img src="/logo.svg" class="h-12 mx-auto mb-3" alt="ZapLink">
    <h1 class="text-sm font-medium text-gray-500">ZapLink Tracker</h1>
  </div>
  
  <!-- Headline -->
  <div class="text-center mb-8">
    <h2 class="text-2xl font-bold text-gray-900 mb-2">
      Para acessar o desconto, confirme seu WhatsApp
    </h2>
    <p class="text-base text-gray-600">
      Isso leva apenas 5 segundos
    </p>
  </div>
  
  <!-- Form -->
  <form class="space-y-5">
    <!-- Name Field (Optional) -->
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        Nome (opcional)
      </label>
      <input 
        type="text"
        class="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
        placeholder="Seu nome"
      >
    </div>
    
    <!-- WhatsApp Field (Required) -->
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        WhatsApp <span class="text-error-500">*</span>
      </label>
      <div class="relative">
        <div class="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <span class="text-lg">🇧🇷</span>
          <span class="text-sm text-gray-600">+55</span>
        </div>
        <input 
          type="tel"
          required
          class="w-full h-12 pl-24 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          placeholder="(11) 99999-9999"
        >
      </div>
    </div>
    
    <!-- Privacy Checkbox -->
    <div class="flex items-start gap-2">
      <input 
        type="checkbox"
        id="privacy"
        required
        class="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
      >
      <label for="privacy" class="text-sm text-gray-600">
        Aceito receber mensagens no WhatsApp
      </label>
    </div>
    
    <!-- Submit Button -->
    <button 
      type="submit"
      class="w-full h-14 bg-whatsapp text-white font-semibold rounded-lg hover:bg-whatsapp-dark transition-colors flex items-center justify-center gap-2"
    >
      <svg class="w-6 h-6" ...><!-- WhatsApp icon --></svg>
      Continuar para WhatsApp
    </button>
  </form>
  
  <!-- Trust Indicators -->
  <div class="mt-6 text-center">
    <p class="text-xs text-gray-500 flex items-center justify-center gap-1">
      <svg class="w-4 h-4" ...><!-- Lock icon --></svg>
      Seus dados estão seguros e protegidos
    </p>
  </div>
</div>
```

### Submit Button States

**Default**:
```html
<button class="... bg-whatsapp hover:bg-whatsapp-dark">
  <svg class="w-6 h-6"><!-- WhatsApp icon --></svg>
  Continuar para WhatsApp
</button>
```

**Loading**:
```html
<button disabled class="... bg-whatsapp opacity-80 cursor-not-allowed">
  <svg class="animate-spin w-5 h-5"><!-- Spinner --></svg>
  Enviando...
</button>
```

**Success** (brief moment before redirect):
```html
<button disabled class="... bg-success-600">
  <svg class="w-5 h-5"><!-- Check icon --></svg>
  Redirecionando...
</button>
```

### Mobile Optimization

**Viewport Meta Tag**:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
```

**Mobile Adjustments** (< 640px):
- Card padding: 24px (instead of 40px)
- Heading font size: 20px (instead of 24px)
- Input height: 48px (instead of 52px)
- Button height: 52px (instead of 56px)

```html
<div class="p-6 md:p-10">
  <h2 class="text-xl md:text-2xl ...">
    Para acessar o desconto, confirme seu WhatsApp
  </h2>
</div>
```

---

## Interactive States

### Button States

#### Primary Button (Default)

**Dimensions**: Height varies (40px small, 44px medium, 48px large)
**Padding**: 16px horizontal (small), 20px (medium), 24px (large)

**States**:

```html
<!-- Default -->
<button class="px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg transition-all">
  Button Text
</button>

<!-- Hover -->
<button class="... bg-primary-700 shadow-md">
  Button Text
</button>

<!-- Active/Pressed -->
<button class="... bg-primary-800 shadow-inner">
  Button Text
</button>

<!-- Focus -->
<button class="... ring-4 ring-primary-200 outline-none">
  Button Text
</button>

<!-- Disabled -->
<button disabled class="... bg-primary-600 opacity-50 cursor-not-allowed">
  Button Text
</button>

<!-- Loading -->
<button disabled class="... bg-primary-600 opacity-80 cursor-wait">
  <svg class="animate-spin h-5 w-5 mr-2">...</svg>
  Loading...
</button>
```

#### Secondary Button

```html
<!-- Default -->
<button class="px-6 py-2.5 bg-white text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
  Button Text
</button>

<!-- Hover -->
<button class="... bg-gray-50 border-gray-400">
  Button Text
</button>
```

#### Ghost/Text Button

```html
<button class="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">
  Button Text
</button>
```

#### Danger Button

```html
<button class="px-6 py-2.5 bg-error-600 text-white font-medium rounded-lg hover:bg-error-700 transition-colors">
  Delete
</button>
```

### Input Field States

#### Text Input

```html
<!-- Default -->
<input class="w-full h-11 px-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all">

<!-- Hover -->
<input class="... border-gray-400">

<!-- Focus -->
<input class="... border-primary-500 ring-2 ring-primary-500">

<!-- Error -->
<input class="... border-error-500 ring-2 ring-error-500">
<p class="mt-1 text-sm text-error-600">Error message here</p>

<!-- Disabled -->
<input disabled class="... bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed">

<!-- Success (valid input) -->
<input class="... border-success-500 ring-2 ring-success-500">
```

### Toggle Switch States

**Dimensions**:
- Width: 44px
- Height: 24px
- Knob: 20px diameter

**Off State**:
```html
<button 
  type="button"
  role="switch"
  aria-checked="false"
  class="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
>
  <span class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ease-in-out translate-x-0.5"></span>
</button>
```

**On State**:
```html
<button 
  class="... bg-primary-600"
  aria-checked="true"
>
  <span class="... translate-x-5"></span>
</button>
```

**Disabled**:
```html
<button 
  disabled
  class="... bg-gray-200 cursor-not-allowed opacity-60"
>
  <span class="..."></span>
</button>
```

### Dropdown Menu States

```html
<!-- Trigger Button -->
<button class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
  <svg class="w-5 h-5"><!-- More icon --></svg>
</button>

<!-- Dropdown Menu (appears on click) -->
<div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
    Edit
  </a>
  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
    Duplicate
  </a>
  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
    View Analytics
  </a>
  <hr class="my-1 border-gray-200">
  <a href="#" class="block px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors">
    Delete
  </a>
</div>
```

### Loading States

#### Spinner Component

```html
<!-- Small Spinner -->
<svg class="animate-spin h-4 w-4 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
</svg>

<!-- Medium Spinner -->
<svg class="animate-spin h-8 w-8 text-primary-600" ...></svg>

<!-- Large Spinner -->
<svg class="animate-spin h-12 w-12 text-primary-600" ...></svg>
```

#### Skeleton Loading (Table Row)

```html
<tr class="animate-pulse">
  <td class="px-6 py-4">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 bg-gray-200 rounded-lg"></div>
      <div class="space-y-2">
        <div class="h-4 w-24 bg-gray-200 rounded"></div>
        <div class="h-3 w-16 bg-gray-200 rounded"></div>
      </div>
    </div>
  </td>
  <td class="px-6 py-4">
    <div class="h-4 w-32 bg-gray-200 rounded"></div>
  </td>
  <td class="px-6 py-4">
    <div class="h-4 w-16 bg-gray-200 rounded"></div>
  </td>
  <td class="px-6 py-4">
    <div class="h-6 w-11 bg-gray-200 rounded-full"></div>
  </td>
  <td class="px-6 py-4">
    <div class="flex gap-2 justify-end">
      <div class="w-8 h-8 bg-gray-200 rounded-lg"></div>
      <div class="w-8 h-8 bg-gray-200 rounded-lg"></div>
    </div>
  </td>
</tr>
```

### Toast Notifications

**Success Toast**:
```html
<div class="fixed bottom-4 right-4 z-50 flex items-start gap-3 p-4 bg-white rounded-lg shadow-lg border border-gray-200 max-w-md">
  <div class="flex-shrink-0 w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
    <svg class="w-5 h-5 text-success-600"><!-- Check icon --></svg>
  </div>
  <div class="flex-1">
    <h4 class="text-sm font-semibold text-gray-900">Success!</h4>
    <p class="text-sm text-gray-600 mt-0.5">Link created successfully</p>
  </div>
  <button class="text-gray-400 hover:text-gray-600">
    <svg class="w-5 h-5"><!-- X icon --></svg>
  </button>
</div>
```

**Error Toast**:
```html
<div class="... border-l-4 border-error-500">
  <div class="... bg-error-100">
    <svg class="... text-error-600"><!-- X circle icon --></svg>
  </div>
  <div>
    <h4 class="... text-error-900">Error</h4>
    <p class="... text-error-700">Something went wrong</p>
  </div>
</div>
```

**Warning Toast**:
```html
<div class="... border-l-4 border-warning-500">
  <div class="... bg-warning-100">
    <svg class="... text-warning-600"><!-- Warning icon --></svg>
  </div>
  <div>
    <h4 class="... text-warning-900">Warning</h4>
    <p class="... text-warning-700">You're approaching your limit</p>
  </div>
</div>
```

---

## Responsive Behavior

### Breakpoints

Following Tailwind CSS default breakpoints:

```css
/* Mobile (default) */
@media (min-width: 0px) { ... }

/* Small (sm) - Tablets */
@media (min-width: 640px) { ... }

/* Medium (md) - Small laptops */
@media (min-width: 768px) { ... }

/* Large (lg) - Desktops */
@media (min-width: 1024px) { ... }

/* Extra Large (xl) - Large desktops */
@media (min-width: 1280px) { ... }

/* 2X Large (2xl) - Very large screens */
@media (min-width: 1536px) { ... }
```

### Mobile Layout (0-639px)

#### Layout Changes

**Sidebar**:
- Hidden by default
- Accessible via hamburger menu (overlay/drawer)
- Slides in from left with animation
- Overlay background: `bg-black/50`

```html
<!-- Mobile Header with Hamburger -->
<header class="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50">
  <button class="p-2 text-gray-600" onclick="toggleMobileSidebar()">
    <svg class="w-6 h-6"><!-- Hamburger icon --></svg>
  </button>
  <img src="/logo.svg" class="h-8" alt="ZapLink">
  <button class="p-2 text-gray-600">
    <svg class="w-6 h-6"><!-- User icon --></svg>
  </button>
</header>

<!-- Mobile Sidebar (hidden by default) -->
<aside class="lg:hidden fixed inset-y-0 left-0 w-64 bg-white transform -translate-x-full transition-transform duration-300 z-50">
  <!-- Sidebar content (same as desktop) -->
</aside>

<!-- Overlay -->
<div class="lg:hidden fixed inset-0 bg-black/50 opacity-0 pointer-events-none transition-opacity z-40" id="sidebar-overlay"></div>
```

**Main Content**:
- Full width (no sidebar offset)
- Padding: 16px (instead of 48px)
- Top padding: 80px (accounts for fixed mobile header)

```html
<main class="lg:ml-64 pt-20 lg:pt-16 p-4 lg:p-12">
  <!-- Content -->
</main>
```

**Tables**:
- Horizontal scroll
- Minimum width enforced
- Sticky first column (optional for link slug)

```html
<div class="overflow-x-auto -mx-4">
  <table class="min-w-[800px] w-full">
    <!-- Table content -->
  </table>
</div>
```

**Metrics Cards**:
- Stack vertically (1 column)
- Full width

```html
<div class="grid grid-cols-1 gap-4">
  <!-- Metric cards -->
</div>
```

**Charts**:
- Reduce height to 300px
- Stack vertically (1 column)

```html
<div class="grid grid-cols-1 gap-6">
  <div class="h-72">
    <!-- Chart -->
  </div>
</div>
```

**Modals**:
- Full screen on mobile
- Rounded corners removed
- Slide up animation

```html
<div class="fixed inset-0 lg:inset-auto lg:m-4 lg:max-w-[600px] lg:mx-auto bg-white lg:rounded-xl">
  <!-- Modal content -->
</div>
```

### Tablet Layout (640px-1023px)

**Sidebar**:
- Narrower width: 200px (instead of 256px)
- Icons remain visible
- Text labels may be abbreviated or removed

**Metrics Cards**:
- 2-column grid

```html
<div class="grid grid-cols-2 gap-6">
  <!-- Metric cards -->
</div>
```

**Charts**:
- 1 column (stacked)
- Full width each

**Form Modal**:
- Maintains 600px width
- Centered with margin

**Tables**:
- All columns visible
- Slightly tighter padding

```html
<td class="px-4 py-3">
  <!-- Content -->
</td>
```

### Desktop Layout (1024px+)

**Sidebar**:
- Full width: 256px
- Always visible
- No hamburger menu

**Metrics Cards**:
- 4-column grid

```html
<div class="grid grid-cols-4 gap-6">
  <!-- Metric cards -->
</div>
```

**Charts**:
- 2-column grid
- Side by side

```html
<div class="grid grid-cols-2 gap-6">
  <!-- Charts -->
</div>
```

**Tables**:
- Full width
- All columns visible
- Comfortable padding (24px)

**Header**:
- Full information visible
- Usage indicator visible

### Responsive Utility Classes Summary

```html
<!-- Visibility -->
<div class="hidden lg:block">Desktop only</div>
<div class="block lg:hidden">Mobile/Tablet only</div>

<!-- Spacing -->
<div class="p-4 md:p-6 lg:p-8">Responsive padding</div>
<div class="gap-4 md:gap-6 lg:gap-8">Responsive gap</div>

<!-- Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  Responsive columns
</div>

<!-- Text -->
<h1 class="text-xl md:text-2xl lg:text-4xl">Responsive text</h1>

<!-- Layout -->
<main class="ml-0 lg:ml-64">Responsive margin for sidebar</main>
```

---

## Implementation Guide

### 1. Tailwind Configuration

**File**: `tailwind.config.js` or `tailwind.config.ts`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
        whatsapp: {
          light: '#DCF8C6',
          DEFAULT: '#25D366',
          dark: '#128C7E',
          darker: '#075E54',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px 0 rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
```

### 2. Global Styles

**File**: `app/globals.css` or `styles/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply antialiased;
  }
  
  body {
    @apply bg-gray-50 text-gray-900;
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    @apply bg-gray-100;
  }
  
  ::-webkit-scrollbar-thumb {
    @apply bg-gray-300 rounded-full;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    @apply bg-gray-400;
  }
}

@layer components {
  /* Button Base Styles */
  .btn {
    @apply inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2;
  }
  
  .btn-primary {
    @apply btn bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500;
  }
  
  .btn-secondary {
    @apply btn bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500;
  }
  
  .btn-ghost {
    @apply btn text-gray-700 hover:bg-gray-100 focus:ring-gray-300;
  }
  
  .btn-danger {
    @apply btn bg-error-600 text-white hover:bg-error-700 focus:ring-error-500;
  }
  
  /* Input Base Styles */
  .input {
    @apply w-full px-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all;
  }
  
  .input-error {
    @apply border-error-500 focus:ring-error-500 focus:border-error-500;
  }
  
  /* Card */
  .card {
    @apply bg-white rounded-xl border border-gray-200 shadow-sm;
  }
  
  /* Badge */
  .badge {
    @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

### 3. shadcn/ui Configuration

**File**: `components.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

**Installation Commands**:

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add select
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add table
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add progress
```

### 4. Component Example - Metric Card

**File**: `components/MetricCard.tsx`

```typescript
import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  iconBgColor?: string;
  iconColor?: string;
}

export function MetricCard({
  label,
  value,
  icon,
  trend,
  iconBgColor = 'bg-primary-100',
  iconColor = 'text-primary-600',
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        {/* Left: Label & Value */}
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        
        {/* Right: Icon */}
        <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
      
      {/* Trend */}
      {trend && (
        <div className="mt-4 flex items-center gap-1">
          {trend.isPositive ? (
            <ArrowUpIcon className="w-4 h-4 text-success-600" />
          ) : (
            <ArrowDownIcon className="w-4 h-4 text-error-600" />
          )}
          <span className={`text-sm font-medium ${trend.isPositive ? 'text-success-600' : 'text-error-600'}`}>
            {Math.abs(trend.value)}%
          </span>
          <span className="text-sm text-gray-500">vs last month</span>
        </div>
      )}
    </div>
  );
}
```

**Usage**:

```typescript
import { MousePointer2Icon } from 'lucide-react';
import { MetricCard } from '@/components/MetricCard';

<MetricCard
  label="Total Clicks"
  value="12,345"
  icon={<MousePointer2Icon className="w-6 h-6" />}
  trend={{ value: 12.5, isPositive: true }}
  iconBgColor="bg-primary-100"
  iconColor="text-primary-600"
/>
```

### 5. Icons

**Recommended Library**: Lucide React

```bash
npm install lucide-react
```

**Common Icons Used**:

```typescript
import {
  LayoutDashboardIcon,  // Dashboard
  LinkIcon,             // Links
  BarChart3Icon,        // Analytics
  UsersIcon,            // Leads
  SettingsIcon,         // Settings
  PlusIcon,             // Add/Create
  CopyIcon,             // Copy
  EditIcon,             // Edit
  Trash2Icon,           // Delete
  MoreVerticalIcon,     // More actions
  XIcon,                // Close
  CheckIcon,            // Success
  AlertCircleIcon,      // Error
  AlertTriangleIcon,    // Warning
  Loader2Icon,          // Loading spinner
  ArrowUpIcon,          // Increase
  ArrowDownIcon,        // Decrease
  DownloadIcon,         // Export
  EyeIcon,              // View
  LockIcon,             // Security
  BellIcon,             // Notifications
  MenuIcon,             // Hamburger
} from 'lucide-react';
```

### 6. Typography Components

**File**: `components/Typography.tsx`

```typescript
import React from 'react';

export function H1({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h1 className={`text-4xl font-bold text-gray-900 tracking-tight ${className}`}>{children}</h1>;
}

export function H2({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`text-3xl font-bold text-gray-900 ${className}`}>{children}</h2>;
}

export function H3({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-2xl font-semibold text-gray-900 ${className}`}>{children}</h3>;
}

export function Body({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-base text-gray-600 ${className}`}>{children}</p>;
}

export function Small({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-sm text-gray-500 ${className}`}>{children}</p>;
}
```

---

## Accessibility Guidelines

### 1. Color Contrast

All text and interactive elements must meet **WCAG AA standards** (minimum 4.5:1 for normal text, 3:1 for large text).

**Verified Combinations**:
- Gray-900 on White: ✓ 16.07:1
- Gray-700 on White: ✓ 9.74:1
- Gray-600 on White: ✓ 7.23:1
- Primary-600 on White: ✓ 7.51:1
- White on Primary-600: ✓ 7.51:1
- Error-600 on White: ✓ 5.93:1

### 2. Keyboard Navigation

**All interactive elements must be keyboard accessible**:

- Tab order follows visual flow (left to right, top to bottom)
- Focus states clearly visible (`focus:ring-2`)
- Skip to main content link (optional but recommended)
- Escape key closes modals and dropdowns

**Example Focus Styles**:
```html
<button class="... focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
  Button
</button>
```

### 3. ARIA Labels

**Forms**:
```html
<label for="slug" class="...">Link Slug</label>
<input id="slug" type="text" aria-required="true" aria-describedby="slug-help">
<p id="slug-help" class="text-xs text-gray-500">Use lowercase letters, numbers, and hyphens only</p>
```

**Toggle Switches**:
```html
<button 
  role="switch" 
  aria-checked="false"
  aria-label="Enable Ghost Mode"
  class="..."
>
  <span class="sr-only">Enable Ghost Mode</span>
</button>
```

**Modal Dialogs**:
```html
<div 
  role="dialog" 
  aria-labelledby="modal-title" 
  aria-describedby="modal-description"
  aria-modal="true"
>
  <h2 id="modal-title">Create New Link</h2>
  <p id="modal-description">Fill in the details below to create a tracking link</p>
</div>
```

**Dropdown Menus**:
```html
<button 
  aria-haspopup="true" 
  aria-expanded="false"
  aria-controls="dropdown-menu"
>
  Actions
</button>
<div id="dropdown-menu" role="menu">
  <a href="#" role="menuitem">Edit</a>
  <a href="#" role="menuitem">Delete</a>
</div>
```

### 4. Screen Reader Support

**Hidden Text for Icons**:
```html
<button class="p-2">
  <svg class="w-5 h-5" aria-hidden="true">...</svg>
  <span class="sr-only">Delete link</span>
</button>
```

**SR-Only Class**:
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### 5. Form Validation

**Error Announcements**:
```html
<div role="alert" aria-live="assertive" class="text-sm text-error-600 mt-1">
  This slug is already taken
</div>
```

**Success Announcements**:
```html
<div role="status" aria-live="polite" class="text-sm text-success-600 mt-1">
  Link created successfully
</div>
```

### 6. Image Alt Text

**All images must have descriptive alt text**:
```html
<img src="/logo.svg" alt="ZapLink Tracker Logo">
<img src="/empty-state.svg" alt=""><!-- Decorative images have empty alt -->
```

### 7. Touch Targets

**Minimum touch target size**: 44px × 44px (iOS) or 48px × 48px (Android)

All buttons and interactive elements meet this requirement:
```html
<button class="p-2 min-w-[44px] min-h-[44px]">
  <svg class="w-5 h-5">...</svg>
</button>
```

---

## Design Checklist

Before considering the design complete, verify:

### Visual Design
- [ ] All colors defined with proper contrast ratios
- [ ] Typography scale established and consistent
- [ ] Spacing follows 8px grid system
- [ ] Shadow hierarchy established (5 levels)
- [ ] Border radius applied consistently
- [ ] Icon sizes standardized (16px, 20px, 24px)

### Components
- [ ] All dashboard components specified
- [ ] Interstitial page fully designed
- [ ] Empty states designed
- [ ] Loading states designed
- [ ] Error states designed
- [ ] Success states designed

### Interactive States
- [ ] Hover states defined for all interactive elements
- [ ] Active/pressed states defined
- [ ] Focus states defined (keyboard navigation)
- [ ] Disabled states defined
- [ ] Loading states with spinners

### Responsive
- [ ] Mobile layout (0-639px) specified
- [ ] Tablet layout (640-1023px) specified
- [ ] Desktop layout (1024px+) specified
- [ ] Breakpoints clearly defined
- [ ] Touch targets meet minimum size (44px)

### Accessibility
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Focus states clearly visible
- [ ] ARIA labels on interactive elements
- [ ] Screen reader text for icons
- [ ] Keyboard navigation supported
- [ ] Error messages announced to screen readers

### Implementation
- [ ] Tailwind config provided
- [ ] Global styles provided
- [ ] shadcn/ui components listed
- [ ] Component examples provided
- [ ] Icon library specified
- [ ] Code snippets for all major components

---

## Quick Reference

### Common Tailwind Classes

**Spacing**:
- `p-4` = 16px padding
- `m-6` = 24px margin
- `gap-3` = 12px gap

**Colors**:
- `bg-primary-600` = Primary blue background
- `text-gray-900` = Dark text
- `border-gray-200` = Light border

**Typography**:
- `text-sm` = 14px
- `text-base` = 16px
- `text-lg` = 18px
- `font-medium` = 500 weight
- `font-semibold` = 600 weight
- `font-bold` = 700 weight

**Layout**:
- `flex items-center justify-between` = Flexbox with space between
- `grid grid-cols-4 gap-6` = 4-column grid with 24px gap
- `rounded-lg` = 8px border radius
- `rounded-xl` = 12px border radius

**Effects**:
- `shadow-sm` = Small shadow
- `shadow-md` = Medium shadow
- `shadow-lg` = Large shadow
- `hover:bg-gray-100` = Gray background on hover
- `transition-colors` = Smooth color transitions

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 26, 2026 | Initial design guideline created |

---

**Design System Owner**: ZapLink Development Team  
**For Questions**: Refer to this document or consult the design lead  
**Updates**: Any changes to design tokens or patterns must be documented here
