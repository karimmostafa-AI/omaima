-- Omaima E-commerce Platform Database Schema
-- Optimized for women's formal wear and uniform customization

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types
CREATE TYPE order_status AS ENUM (
    'pending', 'confirmed', 'processing', 'ready_for_pickup',
    'on_the_way', 'delivered', 'cancelled', 'returned'
);

CREATE TYPE payment_status AS ENUM (
    'pending', 'paid', 'failed', 'refunded', 'partially_refunded'
);

CREATE TYPE payment_method AS ENUM (
    'stripe', 'paypal', 'razorpay', 'cash_on_delivery', 'bank_transfer'
);

CREATE TYPE discount_type AS ENUM ('percentage', 'fixed_amount');

CREATE TYPE user_role AS ENUM ('customer', 'admin', 'shop_owner', 'staff');

CREATE TYPE customization_type AS ENUM (
    'suit', 'blazer', 'skirt', 'pants', 'dress', 'uniform'
);

-- Core Tables

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash TEXT,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url TEXT,
    role user_role DEFAULT 'customer',
    is_active BOOLEAN DEFAULT true,
    email_verified_at TIMESTAMP,
    phone_verified_at TIMESTAMP,
    last_online TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Customers table (extends users for customer-specific data)
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date_of_birth DATE,
    gender VARCHAR(10) DEFAULT 'female',
    preferences JSONB, -- Store customer preferences
    measurements JSONB, -- Store body measurements for customization
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Brands table
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Colors table
CREATE TABLE colors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    hex_code VARCHAR(7), -- e.g., #FF5733
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sizes table
CREATE TABLE sizes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL, -- XS, S, M, L, XL, XXL
    category VARCHAR(50), -- tops, bottoms, dresses, etc.
    measurements JSONB, -- chest, waist, hip measurements
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Materials table (for fabrics)
CREATE TABLE materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    composition TEXT, -- e.g., "100% Wool", "Cotton blend"
    care_instructions TEXT,
    price_modifier DECIMAL(8,2) DEFAULT 0, -- Additional cost for premium materials
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    sku VARCHAR(100) UNIQUE,
    description TEXT,
    short_description TEXT,
    price DECIMAL(10,2) NOT NULL,
    discount_price DECIMAL(10,2),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
    stock_quantity INTEGER DEFAULT 0,
    min_quantity INTEGER DEFAULT 1,
    is_customizable BOOLEAN DEFAULT false,
    customization_options JSONB, -- Store available customization options
    images TEXT[] DEFAULT '{}', -- Array of image URLs
    tags TEXT[] DEFAULT '{}',
    weight DECIMAL(8,2), -- For shipping calculations
    dimensions JSONB, -- length, width, height
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    seo_title VARCHAR(255),
    seo_description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Product variants table (for different color/size combinations)
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    color_id UUID REFERENCES colors(id) ON DELETE SET NULL,
    size_id UUID REFERENCES sizes(id) ON DELETE SET NULL,
    material_id UUID REFERENCES materials(id) ON DELETE SET NULL,
    sku VARCHAR(100) UNIQUE,
    price_adjustment DECIMAL(10,2) DEFAULT 0,
    stock_quantity INTEGER DEFAULT 0,
    images TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Addresses table
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    title VARCHAR(100), -- Home, Office, etc.
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company VARCHAR(255),
    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Coupons table
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255),
    description TEXT,
    discount_type discount_type NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    minimum_amount DECIMAL(10,2),
    maximum_discount DECIMAL(10,2),
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP,
    valid_until TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    billing_address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
    shipping_address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    shipping_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL,
    order_status order_status DEFAULT 'pending',
    payment_status payment_status DEFAULT 'pending',
    payment_method payment_method,
    notes TEXT,
    special_instructions TEXT, -- For customizations
    estimated_delivery_date DATE,
    delivered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    product_variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    customization_data JSONB, -- Store customization details
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Cart table
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    product_variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    customization_data JSONB, -- Store customization selections
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(customer_id, product_id, product_variant_id)
);

-- Wishlist table
CREATE TABLE wishlist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(customer_id, product_id)
);

-- Reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    images TEXT[] DEFAULT '{}',
    is_verified BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Customization templates table
CREATE TABLE customization_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type customization_type NOT NULL,
    base_product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    template_data JSONB NOT NULL, -- Store customization options and rules
    preview_images TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Customer measurements table
CREATE TABLE customer_measurements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    measurement_type VARCHAR(50), -- 'suit', 'dress', 'blazer', etc.
    measurements JSONB NOT NULL, -- Store all measurements
    notes TEXT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Flash sales table
