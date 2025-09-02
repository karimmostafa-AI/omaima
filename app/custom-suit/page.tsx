import { Suspense } from 'react'
import { TestComponent } from '@/components/test-component'
import { getFeaturedProducts } from '@/lib/supabase/products'
import { SuitCustomizationData } from '@/types/customization'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Custom Suit Builder - Omaima',
  description: 'Design your perfect custom suit with our interactive suit builder. Choose fabrics, styles, and provide measurements for a perfectly tailored fit.',
}

export default async function CustomSuitPage() {
  // Get the first customizable product (suit) for the demo
  const products = await getFeaturedProducts(10)
  const suitProduct = products.find(p => p.is_customizable && 
    (p.name.toLowerCase().includes('suit') || p.category?.slug === 'formal-suits'))

  if (!suitProduct) {
    // If no suit product found, redirect to products page
    redirect('/products')
  }

  const handleCustomizationChange = (customization: SuitCustomizationData) => {
    // This would typically save the customization state or send analytics
    console.log('Customization updated:', customization)
  }

  const handleAddToCart = (customization: SuitCustomizationData, price: number) => {
    // This would add the customized product to the cart
    console.log('Adding customized suit to cart:', { customization, price })
    // In a real implementation, this would use the cart context
    // useCart().addCustomizedToCart(suitProduct, customization, price)
  }

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      }>
        <TestComponent />
      </Suspense>
    </div>
  )
}
