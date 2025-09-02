'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, ReactNode } from 'react'

// Create a stable query client instance
const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time for product data (data doesn't change frequently)
      staleTime: 1000 * 60 * 5, // 5 minutes
      // GC time (renamed from cacheTime in v5)
      gcTime: 1000 * 60 * 10, // 10 minutes
      // Retry configuration
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false
        }
        // Retry up to 3 times for other errors
        return failureCount < 3
      },
      // Refetch on window focus for real-time data
      refetchOnWindowFocus: true,
      // Refetch on reconnect
      refetchOnReconnect: true
    },
    mutations: {
      // Retry mutations once
      retry: 1
    }
  }
})

interface QueryProviderProps {
  children: ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Create query client in state to avoid recreating on re-renders
  const [queryClient] = useState(createQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false} 
          position="bottom-right"
        />
      )}
    </QueryClientProvider>
  )
}

// Custom hook for invalidating related queries
export const useInvalidateQueries = () => {
  const queryClient = new QueryClient()
  
  return {
    invalidateProducts: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
    invalidateCategories: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    invalidateOrders: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    }
  }
}