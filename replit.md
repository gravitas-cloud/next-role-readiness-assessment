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
- ✅ **Scoring Engine**: Implemented 3-dimension scoring algorithm (Strategic Identity, Visibility & Positioning, Political Capital) with zone classification (ZONE_1 to ZONE_4) and priority determination
- ✅ **Content Library**: Created comprehensive zone definitions and priority descriptions for all 4 zones and 3 development priorities
- ✅ **PDF Generation**: Built PDFKit-based report generator creating professional 2-page PDF reports with zone interpretations, dimension visualizations, and development roadmaps
- ✅ **Assessment API**: Implemented complete assessment workflow endpoints (create, submit, score calculation, PDF generation, download) with authentication and ownership validation
- ✅ End-to-end testing confirmed: assessment submission → scoring (38/60 = ZONE_2) → PDF generation → download working correctly
- ✅ **MailerLite Integration**: Built subscriber sync service with zone tagging and custom field mapping for automated email campaigns
- ✅ **Admin Authentication**: Implemented separate admin login system with bcrypt-hashed credentials and isolated JWT sessions
- ✅ **Admin Dashboard**: Created approval workflow UI showing pending assessments with zone badges, scores, and PDF preview
- ✅ **Approval Workflow**: Built approval endpoint that updates assessment status and triggers MailerLite subscriber sync
- ✅ **Admin Seeding**: Created seed script for initial admin user (admin@gravitasacademy.com)
- ✅ Complete end-to-end test passed: user registration → assessment → admin approval → email integration

## Setup Instructions

### Admin Access
1. Default admin credentials:
   - Email: `admin@gravitasacademy.com`
   - Password: `AdminPass123!`
   - **⚠️ Change password in production!**

2. To create additional admin users:
   ```bash
   ADMIN_EMAIL=your@email.com ADMIN_PASSWORD=yourpass tsx server/seed-admin.ts
   ```

3. Admin dashboard: `/admin/dashboard`

### MailerLite Integration
1. Get your MailerLite API key from https://dashboard.mailerlite.com/integrations/api
2. Add to Replit Secrets:
   - Key: `MAILERLITE_API_KEY`
   - Value: Your MailerLite Classic API key (v2)
3. Create MailerLite groups and add group IDs to `server/mailerlite-service.ts`:
   - ZONE_1 group (high priority)
   - ZONE_2 group
   - ZONE_3 group
   - ZONE_4 group (ready for C-suite)

4. The system automatically:
   - Creates/updates subscribers on admin approval
   - Tags subscribers with their zone
   - Sets custom fields (zone, totalScore, priority1, priority2)
   - Adds to appropriate group for nurture campaigns

### Running the Platform
```bash
npm run dev              # Start development server
npm run db:push          # Sync database schema
tsx server/seed-admin.ts # Create admin user
```

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
- PDF generation using PDFKit with professional 2-page layout
- Admin approval workflow before report distribution
- Automated email delivery integration with MailerLite (tags by zone, custom fields for scores/priorities)

**Admin System**
- Separate authentication system for admin users (/api/admin/* endpoints)
- Admin dashboard at /admin/dashboard with pending assessments view
- Approval workflow triggers MailerLite sync and marks reports as approved
- Bcrypt-hashed admin credentials stored in admins table
- Default admin: admin@gravitasacademy.com (password should be rotated in production)

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
- Subscriber sync triggered on admin approval with zone-based tagging
- Custom fields: zone, totalScore, priority1, priority2
- Group-based segmentation for targeted nurture campaigns
- Graceful degradation if API key not configured (approval still works, sync fails silently)

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