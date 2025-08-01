import { z } from "zod";

// Customization schema for cakes
const cakeCustomizationSchema = z.object({
  size: z.string(),
  layers: z.string(),
  flavour: z.string().optional(),
  upgrade: z.string().optional(),
  creamType: z.string().optional(),
  toppings: z.array(z.string()).optional(),
  addOns: z.array(z.string()).optional(),
  message: z.string().optional(),
  basePrice: z.number(),
  totalPrice: z.number(),
}).optional();

// Product schema for orders
const orderProductSchema = z.object({
  productID: z.number(),
  variantID: z.number(),
  quantity: z.number(),
  name: z.string(),
  price: z.number(),
  image: z.string().optional(),
  customization: cakeCustomizationSchema, // Add customization support
});

// Customer info schema
const customerInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  whatsapp: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
});

// Legacy custom cake schema (for backward compatibility)
const customCakeSchema = z.object({
  size: z.string(),
  layers: z.string(),
  flavour: z.string().optional(),
  creamType: z.string().optional(),
  toppings: z.array(z.string()).optional(),
  addOns: z.array(z.string()).optional(),
  message: z.string().optional(),
});

// Main order schema
export const createOrderSchema = z.object({
  products: z.array(orderProductSchema).optional(),
  status: z.string(),
  total: z.number(),
  customerInfo: customerInfoSchema,
  paymentMethod: z.string(),
  isCustomCake: z.boolean().optional(),
  customCake: customCakeSchema.optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type OrderProduct = z.infer<typeof orderProductSchema>;
export type CakeCustomization = z.infer<typeof cakeCustomizationSchema>;