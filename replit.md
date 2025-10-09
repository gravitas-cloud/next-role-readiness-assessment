# Next Role Readiness Assessment Platform

## Overview

A lead generation assessment tool for Gravitas Academy that helps Senior IT Leaders (ages 38-50) in India evaluate their readiness for C-suite transitions. The platform delivers a 12-question diagnostic assessment that classifies users into strategic readiness zones and identifies their top development priorities. Users receive instant results and a detailed PDF report via email, followed by nurture campaigns to drive engagement with paid coaching offerings.

## Recent Changes

**October 9, 2025**
- ✅ Completed JWT authentication system with 7-day token expiration and auto-refresh within 24 hours of expiry
- ✅ Implemented bcrypt password hashing (10 rounds) with shared Zod validation schemas
- ✅ Built authentication API routes (register, login, logout, me) with consistent 8-character password requirement
- ✅ Created useAuth hook for frontend authentication state management
- ✅ Added protected route system with automatic redirects for unauthenticated users
- ✅ End-to-end authentication flow tested and verified production-ready
- ✅ Database schema implemented with users, assessments, and admins tables using Drizzle ORM

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18+ with Vite for rapid development and fast HMR (Hot Module Replacement)
- TypeScript for type safety across the codebase
- Wouter for lightweight client-side routing (smaller bundle than React Router)
- Path aliases configured via TypeScript for clean imports (`@/` for client, `@shared/` for shared code)

**Design System**
- Material Design 3 principles with professional SaaS customization
- Shadcn/ui component library (Radix UI primitives with Tailwind styling)
- "New York" style variant with custom theming
- Dark/light mode support with CSS variables and class-based toggling
- Inter font family for all text, JetBrains Mono for admin data displays
- Tailwind CSS for utility-first styling with custom color palette focused on executive credibility

**State Management**
- TanStack Query (React Query) for server state management and caching
- React Hook Form for form validation and state
- Zod for schema validation (integrated with Drizzle ORM)
- Cookie-based authentication state persistence

**Key UI Patterns**
- Progressive assessment flow with step-by-step navigation
- Real-time progress tracking with visual indicators
- Card-based layouts for information hierarchy
- Responsive design with mobile-first approach (768px breakpoint)

### Backend Architecture

**Runtime & Framework**
- Node.js with Express for HTTP server
- ESM (ES Modules) throughout the codebase
- Development mode uses tsx for TypeScript execution
- Production build uses esbuild for bundling

**Authentication & Security**
- JWT-based authentication with 7-day token expiry
- Bcrypt password hashing (10 rounds)
- HTTP-only cookies for token storage
- Session management via connect-pg-simple with PostgreSQL backing
- Protected routes with middleware authentication

**API Design**
- RESTful endpoints organized by domain (auth, assessments, admin)
- Centralized error handling middleware
- Request logging with duration tracking
- JSON request/response format

**Assessment Scoring Logic**
- 12-question assessment mapped to three dimensions:
  - Strategic Identity (max 40 points)
  - Visibility & Positioning (max 40 points)  
  - Political Capital (max 40 points)
- Total score determines zone classification
- Algorithm identifies top 2 development priorities based on dimension scores

**Report Generation**
- PDF generation using PDFKit or Puppeteer
- Admin approval workflow before report distribution
- Automated email delivery integration with MailerLite

### Data Storage

**Database**
- PostgreSQL (Neon serverless) for production scalability
- Drizzle ORM for type-safe database queries
- WebSocket connection for Neon (using ws package)

**Schema Design**
- Users table: Authentication and profile data
- Assessments table: Responses stored as JSON, calculated scores, zone classification, priorities
- Admins table: Administrative access control
- Session store: Express session management

**Data Flow**
1. User responses stored as JSON object in assessments table
2. Scores calculated and persisted upon assessment completion
3. Report generation triggered after admin approval
4. PDF URL and delivery status tracked in assessment record

### External Dependencies

**Email Marketing**
- MailerLite API v2 for email campaigns
- Webhook handling for delivery status tracking
- Automated nurture sequences for lead conversion

**Database Service**
- Neon serverless PostgreSQL with connection pooling
- WebSocket-based connections for serverless compatibility
- Drizzle Kit for schema migrations

**Development Tools**
- Replit-specific plugins for development experience:
  - Runtime error modal overlay
  - Cartographer for code navigation
  - Dev banner for environment indication
- Vite plugins for HMR and fast refresh

**UI Components**
- Radix UI primitives (40+ components) for accessible interactions
- Lucide React for consistent iconography
- Class Variance Authority for component variant management
- Tailwind Merge for className optimization

**Fonts**
- Google Fonts (Inter) loaded via CDN
- Preconnect optimization for performance