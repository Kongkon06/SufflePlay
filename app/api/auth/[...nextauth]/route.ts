import { prismaClient } from "@/app/lib/db";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "secret",
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) {
        console.error("Sign-in failed: Missing email.");
        return false;
      }

      try {
        // Check if user already exists
        let existingUser = await prismaClient.user.findUnique({
          where: { email: user.email },
        });

        // Create user only if they don't already exist
        if (!existingUser) {
          existingUser = await prismaClient.user.create({
            data: {
              email: user.email,
              provider: "Google" // Ensure this is a valid string value
            }
          });
          
        }

        return true;
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false;
      }
    },
    async session({ session, token }) {
        if (session.user && token.db_id) {
          session.user.db_id = token.db_id as string;
          console.log(session.user.db_id)
        }
        return session;
      },
      
      async jwt({ token, user }) {
        if (user) {
          const userRecord = await prismaClient.user.findUnique({
            where: { email: user.email ?? "" },
          });
      
          if (userRecord) {
            token.db_id = userRecord.id;
          }
        }
        return token;
      },
      
  },
});

export { handler as GET, handler as POST };
