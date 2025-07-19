"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TotalOrders } from "@/lib/infer-types"
import { cn } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { useMemo } from "react"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export default function Earnings({
  totalOrders,
}: {
  totalOrders: TotalOrders[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const filter = searchParams.get("filter") || "week"

  // Process all orders into chart items
  const chartItems = useMemo(() => {
    console.log("Raw totalOrders:", totalOrders)
    
    if (!totalOrders || totalOrders.length === 0) {
      console.log("No orders found")
      return []
    }

    const validItems = totalOrders
      .map((orderItem, index) => {
        console.log(`Processing order ${index}:`, orderItem)
        
        // Access the nested order object
        const order = orderItem.order
        const product = orderItem.product
        
        // Get date from the order.created field
        let orderDate
        if (order?.created) {
          orderDate = new Date(order.created)
        } else {
          console.log(`Order ${index} has no valid date field in order:`, order)
          return null
        }

        // Check if date is valid
        if (isNaN(orderDate.getTime())) {
          console.log(`Order ${index} has invalid date:`, order.created)
          return null
        }

        // Get price from the product object
        let productPrice
        if (product?.price && typeof product.price === 'number') {
          productPrice = product.price
        } else if (product?.price && typeof product.price === 'string') {
          productPrice = parseFloat(product.price)
        } else {
          console.log(`Order ${index} has no valid product price`, product?.price)
          return null
        }

        // Get quantity from the orderProduct item
        let quantity = orderItem.quantity || 1

        if (isNaN(productPrice) || isNaN(quantity)) {
          console.log(`Order ${index} has invalid price or quantity:`, { productPrice, quantity })
          return null
        }

        const totalPrice = productPrice * quantity

        return {
          date: orderDate,
          revenue: totalPrice,
          id: orderItem.id,
          originalOrder: orderItem,
          productTitle: product?.title || 'Unknown Product',
          quantity: quantity,
          unitPrice: productPrice
        }
      })
      .filter(item => item !== null)

    console.log("Valid chart items:", validItems)
    return validItems
  }, [totalOrders])

  // Calculate total revenue from ALL orders (product.price * quantity)
  const totalRevenue = useMemo(() => {
    const total = chartItems.reduce((sum, item) => sum + item.revenue, 0)
    console.log("Total revenue from all orders (price * quantity):", total)
    return total
  }, [chartItems])

  // Helper function to group orders by day and sum revenue
  const groupOrdersByDay = (orders: Array<{date: Date, revenue: number}>) => {
    const dailyRevenue: Record<string, {date: string, revenue: number, orderCount: number}> = {}
    
    orders.forEach(item => {
      const dateKey = item.date.toISOString().split('T')[0] // YYYY-MM-DD format
      if (!dailyRevenue[dateKey]) {
        dailyRevenue[dateKey] = {
          date: dateKey,
          revenue: 0,
          orderCount: 0
        }
      }
      dailyRevenue[dateKey].revenue += item.revenue
      dailyRevenue[dateKey].orderCount += 1
    })
    
    return Object.values(dailyRevenue)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(day => ({
        date: new Date(day.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        }),
        revenue: day.revenue,
        orderCount: day.orderCount
      }))
  }

  // Weekly chart - show daily revenue totals from last 7 days
  const weeklyChart = useMemo(() => {
    const today = new Date()
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(today.getDate() - 7)
    
    const recentOrders = chartItems.filter(item => {
      return item.date >= sevenDaysAgo && item.date <= today
    })
    
    const dailyData = groupOrdersByDay(recentOrders)
    console.log("Weekly chart data:", dailyData)
    return dailyData
  }, [chartItems])

  // Monthly chart - show daily revenue totals from last 30 days
  const monthlyChart = useMemo(() => {
    const today = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(today.getDate() - 30)
    
    const recentOrders = chartItems.filter(item => {
      return item.date >= thirtyDaysAgo && item.date <= today
    })
    
    const dailyData = groupOrdersByDay(recentOrders)
    console.log("Monthly chart data:", dailyData)
    return dailyData
  }, [chartItems])

  // Active chart data
  const activeChart = useMemo(() => {
    return filter === "month" ? monthlyChart : weeklyChart
  }, [filter, weeklyChart, monthlyChart])

  // Calculate total orders for each period
  const weeklyOrderCount = useMemo(() => {
    return weeklyChart.reduce((sum, day) => sum + day.orderCount, 0)
  }, [weeklyChart])

  const monthlyOrderCount = useMemo(() => {
    return monthlyChart.reduce((sum, day) => sum + day.orderCount, 0)
  }, [monthlyChart])

  // Custom tooltip component for better visibility
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const orderCount = payload[0]?.payload?.orderCount || 0
      const revenue = payload[0]?.value || 0
      
      return (
        <div className="bg-background border border-border rounded-lg shadow-xl p-4 min-w-[200px] backdrop-blur-sm">
          <div className="border-b border-border pb-2 mb-3">
            <p className="font-semibold text-foreground text-sm">
              {label}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Revenue:
              </span>
              <span className="text-sm font-bold text-primary">
                ₦{Number(revenue).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Orders:
              </span>
              <span className="text-sm font-bold text-secondary-foreground">
                {orderCount}
              </span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  // Debug all the data
  console.log("Final debug:", {
    totalOrdersLength: totalOrders?.length || 0,
    chartItemsLength: chartItems.length,
    activeChartLength: activeChart.length,
    totalRevenue,
    filter,
    activeChart,
    sampleOrders: totalOrders?.slice(0, 3) || [],
    sampleChartItems: chartItems.slice(0, 3)
  })

  return (
    <Card className="flex-1 shrink-0 h-full">
      <CardHeader>
        <CardTitle>Your Revenue: ₦{totalRevenue.toLocaleString()}</CardTitle>
       
        <div className="flex items-center gap-2 pb-4">
          <Badge
            className={cn(
              "cursor-pointer",
              filter === "week" ? "bg-primary" : "bg-primary/25"
            )}
            onClick={() =>
              router.push("/dashboard/analytics/?filter=week", {
                scroll: false,
              })
            }
          >
            This Week ({weeklyOrderCount} orders)
          </Badge>
          <Badge
            className={cn(
              "cursor-pointer",
              filter === "month" ? "bg-primary" : "bg-primary/25"
            )}
            onClick={() =>
              router.push("/dashboard/analytics/?filter=month", {
                scroll: false,
              })
            }
          >
            This Month ({monthlyOrderCount} orders)
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="h-96">
        {activeChart.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={activeChart}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#71717a' }}
              />
              <YAxis 
                tick={{ fill: '#71717a' }}
                tickFormatter={(value) => `₦${value.toLocaleString()}`}
              />
              <Tooltip
                content={CustomTooltip}
                cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
              />
              <Bar
                dataKey="revenue"
                className="fill-primary"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p>No orders found for selected period</p>
              <p className="text-sm mt-2">
                Total orders: {totalOrders?.length || 0} | 
                Valid orders: {chartItems.length} | 
                Recent orders: {filter === "week" ? weeklyOrderCount : monthlyOrderCount}
              </p>
              <p className="text-sm mt-1">
                Total Revenue: ₦{totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}