CREATE TABLE flash_sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    discount_percentage DECIMAL(5,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Flash sale products table
CREATE TABLE flash_sale_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flash_sale_id UUID REFERENCES flash_sales(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    sale_price DECIMAL(10,2) NOT NULL,
    sale_quantity INTEGER,
    sold_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(flash_sale_id, product_id)
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    payment_method payment_method NOT NULL,
    payment_status payment_status DEFAULT 'pending',
    amount DECIMAL(10,2) NOT NULL,
    transaction_id VARCHAR(255),
    gateway_response JSONB,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Support tickets table
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'open',
    priority VARCHAR(20) DEFAULT 'medium',
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Support ticket messages table
CREATE TABLE support_ticket_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    attachments TEXT[] DEFAULT '{}',
    is_internal BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Settings table
CREATE TABLE app_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    type VARCHAR(50) DEFAULT 'string', -- string, number, boolean, json
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_cart_customer ON cart_items(customer_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customers (can only access their own data)
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Customers can view their own data" ON customers
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Customers can manage their own orders" ON orders
    FOR ALL USING (customer_id IN (
        SELECT id FROM customers WHERE user_id = auth.uid()
    ));

CREATE POLICY "Customers can manage their own cart" ON cart_items
    FOR ALL USING (customer_id IN (
        SELECT id FROM customers WHERE user_id = auth.uid()
    ));

CREATE POLICY "Customers can manage their own wishlist" ON wishlist_items
    FOR ALL USING (customer_id IN (
        SELECT id FROM customers WHERE user_id = auth.uid()
    ));

CREATE POLICY "Customers can manage their own addresses" ON addresses
    FOR ALL USING (customer_id IN (
        SELECT id FROM customers WHERE user_id = auth.uid()
    ));

CREATE POLICY "Customers can view their own reviews" ON reviews
    FOR SELECT USING (customer_id IN (
        SELECT id FROM customers WHERE user_id = auth.uid()
    ));

CREATE POLICY "Customers can create reviews" ON reviews
    FOR INSERT WITH CHECK (customer_id IN (
        SELECT id FROM customers WHERE user_id = auth.uid()
    ));

-- Public read access for product-related tables
CREATE POLICY "Anyone can view active products" ON products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view active categories" ON categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view active brands" ON brands
    FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view colors" ON colors
    FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view sizes" ON sizes
    FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view materials" ON materials
    FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view approved reviews" ON reviews
    FOR SELECT USING (is_approved = true);

-- Admin policies (full access for admin users)
CREATE POLICY "Admins have full access" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Functions for common operations
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories for Omaima
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Formal Suits', 'formal-suits', 'Professional business suits for women', 1),
('Blazers', 'blazers', 'Elegant blazers for business and formal occasions', 2),
('Dresses', 'dresses', 'Formal and business dresses', 3),
('Skirts', 'skirts', 'Professional skirts and pencil skirts', 4),
('Pants', 'pants', 'Formal trousers and business pants', 5),
('Uniforms', 'uniforms', 'Professional uniforms for various industries', 6),
('Accessories', 'accessories', 'Professional accessories and add-ons', 7);

-- Insert default colors
INSERT INTO colors (name, hex_code) VALUES
('Black', '#000000'),
('Navy Blue', '#000080'),
('Charcoal Grey', '#36454F'),
('Light Grey', '#D3D3D3'),
('White', '#FFFFFF'),
('Burgundy', '#800020'),
('Dark Blue', '#00008B'),
('Beige', '#F5F5DC');

-- Insert default sizes
INSERT INTO sizes (name, category, measurements) VALUES
('XS', 'tops', '{"chest": "30-32", "waist": "24-26", "hips": "34-36"}'),
('S', 'tops', '{"chest": "32-34", "waist": "26-28", "hips": "36-38"}'),
('M', 'tops', '{"chest": "34-36", "waist": "28-30", "hips": "38-40"}'),
('L', 'tops', '{"chest": "36-38", "waist": "30-32", "hips": "40-42"}'),
('XL', 'tops', '{"chest": "38-40", "waist": "32-34", "hips": "42-44"}'),
('XXL', 'tops', '{"chest": "40-42", "waist": "34-36", "hips": "44-46"}');

-- Insert default materials
INSERT INTO materials (name, description, composition, care_instructions) VALUES
('Premium Wool', 'High-quality wool fabric perfect for professional attire', '100% Wool', 'Dry clean only'),
('Cotton Blend', 'Comfortable cotton blend for everyday wear', '65% Cotton, 35% Polyester', 'Machine wash cold'),
('Silk Blend', 'Luxurious silk blend for special occasions', '70% Silk, 30% Cotton', 'Hand wash or dry clean'),
('Polyester Blend', 'Durable and wrinkle-resistant fabric', '60% Polyester, 40% Cotton', 'Machine wash warm');

-- Insert default app settings
INSERT INTO app_settings (key, value, type, description, is_public) VALUES
('site_name', 'Omaima', 'string', 'Site name', true),
('site_description', 'Elegant formal wear and customizable uniforms for women', 'string', 'Site description', true),
('currency', 'USD', 'string', 'Default currency', true),
('tax_rate', '0.10', 'number', 'Default tax rate', false),
('shipping_rate', '10.00', 'number', 'Default shipping rate', false),
('customization_enabled', 'true', 'boolean', 'Enable product customization', true);
