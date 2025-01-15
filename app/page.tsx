import HomeClientComponent from "@/components/Home/home-client-component";
import { db } from "@/lib/db";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio Backend",
  description: "A backend for handling all the backend for my website",
};

export default async function Home() {
  const allBlogs = await db.blog.findMany({});
  const allProjects = await db.project.findMany({});
  const categoriesWithCount = await db.blogCategory.findMany({
    include: {
      _count: {
        select: {
          BlogCategoryRelation: true,
        },
      },
    },
    take: 5,
  });
  const transformedCategories = categoriesWithCount.map((category) => ({
    ...category,
    count: category._count.BlogCategoryRelation, // Extract count from _count
    _count: undefined, // Remove _count if needed
  }));

  return (
    <HomeClientComponent
      categories={transformedCategories}
      blogs={allBlogs}
      projects={allProjects}
    />
  );
}
