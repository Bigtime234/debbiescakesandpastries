import { db } from "@/server"
import { auth } from "@/server/auth"
import { orders } from "@/server/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { 
  Package, User, Phone, MapPin, Mail, 
  MessageCircle, Shield, CheckCircle, X, 
  MoreHorizontal, CalendarClock
} from "lucide-react"
import Image from "next/image"

// Helper function to format timestamp
function formatOrderDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

// Server action to update order status
async function updateOrderStatus(orderId: string, newStatus: "pending" | "processing" | "succeeded" | "completed" | "cancelled") {
  "use server"
  const user = await auth()
  if (!user) throw new Error("Unauthorized")
  
  const isAdmin = user.user.role === "admin"
  if (!isAdmin) {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, Number(orderId)),
    })
    if (!order || order.userID !== user.user.id) {
      throw new Error("Unauthorized to update this order")
    }
  }

  try {
    await db.update(orders)
      .set({ status: newStatus })
      .where(eq(orders.id, Number(orderId)))
    revalidatePath("/orders")
    return { success: true }
  } catch (error) {
    console.error("Error updating order status:", error)
    throw new Error("Failed to update order status")
  }
}

type OrderProductType = {
  product: {
    id: number
    title: string
    price: number
    // add other product fields as needed
  }
  productVariants: {
    id: number
    color: string
    variantImages: { url: string }[]
    // add other variant fields as needed
  }
  quantity: number
}

type OrderType = {
  id: number
  userID: string
  created: Date | null
  total: number
  status: string
  receiptURL: string | null
  paymentIntentID: string | null
  paymentMethod: string | null
  customerName: string | null
  customerEmail: string | null
  customerPhone: string | null
  customerWhatsapp: string | null
  shippingAddress: string | null
  shippingCity: string | null
  shippingState: string | null
  shippingPostalCode: string | null
  updatedAt: Date | null
  orderProduct: OrderProductType[]
}

