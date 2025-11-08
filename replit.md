# BusBuddy - AI-Powered Sustainable Bus Tracking

## Overview
BusBuddy is a real-time bus tracking application designed to provide AI-powered ETA predictions and eco-routing. Its core purpose is to promote sustainability by tracking CO₂ savings, fuel reduction, and environmental impact. The application serves three distinct user roles:
- **Passengers:** Track buses, view real-time ETAs, and access eco-analytics.
- **Drivers:** Report location, traffic conditions, and manage driver-specific documents.
- **Administrators:** Oversee the entire fleet, manage routes, and analyze system-wide performance metrics.

The project aims to deliver a professional, intuitive, and eco-conscious user experience, leveraging modern web technologies and a robust backend.

## User Preferences
Preferred communication style: Simple, everyday language.

## Recent Changes

**November 8, 2025 - Pin Bus & Proximity Notifications**
- **Pin Bus Feature**: Track specific buses with location-based notifications
  - Click on any bus from the list to select it
  - Press "Pin Bus" button to start tracking that bus
  - Automatically requests user's geolocation permission
  - Calculates real-time distance using Haversine formula
  - Shows notification when pinned bus is within 1km of user location
  - Button changes to show "Unpin Bus" or "Change Pin" based on state
  - Visual indicators: Pinned bus has accent border and "Pinned" badge
  - Prevents duplicate notifications for same approach
  - Can unpin or switch to different bus anytime
  
**November 8, 2025 - Bus Search Functionality**
- **Real-time Bus Search System**: Implemented instant bus filtering
  - Search by bus number (e.g., "145B") or route name (e.g., "Mysuru")
  - Live filtering as you type in the search bar
  - Shows matching results count: "Search Results (X)"
  - Displays "No buses found" message with helpful icon when no matches
  - Searches across both bus number and route name fields
  - Limits display to top 6 results for optimal performance

## System Architecture

### Frontend Architecture
- **Framework:** React 18 with TypeScript.
- **Build Tool:** Vite.
- **Routing:** Wouter.
- **UI:** Shadcn/ui (built on Radix UI) with Tailwind CSS for styling. Custom glassmorphism design for cards and surfaces.
- **State Management:** TanStack Query for server state, React Context API for authentication, local component state for UI.
- **Design Philosophy:** "Green Intelligence: AI for a Sustainable Planet" theme.
    - **Color Palette:** Soft mint white (#FBFCFD) background, fresh eco green (#1DB954) primary, clear sky blue (#0FA0CE) secondary, warm energy yellow (#FFB300) accent, dark readable text (#1A2F3A).
    - **Visuals:** Light glassmorphism effects, subtle glows, smooth transitions, and excellent text contrast.
    - **Typography:** Poppins (headings), Nunito (subheadings), Inter (body text).
- **Key Features:** Animated bus markers, real-time ETA display, document upload system, bus notification panel, role-based dashboards (Passenger, Driver, Admin).

### Backend Architecture
- **Server Framework:** Express.js with TypeScript.
- **API Design:** RESTful endpoints for buses, users, routes, and analytics. Zod for schema validation.
- **Real-time Simulation:** A bus location simulator updates bus positions every 3 seconds, simulating movement and speed variations.

### Data Storage
- **Database:** PostgreSQL via Neon serverless database.
- **ORM:** Drizzle ORM for type-safe operations.
- **Schema:**
    - `users`: email, name, role, eco points.
    - `buses`: bus number, route, location (lat/lng), status, speed, occupancy.
    - `routes`: route name, stops, eco-route flag, CO₂ savings.
    - `analytics`: daily metrics for CO₂ saved, fuel saved, trips.
- **Abstraction:** Repository pattern (`IStorage` interface) for database operations.

### Authentication & Authorization
- **Authentication System:** Backend email/password authentication using bcryptjs for password hashing.
- **Authorization:** Role-based access control (passenger, driver, admin).
- **Session Management:** localStorage-based session persistence.

## External Dependencies

### Google Services
- **Google Maps JavaScript API:** For map rendering and bus location display.
- **Google Maps Marker API:** For custom bus markers.
- **Map Configuration:** Centered on Karnataka, covering Mysuru and Bengaluru.

### Third-Party Libraries
- **@react-google-maps/api:** React wrapper for Google Maps.
- **Recharts:** For data visualization in analytics.
- **date-fns:** Date manipulation and formatting.
- **react-icons:** Icon library.
- **Radix UI:** Headless UI primitives.
- **Neon Serverless:** PostgreSQL database hosting.

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string.
- `VITE_GOOGLE_MAPS_API_KEY`: Google Maps API access key.