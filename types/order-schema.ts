// types/order-schema.ts
import { z } from "zod"

export const createOrderSchema = z.object({
  products: z.array(
    z.object({
      productID: z.number(),
      variantID: z.number(),
      quantity: z.number(),
    })
  ),
  status: z.string(),
  total: z.number(),
  customerInfo: z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().min(1, "Phone number is required"),
    whatsapp: z.string().min(1, "WhatsApp number is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(1, "Postal code is required"),
  }),
  paymentMethod: z.string().default("palmpay"),
})
