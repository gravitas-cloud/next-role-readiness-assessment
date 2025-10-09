# Design Guidelines: Next Role Readiness Assessment Platform

## Design Approach

**Selected Approach**: Design System - Material Design 3 with professional SaaS customization

**Justification**: This assessment platform serves senior IT executives who value professionalism, clarity, and trustworthiness over visual experimentation. The utility-focused nature (forms, assessments, data displays) requires consistent patterns, clear hierarchy, and accessibility. Material Design 3 provides the foundation for interactive components while allowing customization for executive coaching credibility.

**Key Design Principles**:
- **Executive Credibility**: Professional, polished interface that instills confidence
- **Clarity & Focus**: Minimal distractions, clear pathways through assessment
- **Progress Transparency**: Always show users where they are in the journey
- **Trust Building**: Consistent patterns, reliable interactions, security signals

---

## Core Design Elements

### A. Color Palette

**Light Mode**:
- Primary: 234 85% 25% (Deep indigo - executive authority)
- Primary Variant: 234 70% 35% (Lighter indigo for hover states)
- Secondary: 262 52% 47% (Rich purple - strategic insight)
- Background: 0 0% 98% (Soft white)
- Surface: 0 0% 100% (Pure white for cards)
- Text Primary: 220 13% 18% (Near black)
- Text Secondary: 220 9% 46% (Medium gray)
- Success: 142 71% 45% (Professional green for completion)
- Error: 0 84% 60% (Clear red for validation)
- Border: 220 13% 91% (Subtle dividers)

**Dark Mode**:
- Primary: 234 70% 60% (Lighter indigo - maintains readability)
- Background: 220 13% 12% (Deep charcoal)
- Surface: 220 13% 16% (Elevated dark surface)
- Text Primary: 0 0% 95% (Near white)
- Text Secondary: 220 9% 65% (Light gray)
- Border: 220 13% 24% (Subtle dark dividers)

### B. Typography

**Font Families**:
- Primary: 'Inter' (Google Fonts) - Clean, professional, excellent at all sizes
- Headings: 'Inter' with font-weight: 600-700
- Body: 'Inter' with font-weight: 400-500
- Monospace: 'JetBrains Mono' (for admin data displays)

**Type Scale**:
- Hero/H1: text-4xl md:text-5xl (36-48px), font-semibold
- H2: text-3xl md:text-4xl (30-36px), font-semibold  
- H3: text-2xl md:text-3xl (24-30px), font-medium
- H4: text-xl md:text-2xl (20-24px), font-medium
- Body Large: text-lg (18px), font-normal
- Body: text-base (16px), font-normal
- Body Small: text-sm (14px), font-normal
- Caption: text-xs (12px), font-normal

### C. Layout System

**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16 for consistent rhythm
- Component padding: p-6 or p-8
- Section spacing: space-y-8 or space-y-12
- Form field gaps: gap-6
- Card spacing: p-8
- Container max-width: max-w-4xl (assessment), max-w-7xl (landing)

**Grid System**:
- Assessment forms: Single column, max-w-2xl centered
- Results display: 2-column grid on desktop (scores + insights)
- Admin dashboard: 3-column card grid for pending reports
- Landing page: Flexible grid with 1/2/3 columns based on content

### D. Component Library

**Authentication Forms**:
- Clean card-based design with subtle shadow (shadow-lg)
- Input fields: border, rounded-lg, focus:ring-2 focus:ring-primary
- Password strength indicator: Color-coded bar (red→yellow→green)
- Social proof element: Small text with user count below form
- Inline validation: Text below fields with error/success colors

**Assessment Interface**:
- Progress bar: Fixed top with percentage and step count
- Question cards: Large, spacious with clear radio/checkbox options
- Navigation: Previous/Next buttons, auto-save indicator
- Answer options: Large click targets (min 48px height), clear visual feedback
- Progress persistence: "Saved" indicator with checkmark animation

**Results Display**:
- Zone classification: Large badge with color-coded zones
- Score visualization: Radial progress indicators for three dimensions
- Priority cards: 2-column grid with icons and descriptions
- CTA section: Prominent "Get Full Report" button with email reminder
- Share functionality: Social share buttons (LinkedIn focus)

**Admin Dashboard**:
- Data table: Sortable columns, search filter, pagination
- Report cards: Thumbnail preview, user info, approval status
- PDF preview: Modal with embedded viewer
- Approval workflow: Clear approve/reject buttons with confirmation
- Status badges: Color-coded for pending/approved/sent

**Navigation**:
- Top navigation: Logo left, user menu right, transparent to white on scroll
- User menu: Dropdown with profile, logout, admin (if applicable)
- Breadcrumbs: For multi-step processes (assessment steps)

**Landing Page Components**:
- Hero: Full-width with gradient overlay, centered content, large CTA
- Feature cards: 3-column grid with icons, titles, descriptions
- Testimonial: Single prominent quote with user details
- Stats: 3-4 column grid with large numbers
- FAQ: Accordion-style with smooth expand/collapse
- Footer: Multi-column with links, social, newsletter signup

### E. Animations

**Minimal & Purposeful**:
- Page transitions: Simple fade (150ms)
- Button interactions: Scale on press (transform: scale(0.98))
- Form validation: Shake on error (animate-shake, 300ms)
- Progress updates: Smooth width transitions (transition-all duration-300)
- Modal entry: Fade + scale from 95% to 100%
- Success states: Checkmark draw animation (500ms)

**Avoid**: Parallax, complex scroll animations, decorative movements

---

## Images

**Hero Image (Landing Page)**:
- Professional business setting with senior executive in discussion
- Subtle overlay with gradient (from transparent to 234 85% 25% at 70% opacity)
- Position: Background cover, center focus
- Alt: "Senior IT leaders in strategic planning session"

**Results Section Background**:
- Abstract data visualization or network pattern
- Opacity: 5-10% for subtle texture
- Position: Fixed background, no-repeat

**Testimonial Section**:
- Headshot photos of IT leaders (circular, 80px diameter)
- Professional setting, high quality
- Positioned: Left of testimonial text

**No hero image needed for**: Assessment interface, auth pages, admin dashboard (utility-focused)

---

## Page-Specific Guidelines

**Landing Page**:
- Hero: 80vh with background image, centered headline + subheadline + CTA
- 6-8 sections: Hero → Benefits → How It Works → Sample Results → Testimonials → FAQ → CTA → Footer
- Multi-column where valuable: Features (3-col), Stats (4-col), FAQ (2-col on desktop)
- Generous spacing: py-20 sections on desktop, py-12 on mobile

**Assessment Pages**:
- Clean, distraction-free: White background, centered content
- Large form elements: Minimum 48px touch targets
- Clear progress: Sticky header with progress bar
- Auto-save indicator: Small text "Changes saved" with fade animation

**Results Page**:
- Celebration moment: Larger headings, success colors
- Clear hierarchy: Zone → Scores → Priorities → CTA
- Social sharing: Prominent but not intrusive
- Email reminder: If report not yet sent

**Admin Dashboard**:
- Dense information layout: Table view with filters
- Quick actions: Inline approve/preview buttons
- Status at-a-glance: Color-coded badges
- Responsive: Stack to cards on mobile