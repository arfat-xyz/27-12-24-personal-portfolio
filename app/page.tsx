import HomeClientComponent from "@/components/Home/home-client-component";
import { db } from "@/lib/db";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio Backend",
  description: "A backend for handling all the backend for my website",
};

export default async function Home() {
  const allBlogs = await db.blog.findMany({});
  return <HomeClientComponent blogs={allBlogs} />;
}
