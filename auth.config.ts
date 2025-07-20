import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [], // only to satisfy NextAuthConfig
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    jwt({ token, user, trigger, session }) {
      // this update is executed when we update name in profile
      if (trigger === "update") {
        token.name = session.user.name;
      }

      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
} satisfies NextAuthConfig;
