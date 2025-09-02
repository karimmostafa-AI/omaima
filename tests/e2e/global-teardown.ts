import { FullConfig } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Global teardown starting...')

  // Initialize Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.log('⚠️ Missing Supabase configuration, skipping cleanup')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // Clean up test data created during tests
    await supabase
      .from('orders')
      .delete()
      .or('notes.ilike.%test%,notes.ilike.%e2e%')

    await supabase
      .from('products')
      .delete()
      .or('name.ilike.%test%,name.ilike.%e2e%')

    console.log('✅ Test data cleaned up')

  } catch (error) {
    console.error('❌ Teardown cleanup failed:', error)
    // Don't throw here as it shouldn't fail the tests
  }

  console.log('✅ Global teardown completed')
}

export default globalTeardown