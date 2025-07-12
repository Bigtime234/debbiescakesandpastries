// actions/update-order-status.ts
"use server"

import { db } from "@/server"
import { auth } from "@/server/auth"
import { orders } from "@/server/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function updateOrderStatus(orderId: string, newStatus: "pending" | "processing" | "succeeded" | "completed" | "cancelled") {
  const user = await auth()
  if (!user) {
    throw new Error("Unauthorized")
  }

  // Check if user is admin or the order owner
  const isAdmin = user.user.role === "admin"
  
  if (!isAdmin) {
    // If not admin, check if the order belongs to the user
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, Number(orderId)),
    })
    
    if (!order || order.userID !== user.user.id) {
      throw new Error("Unauthorized to update this order")
    }
  }

  try {
    await db
      .update(orders)
      .set({ 
        status: newStatus,
        updatedAt: new Date() // Add this if you have an updatedAt field
      })
      .where(eq(orders.id, Number(orderId)))

    // Revalidate the orders page to show updated status
    revalidatePath("/orders")
    
    return { success: true, message: "Order status updated successfully" }
  } catch (error) {
    console.error("Error updating order status:", error)
    throw new Error("Failed to update order status")
  }
}