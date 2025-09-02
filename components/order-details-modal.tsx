"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Package, MapPin, User, Calendar, CreditCard, Download } from "lucide-react"
import { useReactToPrint } from "react-to-pdf"
import { Invoice } from "./invoice"
import { useRef } from "react"

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

interface OrderDetails {
  id: number
  user_id: string | null
  total_price: number
  status: string
  shipping_address: any
  created_at: string
  order_items: OrderItem[]
  profile?: {
    first_name: string
    last_name: string
    email: string
    phone?: string
  }
}

interface OrderDetailsModalProps {
  order: OrderDetails
}

export function OrderDetailsModal({ order }: OrderDetailsModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const invoiceRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  });

  const formatAddress = (address: any) => {
    if (!address) return "No address provided"
    
    if (typeof address === 'string') {
      try {
        address = JSON.parse(address)
      } catch {
        return address
      }
    }

    const parts = [
      address.line1,
      address.line2,
      address.city,
      address.state,
      address.postal_code,
      address.country
    ].filter(Boolean)

    return parts.join(", ")
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'default'
      case 'shipped':
        return 'default'
      case 'processing':
        return 'secondary'
      case 'pending':
        return 'outline'
      case 'canceled':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
          <span className="sr-only">View order details</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order #{order.id.toString().padStart(6, '0')} Details
            </DialogTitle>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </Button>
          </div>
        </DialogHeader>

        <div className="hidden">
          <Invoice ref={invoiceRef} order={order} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="font-medium">Name: </span>
                {order.profile?.first_name} {order.profile?.last_name || 'Guest'}
              </div>
              <div>
                <span className="font-medium">Email: </span>
                {order.profile?.email || 'No email'}
              </div>
              {order.profile?.phone && (
                <div>
                  <span className="font-medium">Phone: </span>
                  {order.profile.phone}
                </div>
              )}
              <div>
                <span className="font-medium">Customer ID: </span>
                <span className="font-mono text-sm">
                  {order.user_id ? order.user_id.substring(0, 8) + '...' : 'Guest'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="font-medium">Status: </span>
                <Badge variant={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Order Date: </span>
                {new Date(order.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <div>
                <span className="font-medium">Total: </span>
                <span className="text-lg font-bold">
                  ${Number(order.total_price).toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {formatAddress(order.shipping_address)}
              </p>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="h-4 w-4" />
                Order Items ({order.order_items?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.order_items && order.order_items.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.order_items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {item.product?.name || `Product ID: ${item.product_id}`}
                            </div>
                            {item.product?.sku && (
                              <div className="text-sm text-muted-foreground">
                                SKU: {item.product.sku}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          ${Number(item.price).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No items found for this order
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}