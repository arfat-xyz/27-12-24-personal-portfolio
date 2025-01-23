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
    // CredentialsProvider({
    //   name: "Credentials",
    //   credentials: {
    //     email: { label: "Email", type: "text" },
    //     password: {},
    //   },
    //   async authorize(credentials, req) {
    //     // Add logic here to look up the user from the credentials supplied
    //     if (
    //       !credentials ||
    //       typeof credentials.email !== "string" ||
    //       typeof credentials.password !== "string"
    //     ) {
    //       toast.error("Invalid email or password");
    //       return null;
    //     }
    //     const isItOAuthUser = await db.user.count({
    //       where: {
    //         email: credentials.email,
    //         emailVerified: {
    //           not: null,
    //         },
    //       },
    //     });
    //     if (isItOAuthUser) {
    //       toast.error("Please try to login with other login");
    //       return null;
    //     }

    //     const user = await db.user.findUnique({
    //       where: { email: credentials.email },
    //     });
    //     if (!user) {
    //       toast.error("Invalid email or password");
    //       return null;
    //     }
    //     const isPasswordCorrect = compare(
    //       credentials!.password,
    //       user?.hashedPassword as string,
    //     );
    //     if (!isPasswordCorrect) {
    //       toast.error("Invalid email or password");
    //       return null;
    //     }
    //     return {
    //       id: user.id,
    //       name: user.name,
    //       email: user.email,
    //       image: user.image,
    //       role: user.role,
    //     };
    //   },
    // }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false;
      const userAlreadyExist = await db.user.count({
        where: {
          email: user?.email,
        },
      });

      if (!userAlreadyExist) {
        await db.user.create({
          data: {
            email: user?.email,
            name: user?.name,
            image: user?.image,
            emailVerified: new Date(),
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
