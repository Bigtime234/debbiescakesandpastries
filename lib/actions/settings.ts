"use server"
import { SettingsSchema } from "@/types/settings-schema"
import { createSafeActionClient } from "next-safe-action"
import { auth } from "@/server/auth"
import { db } from "@/server"
import { eq } from "drizzle-orm"
import { users } from "@/server/schema"
import { revalidatePath } from "next/cache"

const action = createSafeActionClient();

export const settings = action
  .schema(SettingsSchema)
  .action(async ({ parsedInput: values }) => {
    console.log("🚀 Action started with values:", values);
    
    try {
      // Check auth
      const user = await auth();
      console.log("👤 Auth result:", user);
      
      if (!user) {
        console.log("❌ No user found");
        return { error: "User not found" };
      }

      // Check if user.user exists or if it's just user.id
      const userId = user.user?.id;
      console.log("🔍 Using user ID:", userId);

      if (!userId) {
        console.log("❌ No user ID found");
        return { error: "Invalid user session" };
      }

      // Find user in database
      console.log("🔍 Looking for user in database...");
      const dbUser = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });
      
      console.log("📊 Database user found:", dbUser);
      
      if (!dbUser) {
        console.log("❌ User not found in database");
        return { error: "User not found in database" };
      }

      // Update user
      console.log("🔄 Updating user with:", { name: values.name, image: values.image });
      
      const updateResult = await db
        .update(users)
        .set({
          name: values.name,
          image: values.image,
        })
        .where(eq(users.id, dbUser.id));

      console.log("✅ Update result:", updateResult);

      // Revalidate path
      revalidatePath("/dashboard/settings");
      console.log("🔄 Path revalidated");

      return { success: "Settings updated successfully!" };
      
    } catch (error) {
      console.error("💥 Error in settings action:", error);
      return { 
        error: `Database error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  });

// Alternative: Simple test function to check if basic functionality works
export async function testSettings() {
  try {
    const user = await auth();
    console.log("Test - Auth user:", user);
    
    if (!user) return { error: "No auth" };
    
    const userId = user.user?.id;
    console.log("Test - User ID:", userId);
    
    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    
    console.log("Test - DB User:", dbUser);
    
    return { success: "Test passed", user: dbUser };
  } catch (error) {
    console.error("Test error:", error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}