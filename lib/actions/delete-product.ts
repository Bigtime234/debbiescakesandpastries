"use server"
import { createSafeActionClient } from "next-safe-action"
import * as z from "zod"
import { revalidatePath } from "next/cache"
import { db } from "@/server"
import { eq } from "drizzle-orm"
import { products } from "@/server/schema"

const action = createSafeActionClient()

// Define the input schema
const deleteProductSchema = z.object({
  id: z.number()
})

export const deleteProduct = action
  .schema(deleteProductSchema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const data = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning()
      
      revalidatePath("/dashboard/products")
      
      return { 
        success: `Product ${data[0]?.title ?? ""} has been deleted` 
      }
    } catch (error) {
      throw new Error("Failed to delete product")
    }
  })