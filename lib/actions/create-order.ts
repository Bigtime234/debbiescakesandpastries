"use server"

import { createOrderSchema } from "@/types/order-schema"
import { createSafeActionClient } from "next-safe-action"
import { auth } from "@/server/auth"
import { db } from "@/server"
import { orderProduct, orders } from "@/server/schema"
import { z } from "zod"

const action = createSafeActionClient()

export const createOrder = action
  .schema(createOrderSchema)
  .action(async ({
    parsedInput: {
      products,
      status,
      total,
      customerInfo,
      paymentMethod,
    }
  }) => {
    const user = await auth()
    if (!user) return { error: "User not found" }

    try {
      // Create the order with customer information
      const order = await db
        .insert(orders)
        .values({
          status,
          total,
          userID: user.user.id,
          // Customer information
          customerName: customerInfo.fullName,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          customerWhatsapp: customerInfo.whatsapp,
          shippingAddress: customerInfo.address,
          shippingCity: customerInfo.city,
          shippingState: customerInfo.state,
          shippingPostalCode: customerInfo.postalCode,
          paymentMethod,
          created: new Date(),
        })
        .returning()

      // Create order products
      const orderProducts = await Promise.all(
        products.map(async (product: { productID: number; quantity: number; variantID: number }) => {
          const { productID, quantity, variantID } = product;
          return await db.insert(orderProduct).values({
            quantity,
            orderID: order[0].id,
            productID: productID,
            productVariantID: variantID,
          })
        })
      )

      return {
        success: "Order has been created successfully",
        orderId: order[0].id
      }
    } catch (error) {
      console.error("Error creating order:", error)
      return { error: "Failed to create order" }
    }
  })
