import { createClient } from "@/lib/supabase/server"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Package, ShoppingCart, Users, Clock, User, CreditCard } from "lucide-react"
import { AdminGuard } from '@/lib/auth/admin-guard'
import { AdminLayout } from '@/components/admin/AdminLayout'

import { SalesChart } from "@/components/admin/sales-chart"

async function DashboardContent() {
  const supabase = await createClient()

  // Parallelize the database calls for efficiency
  const [
    productCountRes,
    orderCountRes,
    deliveredOrdersRes,
    pendingOrdersRes,
    customerCountRes,
    recentOrdersRes,
    recentCustomersRes,
    salesDataRes
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("total_price").eq("status", "delivered"),
    supabase.from("orders").select("total_price").in("status", ["processing", "shipped"]),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("id, total_price, status, created_at, user_id").order("created_at", { ascending: false }).limit(5),
    supabase.from("profiles").select("first_name, last_name, created_at").order("created_at", { ascending: false }).limit(3),
    supabase.rpc('get_daily_sales', {
      start_date: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
      end_date: new Date().toISOString()
    })
  ]);

  const productCount = productCountRes.count ?? 0
  const orderCount = orderCountRes.count ?? 0
  const customerCount = customerCountRes.count ?? 0

  const confirmedRevenue = deliveredOrdersRes.data
    ? deliveredOrdersRes.data.reduce((sum, order) => sum + (order.total_price || 0), 0)
    : 0
    
  const pendingRevenue = pendingOrdersRes.data
    ? pendingOrdersRes.data.reduce((sum, order) => sum + (order.total_price || 0), 0)
    : 0
    
  const totalRevenue = confirmedRevenue + pendingRevenue

  // Process recent activity data
  const recentOrders = recentOrdersRes.data || []
  const recentCustomers = recentCustomersRes.data || []

  // Get customer names for recent orders
  const orderUserIds = recentOrders.map(order => order.user_id).filter(Boolean)
  const { data: orderCustomers } = await supabase
    .from("profiles")
    .select("id, first_name, last_name")
    .in("id", orderUserIds)
  
  const customerMap = new Map()
  orderCustomers?.forEach(customer => {
    customerMap.set(customer.id, `${customer.first_name} ${customer.last_name}`)
  })

  // Combine and sort recent activities
  const recentActivities = [
    ...recentOrders.map(order => ({
      type: 'order' as const,
      id: order.id,
      title: `Order #${order.id}`,
      description: `$${order.total_price} - ${order.status}`,
      customer: customerMap.get(order.user_id) || 'Unknown Customer',
      timestamp: order.created_at,
      status: order.status
    })),
    ...recentCustomers.map(customer => ({
      type: 'customer' as const,
      id: `customer-${customer.created_at}`,
      title: 'New Customer',
      description: `${customer.first_name} ${customer.last_name} joined`,
      customer: `${customer.first_name} ${customer.last_name}`,
      timestamp: customer.created_at,
      status: 'new'
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${confirmedRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From delivered orders only</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">${pendingRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Processing + shipped orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{orderCount}</div>
            <p className="text-xs text-muted-foreground">All-time orders placed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productCount}</div>
            <p className="text-xs text-muted-foreground">Active products in store</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{customerCount}</div>
            <p className="text-xs text-muted-foreground">Total registered users</p>
          </CardContent>
        </Card>
      </div>
  const salesData = salesDataRes.data || []

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${confirmedRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From delivered orders only</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">${pendingRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Processing + shipped orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{orderCount}</div>
            <p className="text-xs text-muted-foreground">All-time orders placed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productCount}</div>
            <p className="text-xs text-muted-foreground">Active products in store</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{customerCount}</div>
            <p className="text-xs text-muted-foreground">Total registered users</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <SalesChart data={salesData.map(d => ({ name: new Date(d.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), total: d.total }))} />
        </div>
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="flex-shrink-0">
                      {activity.type === 'order' ? (
                        <CreditCard className="h-4 w-4 text-blue-500" />
                      ) : (
                        <User className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium truncate">{activity.title}</h4>
                        {activity.type === 'order' && (
                          <Badge 
                            variant={activity.status === 'delivered' ? 'default' : 
                                   activity.status === 'pending' ? 'secondary' : 
                                   activity.status === 'processing' ? 'outline' : 'destructive'}
                            className="text-xs"
                          >
                            {activity.status}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {activity.description}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">
                          {activity.customer}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No recent activity found.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Activity will appear here as customers place orders and register.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <AdminGuard requiredPermissions={['view-dashboard']}>
      <AdminLayout>
        <DashboardContent />
      </AdminLayout>
    </AdminGuard>
  )
}
