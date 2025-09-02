"use client"

import { useState, useMemo, useTransition } from "react"
import { updateUserRole } from "./actions"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Users, Mail, Calendar, ShoppingBag, Search, Filter, X } from "lucide-react"

interface Customer {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  role?: string
  created_at: string
  orders?: { count: number }[]
}

import { Role } from "@/types/role"

interface CustomersClientProps {
  customers: Customer[]
  roles: Role[]
}

export default function CustomersClient({ customers, roles }: CustomersClientProps) {
  const [isPending, startTransition] = useTransition()
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [orderFilter, setOrderFilter] = useState<string>("all")
  const [dateSort, setDateSort] = useState<string>("newest")

  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = customers.filter((customer) => {
      // Search filter (by name, email, or phone)
      const nameMatch = `${customer.first_name} ${customer.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
      const emailMatch = customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      const phoneMatch = customer.phone?.includes(searchTerm) || false
      const idMatch = customer.id.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesSearch = searchTerm === "" || nameMatch || emailMatch || phoneMatch || idMatch
      
      // Role filter
      const matchesRole = roleFilter === "all" || customer.role === roleFilter
      
      // Order count filter
      const orderCount = customer.orders?.[0]?.count || 0
      const matchesOrders = orderFilter === "all" || 
        (orderFilter === "no-orders" && orderCount === 0) ||
        (orderFilter === "1-5-orders" && orderCount >= 1 && orderCount <= 5) ||
        (orderFilter === "6-10-orders" && orderCount >= 6 && orderCount <= 10) ||
        (orderFilter === "many-orders" && orderCount > 10)

      return matchesSearch && matchesRole && matchesOrders
    })

    // Sort by join date
    if (dateSort === "newest") {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    } else if (dateSort === "oldest") {
      filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    }

    return filtered
  }, [customers, searchTerm, roleFilter, orderFilter, dateSort])

  const clearFilters = () => {
    setSearchTerm("")
    setRoleFilter("all")
    setOrderFilter("all")
    setDateSort("newest")
  }

  const hasActiveFilters = searchTerm || roleFilter !== "all" || orderFilter !== "all" || dateSort !== "newest"

  // Get unique roles from customers
  const availableRoles = Array.from(new Set(customers.map(customer => customer.role || 'customer')))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customers and view their details
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, email, phone, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Role Filter */}
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {availableRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Order Count Filter */}
          <Select value={orderFilter} onValueChange={setOrderFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Orders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Customers</SelectItem>
              <SelectItem value="no-orders">No Orders</SelectItem>
              <SelectItem value="1-5-orders">1-5 Orders</SelectItem>
              <SelectItem value="6-10-orders">6-10 Orders</SelectItem>
              <SelectItem value="many-orders">10+ Orders</SelectItem>
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
          Showing {filteredAndSortedCustomers.length} of {customers.length} customers
          {hasActiveFilters && " (filtered)"}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>All Customers ({filteredAndSortedCustomers?.length || 0})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAndSortedCustomers && filteredAndSortedCustomers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {customer.first_name} {customer.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {customer.id.substring(0, 8)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{customer.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {customer.phone || "Not provided"}
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={customer.role_id || undefined}
                        onValueChange={(roleId) => {
                          startTransition(() => {
                            updateUserRole(customer.id, roleId)
                          })
                        }}
                        disabled={isPending}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        <span>{customer.orders?.[0]?.count || 0} orders</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(customer.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {hasActiveFilters ? "No customers match your filters" : "No customers found"}
              </h3>
              <p className="text-muted-foreground">
                {hasActiveFilters 
                  ? "Try adjusting your search criteria or clear the filters."
                  : "Customer data will appear here as users register on your site."
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}