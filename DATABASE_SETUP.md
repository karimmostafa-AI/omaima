# Omaima E-commerce Platform - Database Setup

This document provides comprehensive instructions for setting up the Supabase database for the Omaima e-commerce platform.

## Overview

Omaima is a specialized e-commerce platform for women's formal wear and uniforms with advanced customization capabilities. The platform includes:

- **Custom Suit Builder**: Allow customers to design personalized suits with fabric, style, and measurement options
- **Product Management**: Categories, brands, colors, sizes, materials, and variants
- **Order Management**: Complete order lifecycle from placement to delivery
- **User Management**: Customer profiles, authentication, and role-based access
- **Payment Integration**: Multiple payment gateways including Stripe
- **Review System**: Product reviews and ratings
- **Admin Dashboard**: Comprehensive management interface

## Database Schema

The database schema is designed for PostgreSQL (Supabase) and includes:

### Core Tables
- `users` - User accounts with role-based access
- `customers` - Extended customer information
- `categories` - Product categories with hierarchy support
- `brands` - Product brands
- `colors` - Color options for products
- `sizes` - Size options with measurements
- `materials` - Fabric and material options
- `products` - Main product catalog
- `product_variants` - Color/size/material combinations

### E-commerce Tables
- `cart_items` - Shopping cart functionality
- `wishlist_items` - Customer wishlists
- `orders` - Order management
- `order_items` - Individual order line items
- `payments` - Payment tracking
- `addresses` - Customer address book
- `coupons` - Discount and promotion system

### Customization Tables
- `customization_templates` - Templates for product customization
- `customer_measurements` - Saved customer measurements
- `flash_sales` - Time-limited promotional sales
- `reviews` - Product reviews and ratings

### Support & Admin Tables
- `support_tickets` - Customer support system
- `support_ticket_messages` - Support ticket conversations
- `notifications` - User notifications
- `app_settings` - Application configuration

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new account or sign in
3. Create a new project
4. Wait for the project to be provisioned

### 2. Apply the Database Schema

1. Open your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `database/schema.sql`
4. Paste it into the SQL Editor
5. Click "Run" to execute the schema

This will create all tables, indexes, Row Level Security policies, and default data.

### 3. Environment Variables

Update your `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Authentication Setup

The schema includes Row Level Security (RLS) policies for data protection:

- **Public Access**: Products, categories, brands, colors, sizes, materials
- **Customer Access**: Own orders, cart, wishlist, addresses, measurements
- **Admin Access**: Full access to all tables

### 5. Test Data

The schema includes default data for:
- Product categories (Formal Suits, Blazers, Dresses, etc.)
- Colors (Navy, Charcoal, Black, etc.)
- Sizes (XS-XXL with measurements)
- Materials (Premium Wool, Cotton Blend, etc.)
- Application settings

## Key Features

### Customization System

The platform supports advanced product customization:

```typescript
// Example customization data structure
{
  style: {
    jacket_style: 'single-breasted',
    lapel_style: 'notched',
    button_count: '2-button',
    vent_style: 'center-vent'
  },
  fabric: {
    material_id: 'wool-premium',
    color_id: 'navy'
  },
  measurements: {
    measurement_type: 'suit',
    values: { chest: 36, waist: 28, hips: 38 },
    unit: 'inches'
  }
}
```

### Product Variants

Products can have multiple variants based on:
- Color combinations
- Size options
- Material choices
- Price adjustments per variant

### Order Management

Complete order lifecycle:
- Order placement with customization data
- Payment processing
- Order status tracking
- Delivery management
- Customer notifications

### Security Features

- Row Level Security (RLS) enabled
- User-specific data access
- Admin role verification
- Secure authentication flow

## Development Workflow

1. **Mock Data**: The system includes fallback mock data for development
2. **Type Safety**: Full TypeScript support with comprehensive type definitions
3. **Real-time Updates**: Supabase real-time subscriptions for live updates
4. **Caching**: Built-in query caching for better performance

## Next Steps

After database setup:

1. Test the connection by running the development server
2. Verify mock data is loading correctly
3. Set up authentication (covered in next phase)
4. Begin implementing the remaining e-commerce features

## Database Diagram

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    users    │────│  customers  │────│  addresses  │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │
       │                   ├─────────────┐
       │                   │             │
   ┌───────────┐    ┌─────────────┐  ┌─────────────┐
   │ reviews   │    │ cart_items  │  │ wishlist_   │
   └───────────┘    └─────────────┘  │   items     │
       │                   │         └─────────────┘
       │                   │
┌─────────────┐    ┌─────────────┐
│  products   │────│product_     │
│             │    │variants     │
└─────────────┘    └─────────────┘
       │
       ├────┬────┬────────────┐
       │    │    │            │
  ┌─────────┐ ┌─────┐  ┌─────────────┐
  │categories│ │brands│  │customization│
  └─────────┘ └─────┘  │ _templates  │
                       └─────────────┘
```

## Support

For issues with database setup:
1. Check Supabase project status
2. Verify environment variables
3. Review SQL execution logs
4. Check RLS policy conflicts

## Performance Considerations

- Indexes are created for frequently queried columns
- JSONB fields used for flexible schema parts
- Partitioning can be added for large-scale deployments
- Connection pooling recommended for production
