# BusBuddy - AI-Powered Sustainable Bus Tracking

## Overview

BusBuddy is a real-time bus tracking application with AI-powered ETA predictions and eco-routing capabilities. The application focuses on sustainability by tracking CO₂ savings, fuel reduction, and environmental impact metrics. It supports three user roles: passengers (tracking buses and viewing eco-analytics), drivers (reporting location and traffic), and administrators (managing fleet and viewing system-wide analytics).

The application uses a modern tech stack with React/TypeScript on the frontend, Express.js on the backend, and PostgreSQL for data persistence. It integrates with Google Maps for real-time location tracking and Firebase for authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

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
- Sustainability-focused "Green Intelligence" theme
- Reference-based design inspired by Notion's clean layouts and Apple's minimalism
- Custom eco-themed color palette with green accents
- Glassmorphic UI elements with backdrop blur effects

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