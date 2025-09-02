import { chromium, FullConfig } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'

async function globalSetup(config: FullConfig) {
  console.log('🚀 Global setup starting...')

  // Initialize Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase configuration for testing')
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // Clean up any existing test data
    await cleanupTestData(supabase)
    
    // Seed test data
    await seedTestData(supabase)

    console.log('✅ Test database prepared')

    // Warm up the application
    const browser = await chromium.launch()
    const page = await browser.newPage()
    
    try {
      await page.goto(config.projects[0].use?.baseURL || 'http://localhost:3000')
      await page.waitForLoadState('networkidle')
      console.log('✅ Application warmed up')
    } catch (error) {
      console.error('❌ Failed to warm up application:', error)
    } finally {
      await browser.close()
    }

  } catch (error) {
    console.error('❌ Global setup failed:', error)
    throw error
  }

  console.log('✅ Global setup completed')
}

async function cleanupTestData(supabase: any) {
  // Clean up test data
  await supabase
    .from('orders')
    .delete()
    .ilike('notes', '%test%')

  // Clean up test products
  await supabase
    .from('products')
    .delete()
    .ilike('name', '%test%')
}

async function seedTestData(supabase: any) {
  // Seed test products if not exists
  const { data: products } = await supabase
    .from('products')
    .select('id')
    .limit(1)

  if (!products || products.length === 0) {
    await supabase
      .from('products')
      .insert([
        {
          name: 'Test Suit',
          slug: 'test-suit',
          description: 'A test suit for E2E testing',
          category: 'suits',
          base_price: 599.00,
          images: ['test-suit-1.jpg'],
          is_active: true
        }
      ])
  }

async function seedTestData(supabase: any) {
  // Seed test products if not exists
  const { data: products } = await supabase
    .from('products')
    .select('id')
    .limit(1)

  if (!products || products.length === 0) {
    await supabase
      .from('products')
      .insert([
        {
          name: 'Test Suit',
          slug: 'test-suit',
          description: 'A test suit for E2E testing',
          category: 'suits',
          base_price: 599.00,
          images: ['test-suit-1.jpg'],
          is_active: true
        }
      ])
  }

  // Seed test categories if not exists
  const { data: categories } = await supabase
    .from('categories')
    .select('id')
    .limit(1)

  if (!categories || categories.length === 0) {
    await supabase
      .from('categories')
      .insert([
        {
          name: 'Test Category',
          slug: 'test-category',
          description: 'A test category for E2E testing',
          is_active: true
        }
      ])
  }
}

export default globalSetup