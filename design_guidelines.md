# BusBuddy Design Guidelines

## Design Approach: Reference-Based + Custom Eco-Theme

**Primary Inspiration:** Modern sustainability-focused applications (Notion's clean layouts + Apple's minimalism + custom glassmorphism treatment)

**Core Theme:** "Green Intelligence: AI for a Sustainable Planet" - conveying trust, innovation, and environmental consciousness through visual design.

---

## Typography System

**Font Families:**
- Primary: Inter (via Google Fonts) - clean, modern, highly legible
- Accent: Space Grotesk (for headings and hero text) - tech-forward aesthetic

**Hierarchy:**
- Hero Headlines: text-5xl to text-7xl, font-bold
- Section Headers: text-3xl to text-4xl, font-semibold
- Subsections: text-xl to text-2xl, font-medium
- Body Text: text-base to text-lg, font-normal
- Captions/Labels: text-sm, font-medium
- Dashboard Metrics: text-4xl font-bold (for large numbers like CO₂ saved)

---

## Layout & Spacing System

**Tailwind Spacing Primitives:** Use units of 2, 4, 6, 8, 12, 16, 20, 24

**Container Strategy:**
- Landing page sections: max-w-7xl mx-auto px-6
- Dashboard content: max-w-screen-2xl mx-auto with sidebar navigation
- Modals/Cards: max-w-md to max-w-2xl depending on content

**Section Padding:**
- Landing sections: py-20 lg:py-32
- Dashboard cards: p-6 to p-8
- Modal content: p-8

---

## Glassmorphism Treatment

**Card Specifications:**
- Background: backdrop-blur-xl bg-white/10 (light mode) or bg-gray-900/40 (dark mode)
- Border: border border-white/20
- Shadow: shadow-2xl with subtle glow effect
- Border radius: rounded-2xl to rounded-3xl

**Floating Elements:**
- Apply subtle transform and shadow: hover:scale-105 transition-transform duration-300
- Use z-index layering: z-10, z-20, z-30 for depth hierarchy

---

## Component Library

### Landing Page Components

**Hero Section:**
- Full-viewport height (min-h-screen) with centered content
- Large hero image: Aerial view of sustainable city with modern buses, overlay with gradient (from-green-900/80 to-transparent)
- Hero headline + subtitle + primary CTA button ("Get Started")
- Top-right corner: "Sign In | Log In" buttons with subtle glassmorphism background
- Floating animation: gentle up-down movement on hero elements (translate-y motion)

**Feature Sections:**
- 3-column grid layout (grid-cols-1 md:grid-cols-3 gap-8)
- Each feature card: glassmorphism treatment, icon at top, title, description
- Icons: Use Heroicons (outline style) via CDN
- Features to highlight: Real-time Tracking, AI-Powered ETA, Eco Analytics, Role-Based Access

**Social Proof Section:**
- Stats display: "X kg CO₂ Saved Daily" | "X Active Buses" | "X Cities"
- Large numbers (text-5xl font-bold) with smaller labels beneath

### Authentication Modal

**Modal Container:**
- Centered overlay: fixed inset-0 with backdrop-blur-sm bg-black/50
- Modal card: max-w-md with glassmorphism treatment
- Close button (X) in top-right corner

**Authentication Options:**
- Stacked vertically with gap-4
- Google Sign-In button: Full-width with Google logo icon, bg-white text-gray-900
- Phone OTP: Input field with country code selector + verification code input
- Email/Password: Two input fields stacked with "Forgot Password?" link
- Each auth method separated by subtle divider with "OR" text

### Dashboard Layout

**Sidebar Navigation:**
- Fixed left sidebar (w-64) with glassmorphism background
- Logo at top
- Role switcher tabs: Passenger | Driver | Admin (active state with green accent)
- Navigation items with icons (from Heroicons)
- User profile section at bottom

**Main Dashboard Area:**
- Grid layout for cards: grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6
- Map card: Takes 2 columns on large screens (col-span-2), full height
- Analytics cards: 1 column each with glassmorphism treatment

**Map Component:**
- Full-width container with rounded-2xl overflow-hidden
- Real-time bus markers: Custom green circular markers with bus icon
- ETA countdown timer: Floating glassmorphism card overlay in top-right of map (absolute positioning)

**Eco-Analytics Cards:**
- CO₂ Saved Today: Large number display with green tree icon, trend indicator (↑ arrow)
- Fuel Efficiency Graph: Line chart with gradient fill (green theme)
- Eco-Route Visualizer: Mini map preview showing recommended vs standard route with savings indicator

### Role-Specific Views

**Driver Interface:**
- GPS sharing toggle: Large prominent switch with status indicator
- Traffic report button: Quick-action floating button (bottom-right)
- Current route display with next stops list

**Admin Panel:**
- Bus fleet overview: Table with live status indicators (active, idle, maintenance)
- System analytics: Multi-metric dashboard with graphs
- Route management: Drag-and-drop interface suggestion (visual indication only)

---

## Animation Guidelines

**Use Sparingly - Strategic Animation Only:**
- Landing page: Gentle floating animation on hero elements (2-3 second loop)
- Dashboard: Smooth transitions on card hover (scale, shadow changes)
- Map markers: Subtle pulse animation on active buses
- Modal: Fade-in with scale animation (duration-300)
- Data updates: Number count-up animation for metrics

**Avoid:**
- Scroll-triggered animations
- Excessive parallax effects
- Auto-playing carousels

---

## Icons & Assets

**Icon Library:** Heroicons (outline style) via CDN
**Common Icons Needed:**
- Navigation: map-pin, clock, chart-bar, cog, user-circle
- Features: truck, leaf, lightning-bolt, shield-check
- Actions: plus, check, x-mark, arrow-right

**Images:**
1. **Hero Image:** Aerial view of modern sustainable city with green buses on clean streets, eco-friendly infrastructure. Position: Full-width background with gradient overlay
2. **Dashboard Placeholder:** Small eco-themed illustrations for empty states

---

## Accessibility & Form Standards

- All form inputs: Consistent height (h-12), rounded-lg borders, focus ring with green accent
- Button states: Clear hover, active, disabled states with opacity changes
- Labels: Always visible above inputs (not floating)
- Error states: Red border with error message text-sm text-red-500
- Success states: Green border with checkmark icon

---

## Responsive Behavior

**Mobile (< 768px):**
- Stack all multi-column layouts to single column
- Hide sidebar, replace with hamburger menu
- Map takes full width with reduced height (h-96)
- Floating elements become fixed position cards

**Tablet (768px - 1024px):**
- 2-column grid for dashboard cards
- Sidebar remains visible but narrower (w-48)

**Desktop (> 1024px):**
- Full 3-column grid for analytics
- Map takes 2/3 width with analytics sidebar on right

---

## Key Design Principles

1. **Eco-Forward Aesthetic:** Every visual element should reinforce sustainability message
2. **Glass-and-Float:** Glassmorphism creates depth, floating elements add dynamism
3. **Data-First:** Analytics and metrics are hero content, make them prominent
4. **Role-Aware:** Interface adapts intelligently based on user role
5. **Trust Through Transparency:** Real-time data visualization builds user confidence