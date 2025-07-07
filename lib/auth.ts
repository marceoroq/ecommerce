import NextAuth, { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";

import { compareSync } from "bcryptjs";

import prisma from "@/lib/prisma";
import { getUserByEmail } from "@/lib/services/user.services";

export const config = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "admin@example.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "admin",
        },
      },
      async authorize(credentials) {
        if ((credentials.email as string).length === 0) return null;

        const user = await getUserByEmail(credentials.email as string);
        if (!user) return null;

        const isMatch = compareSync(
          credentials.password as string,
          user.password!
        );
        if (!isMatch) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
