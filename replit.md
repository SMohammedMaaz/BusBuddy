# BusBuddy - AI-Powered Sustainable Bus Tracking

## Overview

BusBuddy is a real-time bus tracking application with AI-powered ETA predictions and eco-routing capabilities. The application focuses on sustainability by tracking CO₂ savings, fuel reduction, and environmental impact metrics. It supports three user roles: passengers (tracking buses and viewing eco-analytics), drivers (reporting location and traffic), and administrators (managing fleet and viewing system-wide analytics).

The application uses a modern tech stack with React/TypeScript on the frontend, Express.js on the backend, and PostgreSQL for data persistence. It integrates with Google Maps for real-time location tracking and Firebase for authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**November 8, 2025 - Animated Bus Markers & Real-Time ETA System**
- **Animated Bus Markers**: Smooth animations with bounce effects
  - Created AnimatedBusMarker component using requestAnimationFrame
  - Buses transition smoothly between positions over 2 seconds with easing
  - Custom SVG bus icon with color-coded status (green=active, gray=inactive)
  - InfoWindow displays: bus number, route, status, speed, occupancy
  - Bounce animation on selected bus for visual feedback
  - Proper cleanup of animation frames
- **ETA Calculation Algorithm**: AI-powered timing predictions
  - Haversine formula for accurate distance calculation (accounts for Earth's curvature)
  - Real-time factors: distance, bus speed, road curvature (+20%), traffic buffer (2-5 min)
  - Schedule-based next bus arrival calculation
  - Utilities: formatETA (displays "5 mins", "1h 30m"), getETAStatusColor (color-codes by urgency)
  - Minutes until next bus with proper date/time handling
- **Real-Time ETA Display**: Live timing updates every 3 seconds
  - Glass-card-light ETA display in top-right corner of map
  - Shows: bus number, live tracking badge, ETA to next stop (large, color-coded), route name, occupancy
  - Updates automatically when bus selection changes or bus moves
  - Gradient colors and proper typography (Poppins, Inter)
- **Route Information Panel**: Comprehensive route details component
  - Route display: number, eco badge, service class, from/to locations
  - Next bus ETA with live countdown
  - Environmental impact stats (CO₂ saved, active schedules)
  - Scrollable stops list with visual indicators (green=start, red=end, gray=intermediate)
  - "Track This Route" action button
  - Light theme glassmorphism design
- **State Management Fix**: Critical bug fix for real-time updates
  - Changed Dashboard to use `selectedBusId` instead of `selectedBus` object
  - Derives selectedBus from live buses array each render
  - Ensures ETA and animations update with simulator (every 3 seconds)
- **Database Seeding**: Real Karnataka bus routes with authentic KSRTC data
  - **Mysuru Routes** (5 buses):
    - MYS101: City Bus Stand → Chamundi Hill (via Race Course, Nanjumalige, Hill Base)
    - MYS102: City Bus Stand → Bannur (via Mullahalli, Kadakola)
    - MYS103: City Bus Stand → Bogadi 2nd Stage (via Akashvani, Kuvempunagar, Hebbal)
    - MYS104: City Bus Stand → Srirampura (via Vivekananda Circle, Jayalakshmipuram)
    - MYS105: City Bus Stand → KRS (via Metagalli, Koorgalli, Brindavan Gardens)
  - **Bengaluru Routes** (5 buses):
    - BLR13: Shivajinagar → Banashankari TTMC (via Richmond Circle, Lalbagh, Jayanagar 4th Block)
    - BLR61: Majestic → Vijayanagar TTMC (via Corporation Circle, Hosahalli, Maruthi Mandir)
    - BLR171: Majestic → Koramangala 1st Block (via Richmond Circle, Adugodi, Forum Mall)
    - BLR333E: Majestic → Kadugodi/Whitefield (via Indiranagar, KR Puram, Whitefield)
    - BLR365J: Majestic → Jigani APC Circle (via BTM, Electronic City, Bommasandra)
  - **Data Specs**: 10 routes, 10 active buses, 70 schedules (7 per route throughout the day)
  - **GPS Coordinates**: Real latitude/longitude for each bus location
  - **Route Details**: Authentic from/to locations, via stops, departure times, and current status
  - Routes include eco-routing flags and CO₂ savings estimates

**November 8, 2025 - Complete Light Aesthetic Theme Implementation**
- **Complete Design Transformation**: Successfully transformed entire application from dark to light aesthetic eco theme with excellent text visibility
- **New Color Palette**: 
  - Background: Soft mint white (#FBFCFD) with mint tint
  - Primary: Fresh eco green (#1DB954)
  - Secondary: Clear sky blue (#0FA0CE)
  - Accent: Warm energy yellow (#FFB300)
  - Text: Dark readable (#1A2F3A) for excellent contrast
- **CSS Utilities Redesigned**: All custom classes rebuilt for light theme:
  - `.glass-card-light` - light glassmorphism for all cards
  - `.glass-nav-light` - light navbar with perfect glassmorphism
  - `.gradient-text` - eco green to sky blue gradient for headings
  - `.text-shadow-subtle` - subtle shadow for enhanced readability
  - Shadow system completely rebuilt with realistic depth for light backgrounds
- **Typography System**: Implemented across all components
  - Poppins for headings (`.heading-poppins`)
  - Nunito for subheadings (`.subheading-nunito`)
  - Inter for body text (`.body-inter`)
- **Landing Page - Fully Complete**:
  - ✅ Navbar: Light glassmorphism with Login/Sign Up buttons
  - ✅ Hero: Dark text on light gradient, perfect readability
  - ✅ Stats Cards: Glass-card-light with dark text and proper shadows
  - ✅ Features: All cards use light theme with text-foreground
  - ✅ Dashboards: Glass-card-light with gradient headings
  - ✅ CTA: Dark readable text on light background
  - ✅ Footer: Proper contrast and glassmorphism
- **Dark Mode**: Configured to always use light theme for consistency
  
**Previous Updates (November 8, 2025)**
- Fixed color palette: Corrected Lime color to exact HSL values (96 100% 68%) matching #B2FF59
- Fixed Google Maps center: Changed from New York to Karnataka coordinates (12.6337, 77.1175)
- Integrated BusMap component in Passenger dashboard with proper props and state management
- Integrated DriverInterface component for Driver dashboard with bus number, route, and next stops
- Integrated AdminPanel component for Admin dashboard with buses, analytics, and user statistics
- Verified all three role-based dashboards (Passenger, Driver, Admin) are functioning correctly

## System Architecture

### Frontend Architecture

**Framework & Build Tool**
- React 18 with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)

**UI Component System**
- Shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Custom glassmorphism treatment for cards and surfaces
- Typography system using Inter (primary) and Space Grotesk (accent) fonts

**State Management**
- TanStack Query (React Query) for server state management
- React Context API for authentication state
- Local component state for UI interactions

**Design Philosophy**
- Sustainability-focused "Green Intelligence: AI for a Sustainable Planet" theme
- **Light Aesthetic Color Palette**: 
  - Primary: Fresh eco green (#1DB954)
  - Secondary: Clear sky blue (#0FA0CE)
  - Accent: Warm energy yellow (#FFB300)
  - Background: Soft mint white (#FBFCFD)
  - Text: Dark readable (#1A2F3A)
- Light glassmorphism effects with backdrop blur, floating cards, and soft gradients
- Professional design with excellent text contrast and readability
- Animated eco-themed UI with subtle glows and smooth transitions
- Typography: Poppins (headings), Nunito (subheadings), Inter (body)

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for the REST API
- Middleware for JSON parsing, logging, and error handling
- Custom request logging with response capture

**API Design**
- RESTful endpoints for buses, users, routes, and analytics
- Zod schema validation for request payloads
- Consistent error handling with appropriate HTTP status codes

**Real-time Simulation**
- Bus location simulator that updates every 3 seconds
- Simulates realistic bus movement with random GPS coordinate offsets
- Speed variation simulation (15-45 km/h range)

### Data Storage

**Database**
- PostgreSQL via Neon serverless database
- Drizzle ORM for type-safe database operations
- Schema-first approach with TypeScript types generated from database schema

**Database Schema**
- `users`: Firebase UID, email, name, role, eco points, favorite stops
- `buses`: Bus number, route, location (lat/lng), status, speed, occupancy
- `routes`: Route name, stops array (JSON), eco-route flag, CO₂ savings
- `analytics`: Daily metrics for CO₂ saved, fuel saved, trips, average speed

**Storage Layer**
- Repository pattern implementation via `IStorage` interface
- `DbStorage` class provides concrete implementation
- Abstraction allows for easy testing and potential storage backend changes

### Authentication & Authorization

**Firebase Authentication**
- Multiple authentication methods: Google OAuth, Email/Password, Phone (with reCAPTCHA)
- Firebase Auth SDK for client-side authentication
- Custom AuthContext provider for application-wide auth state

**User Management**
- Firebase UID linked to application user records
- Role-based access control (passenger, driver, admin)
- User creation workflow that syncs Firebase users with application database

**Session Management**
- Firebase handles token management and refresh
- Credentials included in API requests for server-side verification

### External Dependencies

**Google Services**
- **Google Maps JavaScript API**: Real-time map rendering and bus location display
- **Google Maps Marker API**: Custom bus markers on the map
- **Map Configuration**: Centered on Karnataka (default: 12.6337, 77.1175) covering Mysuru (12.2958, 76.6394) and Bengaluru (12.9716, 77.5946)
- Required API key: `VITE_GOOGLE_MAPS_API_KEY`

**Firebase Services**
- **Firebase Authentication**: Multi-provider authentication
- **Firebase Firestore**: Optional for real-time features (configured but not actively used)
- Required configuration: API key, project ID, app ID

**Third-Party Libraries**
- **@react-google-maps/api**: React wrapper for Google Maps
- **Recharts**: Data visualization for analytics charts
- **date-fns**: Date manipulation and formatting
- **react-icons**: Icon library (including Google icon)
- **Radix UI**: Headless UI primitives for accessible components
- **Neon Serverless**: PostgreSQL database connection pooling

**Environment Variables Required**
- `DATABASE_URL`: PostgreSQL connection string
- `VITE_GOOGLE_MAPS_API_KEY`: Google Maps API access
- `VITE_FIREBASE_API_KEY`: Firebase project API key
- `VITE_FIREBASE_PROJECT_ID`: Firebase project identifier
- `VITE_FIREBASE_APP_ID`: Firebase application identifier