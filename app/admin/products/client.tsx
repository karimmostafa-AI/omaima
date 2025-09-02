"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import Link from "next/link"
import { PlusCircle, Search, Filter, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DeleteProductButton } from "@/components/delete-product-button"

interface Category {
  name: string
}

interface Product {
  id: number
  name: string
  price: number
  stock: number
  category: Category[] | null
}

interface ProductsClientProps {
  products: Product[]
  categories: { id: number; name: string }[]
}

export default function ProductsClient({ products, categories }: ProductsClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [stockFilter, setStockFilter] = useState<string>("all")
  const [priceSort, setPriceSort] = useState<string>("none")

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      // Search filter
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Category filter
      const matchesCategory = selectedCategory === "all" || 
        product.category?.[0]?.name === selectedCategory
      
      // Stock filter
      const matchesStock = stockFilter === "all" || 
        (stockFilter === "in-stock" && product.stock > 0) ||
        (stockFilter === "low-stock" && product.stock > 0 && product.stock <= 10) ||
        (stockFilter === "out-of-stock" && product.stock === 0)

      return matchesSearch && matchesCategory && matchesStock
    })

    // Sort by price
    if (priceSort === "low-to-high") {
      filtered.sort((a, b) => a.price - b.price)
    } else if (priceSort === "high-to-low") {
      filtered.sort((a, b) => b.price - a.price)
    }

    return filtered
  }, [products, searchTerm, selectedCategory, stockFilter, priceSort])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setStockFilter("all")
    setPriceSort("none")
  }

  const hasActiveFilters = searchTerm || selectedCategory !== "all" || stockFilter !== "all" || priceSort !== "none"

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Product
          </Link>
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Stock Filter */}
          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stock</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low-stock">Low Stock (≤10)</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>

          {/* Price Sort */}
          <Select value={priceSort} onValueChange={setPriceSort}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Sort by Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Sorting</SelectItem>
              <SelectItem value="low-to-high">Price: Low to High</SelectItem>
              <SelectItem value="high-to-low">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters} className="shrink-0">
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredAndSortedProducts.length} of {products.length} products
          {hasActiveFilters && " (filtered)"}
        </div>
      </div>

      <div className="border rounded-lg bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedProducts.map(product => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{product.category?.[0]?.name || 'N/A'}</Badge>
                </TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>
                  <Badge variant={
                    product.stock === 0 ? 'destructive' : 
                    product.stock <= 10 ? 'secondary' : 'default'
                  }>
                    {product.stock}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                  </Button>
                  <DeleteProductButton productId={product.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {filteredAndSortedProducts.length === 0 && (
        <div className="text-center text-muted-foreground py-12">
          {hasActiveFilters 
            ? "No products match your current filters."
            : "No products found."
          }
        </div>
      )}
    </div>
  )
}