import { createClient } from "@/lib/supabase/server"
import { Product, Category } from "@/types/product"

// Mock data for demo mode when Supabase is not configured
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Elegant Navy Blue Business Blazer",
    slug: "elegant-navy-blue-business-blazer",
    sku: "OM-BLZ-001",
    description: "A classic navy blue blazer, tailored for a professional and sharp look. Perfect for any business setting.",
    short_description: "Classic navy blue blazer for professional wear",
    price: 129.99,
    discount_price: 99.99,
    category_id: "blazers-cat-id",
    brand_id: "omaima-brand-id",
    stock_quantity: 50,
    min_quantity: 1,
    is_customizable: true,
    customization_options: [
      {
        type: 'fabric',
        label: 'Choose Fabric',
        options: [
          { id: 'wool-premium', name: 'Premium Wool', price_modifier: 0 },
          { id: 'cotton-blend', name: 'Cotton Blend', price_modifier: -20 }
        ],
        required: true
      },
      {
        type: 'color',
        label: 'Choose Color',
        options: [
          { id: 'navy-blue', name: 'Navy Blue', price_modifier: 0 },
          { id: 'charcoal', name: 'Charcoal Grey', price_modifier: 0 }
        ],
        required: true
      }
    ],
    images: ["/elegant-navy-blue-business-blazer.png"],
    tags: ["blazer", "business", "formal", "navy"],
    weight: 0.8,
    dimensions: { length: 24, width: 18, height: 2 },
    is_active: true,
    is_featured: true,
    seo_title: "Elegant Navy Blue Business Blazer - Omaima",
    seo_description: "Professional navy blue blazer perfect for business settings",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { 
      id: "blazers-cat-id",
      name: "Blazers", 
      slug: "blazers",
      sort_order: 2,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  },
  {
    id: "2",
    name: "Professional Pencil Skirt Suit",
    slug: "professional-pencil-skirt-suit",
    sku: "OM-SUIT-002",
    description: "This stylish pencil skirt suit offers a sleek silhouette and a commanding presence. Made with high-quality fabric for all-day comfort.",
    short_description: "Stylish pencil skirt suit for professional women",
    price: 199.99,
    category_id: "formal-suits-cat-id",
    brand_id: "omaima-brand-id",
    stock_quantity: 30,
    min_quantity: 1,
    is_customizable: true,
    customization_options: [
      {
        type: 'fabric',
        label: 'Choose Fabric',
        options: [
          { id: 'wool-premium', name: 'Premium Wool', price_modifier: 0 },
          { id: 'silk-blend', name: 'Silk Blend', price_modifier: 50 }
        ],
        required: true
      }
    ],
    images: ["/professional-pencil-skirt-suit.png"],
    tags: ["suit", "skirt", "professional", "formal"],
    weight: 1.2,
    is_active: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { 
      id: "formal-suits-cat-id",
      name: "Formal Suits", 
      slug: "formal-suits",
      sort_order: 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  },
  {
    id: "3",
    name: "Modern Professional Pantsuit",
    slug: "modern-professional-pantsuit",
    sku: "OM-PSUIT-003",
    description: "A modern take on the classic pantsuit. Features a slim-fit design that is both comfortable and empowering.",
    short_description: "Modern pantsuit with slim-fit design",
    price: 219.99,
    category_id: "formal-suits-cat-id",
    brand_id: "omaima-brand-id",
    stock_quantity: 25,
    min_quantity: 1,
    is_customizable: true,
    customization_options: [
      {
        type: 'style',
        label: 'Fit Type',
        options: [
          { id: 'slim-fit', name: 'Slim Fit', price_modifier: 0 },
          { id: 'regular-fit', name: 'Regular Fit', price_modifier: 0 },
          { id: 'relaxed-fit', name: 'Relaxed Fit', price_modifier: 0 }
        ],
        required: true
      }
    ],
    images: ["/modern-professional-pantsuit.png"],
    tags: ["pantsuit", "modern", "professional", "slim-fit"],
    weight: 1.5,
    is_active: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { 
      id: "formal-suits-cat-id",
      name: "Formal Suits", 
      slug: "formal-suits",
      sort_order: 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  },
  {
    id: "4",
    name: "Elegant Business Suit on Mannequin",
    slug: "elegant-business-suit-on-mannequin",
    sku: "OM-ESUIT-004",
    description: "Showcase your professional style with this elegant business suit. A timeless piece for any wardrobe.",
    short_description: "Elegant business suit - timeless design",
    price: 249.99,
    category_id: "formal-suits-cat-id",
    brand_id: "omaima-brand-id",
    stock_quantity: 15,
    min_quantity: 1,
    is_customizable: true,
    customization_options: [],
    images: ["/elegant-business-suit-on-mannequin.png"],
    tags: ["elegant", "business", "suit", "timeless"],
    weight: 1.3,
    is_active: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { 
      id: "formal-suits-cat-id",
      name: "Formal Suits", 
      slug: "formal-suits",
      sort_order: 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }
]

export async function getFeaturedProducts(limit: number = 4): Promise<Product[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .limit(limit)

    if (error) {
      // If table doesn't exist, use mock data
      if (error.code === 'PGRST205' || error.message.includes('table') || error.message.includes('schema')) {
        console.warn("Products table not found, using mock data:", error.message)
        return mockProducts.slice(0, limit)
      }
      console.error("Error fetching featured products:", error)
      return mockProducts.slice(0, limit)
    }

    return data || mockProducts.slice(0, limit)
  } catch (error) {
    console.warn("Supabase not configured, using mock data")
    return mockProducts.slice(0, limit)
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        category:categories (
          id,
          name,
          slug,
          sort_order,
          is_active,
          created_at,
          updated_at
        ),
        brand:brands (
          id,
          name,
          slug,
          is_active
        ),
        variants:product_variants (
          id,
          sku,
          price_adjustment,
          stock_quantity,
          images,
          is_active,
          color:colors (id, name, hex_code),
          size:sizes (id, name, category, measurements),
          material:materials (id, name, description, composition, price_modifier)
        )
      `)
      .eq("id", id)
      .eq("is_active", true)
      .single()

    if (error) {
      // If table doesn't exist, use mock data
      if (error.code === 'PGRST205' || error.message.includes('table') || error.message.includes('schema')) {
        console.warn("Products table not found, using mock data:", error.message)
        return mockProducts.find(p => p.id === id) || null
      }
      console.error(`Error fetching product with id ${id}:`, error)
      return mockProducts.find(p => p.id === id) || null
    }

    return data
  } catch (error) {
    console.warn("Supabase not configured, using mock data")
    return mockProducts.find(p => p.id === id) || null
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        category:categories (
          name,
          slug
        ),
        variants:product_variants (
          id,
          sku,
          price_adjustment,
          stock_quantity,
          images,
          is_active,
          color:colors (id, name, hex_code),
          size:sizes (id, name, category, measurements),
          material:materials (id, name, description, composition, price_modifier)
        )
      `)
      .eq("slug", slug)
      .single()

    if (error) {
      // If table doesn't exist, use mock data
      if (error.code === 'PGRST205' || error.message.includes('table') || error.message.includes('schema')) {
        console.warn("Products table not found, using mock data:", error.message)
        return mockProducts.find(p => p.slug === slug) || null
      }
      console.error(`Error fetching product with slug ${slug}:`, error)
      return mockProducts.find(p => p.slug === slug) || null
    }

    return data
  } catch (error) {
    console.warn("Supabase not configured, using mock data")
    return mockProducts.find(p => p.slug === slug) || null
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories (
          name,
          slug
        )
      `);

    if (error) {
      // If table doesn't exist, use mock data
      if (error.code === 'PGRST205' || error.message.includes('table') || error.message.includes('schema')) {
        console.warn("Products table not found, using mock data:", error.message);
        return mockProducts;
      }
      console.error('Error fetching products:', error);
      return mockProducts;
    }

    return data || [];
  } catch (error) {
    console.warn("Supabase not configured, using mock data");
    return mockProducts;
  }
}