export default async function OrdersPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const isAdmin = session.user.role === "admin"
  
  const ordersList: OrderType[] = await db.query.orders.findMany({
    where: isAdmin ? undefined : eq(orders.userID, session.user.id),
    with: {
      orderProduct: {
        with: {
          product: true,
          productVariants: { with: { variantImages: true } }
        }
      }
    },
    orderBy: (orders, { desc }) => [desc(orders.created)]
  })

  return (
    <div className="container mx-auto py-8">
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-3">
            {isAdmin ? (
              <>
                <Shield className="w-6 h-6 text-blue-600" />
                Order Management
              </>
            ) : (
              <>
                <Package className="w-6 h-6 text-indigo-600" />
                My Orders
              </>
            )}
          </CardTitle>
          <CardDescription>
            {isAdmin 
              ? "View and manage all customer orders" 
              : "Track your recent purchases and order status"
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="px-0">
          {ordersList.length === 0 ? (
            <div className="py-12 text-center">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">
                No orders found
              </h3>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border">
              <Table className="min-w-full divide-y divide-gray-200">
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order #
                    </TableHead>
                    {isAdmin && (
                      <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </TableHead>
                    )}
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </TableHead>
                    <TableHead className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                  {ordersList.map((order) => (
                    <TableRow key={order.id} className="hover:bg-gray-50">
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id}
                      </TableCell>
                      
                      {isAdmin && (
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-medium">{order.customerName || "N/A"}</span>
                            <span className="text-sm text-gray-500">{order.customerEmail || "N/A"}</span>
                          </div>
                        </TableCell>
                      )}
                      
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <CalendarClock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {order.created ? formatOrderDate(order.created.toISOString()) : "N/A"}
                          </span>
                        </div>
                      </TableCell>
                      
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ₦{order.total.toLocaleString()}
                      </TableCell>
                      
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                            {
                              "bg-yellow-100 text-yellow-800": order.status === "pending",
                              "bg-blue-100 text-blue-800": order.status === "processing",
                              "bg-green-100 text-green-800": order.status === "succeeded",
                              "bg-purple-100 text-purple-800": order.status === "completed",
                              "bg-red-100 text-red-800": order.status === "cancelled",
                            }
                          )}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      
                      <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Dialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <DialogTrigger className="w-full text-left">
                                  View details
                                </DialogTrigger>
                              </DropdownMenuItem>
                              {isAdmin && order.status === "pending" && (
                                <DropdownMenuItem>
                                  <form action={async () => {
                                    "use server"
                                    await updateOrderStatus(order.id.toString(), "succeeded")
                                  }}>
                                    <button type="submit" className="w-full text-left">
                                      Complete order
                                    </button>
                                  </form>
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>

                          {/* Order Details Dialog */}
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                Order #{order.id}
                                {isAdmin && <Badge variant="secondary">Admin View</Badge>}
                              </DialogTitle>
                              <DialogDescription>
                                <div className="flex items-center gap-2 mt-1">
                                  <CalendarClock className="h-4 w-4" />
                                  <span>
                                    Placed on {order.created ? formatOrderDate(order.created.toISOString()) : "N/A"}
                                  </span>
                                </div>
                              </DialogDescription>
                            </DialogHeader>

                            <div className="mt-6 space-y-6">
                              {/* Status Card */}
                              <Card>
                                <CardHeader className="pb-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <h3 className="text-lg font-medium">Order Status</h3>
                                      <Badge
                                        className={cn({
                                          "bg-yellow-100 text-yellow-800": order.status === "pending",
                                          "bg-blue-100 text-blue-800": order.status === "processing",
                                          "bg-green-100 text-green-800": order.status === "succeeded",
                                          "bg-purple-100 text-purple-800": order.status === "completed",
                                          "bg-red-100 text-red-800": order.status === "cancelled",
                                        })}
                                      >
                                        {order.status}
                                      </Badge>
                                    </div>
                                    {isAdmin && order.status === "pending" && (
                                      <div className="flex gap-2">
                                        <form action={async () => {
                                          "use server"
                                          await updateOrderStatus(order.id.toString(), "succeeded")
                                        }}>
                                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Mark Complete
                                          </Button>
                                        </form>
                                        <form action={async () => {
                                          "use server"
                                          await updateOrderStatus(order.id.toString(), "cancelled")
                                        }}>
                                          <Button size="sm" variant="destructive">
                                            <X className="mr-2 h-4 w-4" />
                                            Cancel
                                          </Button>
                                        </form>
                                      </div>
                                    )}
                                  </div>
                                </CardHeader>
                              </Card>

                              {/* Customer & Shipping Info */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                      <User className="h-5 w-5" />
                                      Customer Information
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                      <Mail className="h-4 w-4 text-muted-foreground" />
                                      <div>
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <p>{order.customerEmail || "N/A"}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <Phone className="h-4 w-4 text-muted-foreground" />
                                      <div>
                                        <p className="text-sm text-muted-foreground">Phone</p>
                                        <p>{order.customerPhone || "N/A"}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                                      <div>
                                        <p className="text-sm text-muted-foreground">WhatsApp</p>
                                        <p>{order.customerWhatsapp || "N/A"}</p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                      <MapPin className="h-5 w-5" />
                                      Shipping Address
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-2">
                                    <p className="font-medium">{order.customerName || "N/A"}</p>
                                    <p>{order.shippingAddress || "N/A"}</p>
                                    <p>
                                      {order.shippingCity || "N/A"}, {order.shippingState || "N/A"} {order.shippingPostalCode || ""}
                                    </p>
                                  </CardContent>
                                </Card>
                              </div>

                              {/* Order Items */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center gap-2 text-lg">
                                    <Package className="h-5 w-5" />
                                    Ordered Items (Total: {order.orderProduct.length})
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead className="w-[100px]">Image</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Qty</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {order.orderProduct.map(({ product, productVariants, quantity }) => (
                                        <TableRow key={`${product.id}-${productVariants.id}`}>
                                          <TableCell>
                                            <Image
                                              src={productVariants.variantImages[0]?.url || "/placeholder.jpg"}
                                              width={60}
                                              height={60}
                                              alt={product.title}
                                              className="rounded-md object-cover"
                                            />
                                          </TableCell>
                                          <TableCell className="font-medium">
                                            {product.title}
                                            <div className="flex items-center gap-2 mt-1">
                                              <div 
                                                className="h-3 w-3 rounded-full border" 
                                                style={{ backgroundColor: productVariants.color }}
                                              />
                                              <span className="text-xs capitalize text-muted-foreground">
                                                {productVariants.color}
                                              </span>
                                            </div>
                                          </TableCell>
                                          <TableCell>₦{product.price.toLocaleString()}</TableCell>
                                          <TableCell>{quantity}</TableCell>
                                          <TableCell className="text-right font-semibold">
                                            ₦{(product.price * quantity).toLocaleString()}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </CardContent>
                              </Card>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
