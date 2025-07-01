import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/server";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { users, accounts } from "./schema";
import { eq } from "drizzle-orm"

// Extend NextAuth Session user type to include isOAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      isOAuth?: boolean;
    }
  }
}




export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (session && token.sub) {
        session.user.id = token.sub
      }
      if (session.user && token.role) {
        session.user.role = token.role as string
      }
      if (session.user) {
       
        session.user.name = token.name
        session.user.email = token.email as string
        session.user.isOAuth = token.isOAuth as boolean
        session.user.image = token.image as string
      }
      return session
    },
    async jwt({ token }) {
      if (!token.sub) return token
      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, token.sub),
      })
      if (!existingUser) return token
      const existingAccount = await db.query.accounts.findFirst({
        where: eq(accounts.userId, existingUser.id),
      })

      token.isOAuth = !!existingAccount
      token.name = existingUser.name
      token.email = existingUser.email
      token.role = existingUser.role
      token.isTwoFactorEnabled = existingUser.twoFactorEnabled
      token.image = existingUser.image
      return token
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID, // Make sure to set your Google Client ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Make sure to set your Google Client Secret
    }),
  ],
});
