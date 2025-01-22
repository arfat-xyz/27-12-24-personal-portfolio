import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import GitHub from "next-auth/providers/github";
import config from "./lib/config";
import { db } from "./lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    GitHub({
      clientId: config.githubId,
      clientSecret: config.githubSecret,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false;
      const userAlreadyExist = await db.user.count({
        where: {
          email: user?.email,
        },
      });
      console.log({ userAlreadyExist });

      if (!userAlreadyExist) {
        await db.user.create({
          data: {
            email: user?.email,
            name: user?.name,
            image: user?.image,
          },
        });
      }
      return true;
    },
    async session({ token, session }) {
      if (token) {
        session!.user!.id = token.id;
        session!.user!.name = token.name;
        session!.user!.email = token.email!;
        session!.user!.image = token.picture;
        session!.user!.role = token.role;
      }

      return session;
    },
    async jwt({ token, user }): Promise<JWT> {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });
      if (!dbUser) {
        if (user?.id) {
          token.id = user.id;
        }
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        role: dbUser.role,
      };
    },
  },
});
