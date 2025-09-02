"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product } from '@/types/product';
import { CartItem, CustomizationSelection, CartSummary } from '@/types/cart';
import { SuitCustomizationData } from '@/types/customization';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, customization?: CustomizationSelection[]) => void;
  addCustomizedToCart: (product: Product, customization: SuitCustomizationData, price: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSummary: CartSummary;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Helper function to generate unique cart item ID
function generateCartItemId(productId: string, variantId?: string, hasCustomization?: boolean): string {
  const base = variantId ? `${productId}-${variantId}` : productId;
  return hasCustomization ? `${base}-custom-${Date.now()}` : base;
}

// Helper function to convert SuitCustomizationData to CustomizationSelection array
function customizationDataToSelections(customization: SuitCustomizationData): CustomizationSelection[] {
  const selections: CustomizationSelection[] = [];
  
  // Add style selections
  Object.entries(customization.style).forEach(([key, value]) => {
    selections.push({
      option_type: key,
      selected_value: value,
      selected_id: value
    });
  });
  
  // Add fabric selections
  selections.push({
    option_type: 'material',
    selected_value: customization.fabric.material_id,
    selected_id: customization.fabric.material_id
  });
  
  selections.push({
    option_type: 'color',
    selected_value: customization.fabric.color_id || '',
    selected_id: customization.fabric.color_id
  });
  
  // Add fit preference
  selections.push({
    option_type: 'fit_type',
    selected_value: customization.fit_preferences.fit_type,
    selected_id: customization.fit_preferences.fit_type
  });
  
  // Add details if present
  Object.entries(customization.details).forEach(([key, value]) => {
    if (value) {
      selections.push({
        option_type: key,
        selected_value: value as string,
        selected_id: value as string
      });
    }
  });
  
  return selections;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('omaima-cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        // Ensure backward compatibility with old cart structure
        const migratedCart = parsedCart.map((item: any) => {
          if (!item.id || typeof item.id === 'number') {
            // Old format - migrate to new format
            return {
              id: generateCartItemId(item.id?.toString() || 'unknown'),
              customer_id: 'guest', // We'll update this when user logs in
              product_id: item.id?.toString() || 'unknown',
              quantity: item.quantity || 1,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              product: {
                id: item.id?.toString() || 'unknown',
                name: item.name || 'Unknown Product',
                slug: item.slug || 'unknown',
                price: item.price || 0,
                images: item.images || [],
                stock_quantity: item.stock || 0,
                min_quantity: 1,
                is_customizable: item.is_customizable || false,
                customization_options: item.customization_options || [],
                tags: item.tags || [],
                is_active: true,
                is_featured: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            };
          }
          return item;
        });
        setCartItems(migratedCart);
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      setCartItems([]);
    }
  }, []);

  useEffect(() => {
    // Persist cart to localStorage
    localStorage.setItem('omaima-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number = 1, customization?: CustomizationSelection[]) => {
    const itemId = generateCartItemId(product.id, undefined, !!customization);
    
    setCartItems(prevItems => {
      // For customized items, always create a new entry
      if (customization && customization.length > 0) {
        const newItem: CartItem = {
          id: itemId,
          customer_id: 'guest', // Will be updated when user logs in
          product_id: product.id,
          quantity,
          customization_data: customization,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          product
        };
        return [...prevItems, newItem];
      }
      
      // For regular items, check if it already exists
      const existingItem = prevItems.find(item =>
        item.product_id === product.id &&
        !item.customization_data?.length
      );

      if (existingItem) {
        return prevItems.map(item =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + quantity, updated_at: new Date().toISOString() }
            : item
        );
      }
      
      // Create new regular item
      const newItem: CartItem = {
        id: itemId,
        customer_id: 'guest',
        product_id: product.id,
        quantity,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        product
      };
      
      return [...prevItems, newItem];
    });
  };

  const addCustomizedToCart = (product: Product, customization: SuitCustomizationData, price: number) => {
    const customizationSelections = customizationDataToSelections(customization);
    
    // Create a customized product with the calculated price
    const customizedProduct: Product = {
      ...product,
      price: price // Use the calculated price including customization costs
    };
    
    addToCart(customizedProduct, 1, customizationSelections);
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId 
            ? { ...item, quantity, updated_at: new Date().toISOString() } 
            : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  // Calculate cart summary
  const cartSummary: CartSummary = {
    subtotal: cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
    tax_amount: 0, // Will be calculated based on location
    shipping_amount: 0, // Will be calculated based on items and location
    discount_amount: 0, // Will be applied with coupons
    total_amount: 0,
    items_count: cartCount
  };
  
  // Calculate total (will include tax and shipping when implemented)
  cartSummary.total_amount = cartSummary.subtotal + cartSummary.tax_amount + cartSummary.shipping_amount - cartSummary.discount_amount;

  const value = {
    cartItems,
    addToCart,
    addCustomizedToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartSummary,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
