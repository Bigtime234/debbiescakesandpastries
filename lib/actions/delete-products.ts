"use server"

import { createSafeActionClient } from "next-safe-action"
import * as z from "zod"

import { revalidatePath } from "next/cache"
import { db } from "@/server"
import { eq } from "drizzle-orm"
import { products } from "@/server/schema"


const action = createSafeActionClient();

export const deleteProduct = async (input: { id: number }) => {
  try {
    const data = await db
      .delete(products)
      .where(eq(products.id, input.id))
      .returning();
    revalidatePath("/dashboard/products");
    return { success: `Product ${data[0]?.title ?? ""} has been deleted` };
  } catch (error) {
    return { error: "Failed to delete product" };
  }
};