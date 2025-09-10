import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";
import { selectOneEncrypted } from "@/lib/db/encrypted-db";
import { User } from "@/types/database";

// Debug environment variables
console.log(
  "[Auth] NEXTAUTH_SECRET:",
  process.env.NEXTAUTH_SECRET ? "Set" : "Not set"
);
console.log("[Auth] NEXTAUTH_URL:", process.env.NEXTAUTH_URL || "Not set");
console.log("[Auth] VERCEL_URL:", process.env.VERCEL_URL || "Not set");

const authConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true, // Allow Vercel to handle the host
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Fetch user by email (email is not encrypted)
          const userResult = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email as string))
            .limit(1);

          if (userResult.length === 0) {
            return null;
          }

          const user = userResult[0];

          // Decrypt the password field for comparison
          const decryptedPassword = await selectOneEncrypted<User>(
            users,
            "users",
            eq(users.id, user.id)
          );

          if (!decryptedPassword) {
            return null;
          }

          // Compare password with the decrypted password hash
          const isValid = await bcrypt.compare(
            credentials.password as string,
            decryptedPassword.password || ""
          );

          if (!isValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: decryptedPassword.name as string,
            image: decryptedPassword.image as string | null,
            bunqApiKey: decryptedPassword.bunqApiKey as string | null,
          };
        } catch (error) {
          console.error("[Auth] Error during authentication:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: { token: any; user: any }) {
      try {
        if (user) {
          // Initial login - user object is available
          token.id = user.id;
          token.bunqApiKey = user.bunqApiKey;
        } else if (token.id) {
          // Subsequent requests - fetch Bunq API key from database
          try {
            const dbUser = await selectOneEncrypted<User>(
              users,
              "users",
              eq(users.id, token.id as string)
            );

            if (dbUser) {
              token.bunqApiKey = dbUser.bunqApiKey as string | null;
            }
          } catch (error) {
            console.error("[JWT Callback] Error fetching Bunq API key:", error);
          }
        }

        return token;
      } catch (error) {
        console.error("[JWT Callback] Unexpected error:", error);
        return token;
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: { session: any; token: any }) {
      try {
        if (token.id) {
          session.user.id = token.id as string;
        }
        if (token.bunqApiKey) {
          session.user.bunqApiKey = token.bunqApiKey as string;
        }
        return session;
      } catch (error) {
        console.error("[Session Callback] Error:", error);
        return session;
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

// @ts-expect-error - NextAuth v5 beta compatibility issue
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// Export authConfig as authOptions for compatibility with getServerSession
export const authOptions = authConfig;
