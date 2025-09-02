"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { UpdateOrderStatus } from "./update-order-status"
import { OrderDetailsModal } from "@/components/order-details-modal"
import { Search, Filter, Calendar, X } from "lucide-react"

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled'

interface OrderProfile {
  first_name: string
  last_name: string
  email: string
  phone?: string
}

interface OrderItem {
  id: number
  product_id: number | null
  quantity: number
  price: number
  product?: {
    name: string
    sku?: string
  }
}

interface Order {
  id: number
  user_id: string | null
  total_price: number
  status: OrderStatus
  shipping_address: any
  created_at: string
  profile?: OrderProfile
  order_items: OrderItem[]
}

interface OrdersClientProps {
  orders: Order[]
}

export default function OrdersClient({ orders }: OrdersClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateSort, setDateSort] = useState<string>("newest")
  const [amountFilter, setAmountFilter] = useState<string>("all")

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders.filter((order) => {
      // Search filter (by order ID, customer name, or email)
      const orderIdMatch = order.id.toString().includes(searchTerm)
      const customerNameMatch = searchTerm === "" || 
        `${order.profile?.first_name || ''} ${order.profile?.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
      const emailMatch = order.profile?.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false
      
      const matchesSearch = searchTerm === "" || orderIdMatch || customerNameMatch || emailMatch
      
      // Status filter
      const matchesStatus = statusFilter === "all" || order.status === statusFilter
      
      // Amount filter
      const amount = Number(order.total_price)
      const matchesAmount = amountFilter === "all" || 
        (amountFilter === "under-50" && amount < 50) ||
        (amountFilter === "50-100" && amount >= 50 && amount <= 100) ||
        (amountFilter === "100-200" && amount > 100 && amount <= 200) ||
        (amountFilter === "over-200" && amount > 200)

      return matchesSearch && matchesStatus && matchesAmount
    })

    // Sort by date
    if (dateSort === "newest") {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    } else if (dateSort === "oldest") {
      filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    }

    return filtered
  }, [orders, searchTerm, statusFilter, dateSort, amountFilter])

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setDateSort("newest")
    setAmountFilter("all")
  }

  const hasActiveFilters = searchTerm || statusFilter !== "all" || dateSort !== "newest" || amountFilter !== "all"

  // Get unique statuses from orders
  const availableStatuses = Array.from(new Set(orders.map(order => order.status)))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>

      {/* Search and Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by order ID, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {availableStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Amount Filter */}
          <Select value={amountFilter} onValueChange={setAmountFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Amount" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Amounts</SelectItem>
              <SelectItem value="under-50">Under $50</SelectItem>
              <SelectItem value="50-100">$50 - $100</SelectItem>
              <SelectItem value="100-200">$100 - $200</SelectItem>
              <SelectItem value="over-200">Over $200</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Sort */}
          <Select value={dateSort} onValueChange={setDateSort}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
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
          Showing {filteredAndSortedOrders.length} of {orders.length} orders
          {hasActiveFilters && " (filtered)"}
        </div>
      </div>

      <div className="border rounded-lg bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedOrders.map(order => (
              <TableRow key={order.id}>
                <TableCell className="font-mono">#{order.id.toString().padStart(6, '0')}</TableCell>
                <TableCell>
                  <div className="font-medium">{order.profile?.first_name || ''} {order.profile?.last_name || 'Guest'}</div>
                  <div className="text-sm text-muted-foreground">{order.profile?.email || 'No email'}</div>
                </TableCell>
                <TableCell>{format(new Date(order.created_at), "PPP")}</TableCell>
                <TableCell className="text-right">${Number(order.total_price).toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>{order.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <OrderDetailsModal order={order} />
                    <UpdateOrderStatus orderId={order.id} currentStatus={order.status} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {filteredAndSortedOrders.length === 0 && (
        <div className="text-center text-muted-foreground py-12">
          {hasActiveFilters 
            ? "No orders match your current filters."
            : "No orders found."
          }
        </div>
      )}
    </div>
  )
}