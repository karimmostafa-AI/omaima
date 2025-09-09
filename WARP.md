# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Overview

Omaima is a specialized e-commerce platform for women's formal wear and professional uniforms. The platform's centerpiece is an advanced **Custom Suit Builder** that allows customers to design personalized suits with fabric selection, style customization, and precise measurements.

## Architecture

### Frontend Stack
- **Next.js 15** with App Router architecture
- **React 19** with TypeScript
- **Tailwind CSS v4** for styling
- **Radix UI** primitives for accessible components
- **Framer Motion** for animations

### Backend & Database
- **Supabase** (PostgreSQL + Auth + Real-time subscriptions)
- **Row Level Security (RLS)** for data protection
- **Comprehensive schema** with 25+ tables for full e-commerce functionality

### State Management
- **React Context** for cart and authentication
- **Zustand** for additional state management
- **TanStack Query** for server state and caching

### Key Features
- Custom Suit Builder with 4-step process (Style → Fabric & Color → Measurements → Details)
- Real-time price calculation based on customizations
- Admin dashboard with role-based access control
- Product variants (color/size/material combinations)
- Order management with status tracking
- Payment integration with Stripe

## Common Development Commands

### Development Server
```bash
npm run dev          # Start development server on localhost:3000
pnpm dev            # Alternative with pnpm
```

### Building & Production
```bash
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
```

### Database Operations
The database schema is located in `database/schema.sql` and migration scripts in `scripts/` directory. Apply schema changes through Supabase SQL Editor.

### Testing
```bash
npx playwright test  # Run Playwright end-to-end tests
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── admin/             # Admin dashboard (role-protected)
│   ├── api/               # API routes
│   ├── custom-suit/       # Suit customization pages
│   └── products/          # Product catalog
├── components/            # React components
│   ├── ui/               # Base UI components (Radix + Tailwind)
│   ├── admin/            # Admin-specific components
│   └── suit-customization-builder.tsx  # Main customization component
├── context/              # React Context providers
│   ├── AuthContext.tsx   # User authentication state
│   └── CartContext.tsx   # Shopping cart state
├── lib/                  # Utilities and configurations
│   ├── supabase/        # Database client configurations
│   └── utils.ts         # Common utility functions
├── types/               # TypeScript type definitions
├── database/           # Database schema and documentation
└── scripts/           # Database migration scripts
```

## Custom Suit Builder

The suit customization system (`components/suit-customization-builder.tsx`) is the platform's core feature:

### 4-Step Process:
1. **Style Selection**: Jacket style, lapel type, button configuration, vent style
2. **Fabric & Color**: Material selection with pricing modifiers, color combinations
3. **Measurements**: Body measurements with validation for required fields
4. **Final Details**: Fit preferences, lining options, special instructions

### Key Implementation Details:
- Real-time price calculation with base price + customization modifiers
- Progress tracking with completion validation
- TypeScript interfaces in `types/customization.ts`
- JSONB storage in database for flexible customization data

## Database Architecture

### Core Entity Relationships:
- **Users** → **Customers** (1:1 with extended profile data)
- **Products** → **Product Variants** (1:many for color/size/material combinations)  
- **Orders** → **Order Items** (1:many with customization data stored as JSONB)
- **Customers** → **Customer Measurements** (1:many for saved measurements)

### Security:
- Row Level Security (RLS) policies restrict data access
- Admin role verification for protected operations
- Customer data isolation (users only see their own data)

## Authentication & Authorization

### User Roles:
- **Customer**: Product browsing, orders, customizations
- **Admin**: Full dashboard access, product management, order management
- **Staff**: Limited admin access (future implementation)

### Protected Routes:
- `/admin/*` - Requires admin role
- `/account/*` - Requires authenticated user
- `/custom-suit` - Public access, saves to cart if authenticated

## Environment Setup

Required environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## Key Components

### `SuitCustomizationBuilder`
- Multi-step form with progress tracking
- Real-time price calculation
- Measurement validation
- Customization data management

### `AdminLayout`
- Sidebar navigation for admin functions
- Role-based route protection
- Theme switching and user management

### Context Providers
- `AuthContext`: User authentication state, profile management
- `CartContext`: Shopping cart operations, persistent storage

## Development Workflow

1. **Database First**: Schema changes go through Supabase SQL Editor
2. **Type Generation**: TypeScript types are manually maintained in `types/` directory
3. **Component Development**: Use Radix UI primitives with Tailwind styling
4. **Real-time Updates**: Leverage Supabase subscriptions for live data
5. **Mobile Responsive**: All components built mobile-first with Tailwind

## Configuration Notes

- **ESLint/TypeScript**: Build errors are currently ignored in `next.config.mjs` 
- **Images**: Unoptimized for development/deployment flexibility
- **Tailwind**: Using v4 with new CSS import structure
- **Supabase**: Client-side and server-side configurations in `lib/supabase/`

## Payment Integration

Stripe integration is set up for:
- One-time payments for standard products
- Custom pricing for suit customizations
- Order total calculations including tax and shipping

## Common Patterns

### Database Queries
Use server components with Supabase server client for initial data loading, client components with browser client for real-time updates.

### Form Handling
React Hook Form with Zod validation for complex forms like customization builder.

### State Updates
Optimistic updates in UI with server state synchronization via TanStack Query.

## Admin Dashboard Features

- Product management (CRUD operations)
- Category management with hierarchy support
- Order management with status updates
- Customer management and support
- Analytics and reporting (planned)
- Content management with page builder
