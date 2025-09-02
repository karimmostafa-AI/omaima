# Omaima - Women's Formal Wear & Custom Suits E-commerce Platform

*Elegant formal wear and customizable uniforms for professional women*

[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2015-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 🌟 Overview

Omaima is a comprehensive e-commerce platform specialized in women's formal wear and professional uniforms. The platform features an advanced **Custom Suit Builder** that allows customers to design personalized suits with fabric selection, style customization, and precise measurements.

### ✨ Key Features

- **🎯 Custom Suit Builder**: Interactive suit customization with real-time pricing
- **👔 Formal Wear Catalog**: Blazers, suits, dresses, skirts, and professional uniforms
- **🎨 Advanced Customization**: Fabric selection, color choices, style options, and measurements
- **🛒 Smart Shopping Cart**: Supports both regular and customized products
- **👥 User Management**: Customer profiles, address book, and order history
- **💳 Payment Integration**: Stripe and multiple payment gateway support
- **⭐ Review System**: Product reviews and ratings
- **📱 Responsive Design**: Mobile-optimized experience
- **🔧 Admin Dashboard**: Comprehensive management interface
- **🎭 Page Builder**: Dynamic page creation system

## 🏗️ Architecture

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **UI Components**: Radix UI primitives with Tailwind CSS
- **State Management**: React Context + Zustand
- **Payments**: Stripe integration
- **Database**: Comprehensive PostgreSQL schema with RLS

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/pnpm
- Supabase account
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd V0-feat-e-commerce-core
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

4. **Database Setup**
   
   Follow the comprehensive setup guide in [`DATABASE_SETUP.md`](./DATABASE_SETUP.md)

5. **Run Development Server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🎨 Custom Suit Builder

The centerpiece of Omaima is the **Custom Suit Builder**, accessible at `/custom-suit`.

### Features:
- **4-Step Process**: Style → Fabric & Color → Measurements → Final Details
- **Real-time Pricing**: Dynamic price calculation based on selections
- **Progress Tracking**: Visual progress indicator
- **Measurement Guide**: Detailed instructions for accurate measurements
- **Style Options**: Single/double breasted, lapel styles, button configurations
- **Premium Fabrics**: Wool, silk blends, cotton options with different price points
- **Professional Colors**: Navy, charcoal, black, burgundy options
- **Custom Details**: Lining colors, monogramming, special instructions

### Usage:
```typescript
import { SuitCustomizationBuilder } from '@/components/suit-customization-builder'

<SuitCustomizationBuilder
  product={suitProduct}
  onCustomizationChange={handleCustomization}
  onAddToCart={handleAddToCart}
/>
```

## 📁 Project Structure

```
├── app/                      # Next.js App Router pages
│   ├── (auth)/              # Authentication pages
│   ├── admin/               # Admin dashboard
│   ├── custom-suit/         # Suit customization builder
│   ├── products/            # Product catalog
│   └── api/                 # API routes
├── components/              # React components
│   ├── ui/                  # Base UI components
│   ├── page-builder/        # Page builder components
│   └── suit-customization-builder.tsx
├── lib/                     # Utilities and configurations
│   ├── supabase/           # Database operations
│   └── utils.ts
├── types/                   # TypeScript type definitions
│   ├── product.ts
│   ├── cart.ts
│   ├── user.ts
│   ├── order.ts
│   └── customization.ts
├── context/                 # React context providers
├── database/               # Database schema and migrations
└── public/                 # Static assets
```

## 🗄️ Database Schema

The platform uses a comprehensive PostgreSQL schema with:

- **25+ Tables**: Complete e-commerce data model
- **Row Level Security**: Data protection and access control
- **JSONB Fields**: Flexible schema for customizations
- **Indexes**: Optimized for performance
- **Default Data**: Pre-populated categories, colors, sizes, materials

See [`DATABASE_SETUP.md`](./DATABASE_SETUP.md) for complete schema documentation.

## 🎯 Development Roadmap

The project follows a structured development plan:

- ✅ **Phase 1**: Database schema and type system
- ✅ **Phase 2**: Custom suit builder implementation
- 🔄 **Phase 3**: Authentication system (In Progress)
- ⏳ **Phase 4**: Order management
- ⏳ **Phase 5**: Payment integration
- ⏳ **Phase 6**: Admin dashboard
- ⏳ **Phase 7**: Advanced features (reviews, analytics, etc.)

## 🛠️ Technologies

- **Next.js 15**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Supabase**: Backend-as-a-Service
- **Stripe**: Payment processing
- **Framer Motion**: Animations
- **React Hook Form**: Form management
- **Zustand**: State management

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🏢 About Omaima

Omaima specializes in creating elegant, professional attire for modern women. Our platform combines traditional craftsmanship with cutting-edge technology to deliver perfectly fitted formal wear and uniforms.

**Contact**: [omaima-support@example.com](mailto:omaima-support@example.com)
