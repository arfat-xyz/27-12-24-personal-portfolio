import config from "@/lib/config";
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: config.githubId ?? "",
      clientSecret: config.githubSecret ?? "",
    }),
  ],
};
export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
