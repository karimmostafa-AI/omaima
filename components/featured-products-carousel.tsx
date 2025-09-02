"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useCallback, useEffect, useState } from "react"



interface FeaturedProductsCarouselProps {
  products: any[]
}

export function FeaturedProductsCarousel({ products }: FeaturedProductsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: 'start',
      slidesToScroll: 1,
      breakpoints: {
        '(min-width: 640px)': { slidesToScroll: 2 },
        '(min-width: 1024px)': { slidesToScroll: 3 }
      }
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  )
  
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {products.map((product) => (
            <div key={product.id} className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] min-w-0">
              <Card className="group border-0 shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                <CardContent className="p-0">
                  <Link href={`/products/${product.slug}`}>
                    <div className="relative">
                      <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
                        <Image
                          src={product.images?.[0] || "/placeholder.svg"}
                          alt={product.name}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                        New
                      </div>
                    </div>
                  </Link>

                  <div className="p-4 space-y-3">
                    <div className="space-y-1">
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-foreground">${product.price}</span>
                    </div>

                    <div className="space-y-2">
                      {product.colors && product.colors.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">Colors:</span>
                          <div className="flex space-x-1">
                            {product.colors.slice(0, 3).map((color: string, index: number) => (
                              <div
                                key={index}
                                className="w-4 h-4 rounded-full border border-border"
                                style={{ backgroundColor: color.toLowerCase() }}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      {product.sizes && product.sizes.length > 0 && (
                         <div className="text-xs text-muted-foreground">Sizes: {product.sizes.join(", ")}</div>
                      )}
                    </div>

                    <Button className="w-full" size="sm">
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation Arrows */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm z-10 shadow-lg"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm z-10 shadow-lg"
        onClick={scrollNext}
        disabled={!canScrollNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}