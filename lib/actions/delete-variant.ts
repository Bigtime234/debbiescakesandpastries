"use server"
import { createSafeActionClient } from "next-safe-action"
import * as z from "zod"
import { db } from "@/server"
import { productVariants } from "@/server/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

const action = createSafeActionClient()

export const deleteVariant = async ({ id }: { id: number }) => {
  try {
    const deletedVariant = await db
      .delete(productVariants)
      .where(eq(productVariants.id, id))
      .returning()
    revalidatePath("dashboard/products")
    return { success: `Deleted ${deletedVariant[0]?.productType}` }
  } catch (error) {
    return { error: "Failed to delete variant" }
  }
}
