import { Blog, BlogCategory } from "@prisma/client";

export interface BlogWithCategories extends Blog {
  categories: BlogCategory[];
}
