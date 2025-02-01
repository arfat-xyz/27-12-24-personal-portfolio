import { Blog, BlogCategory } from "@prisma/client";

export interface BlogWithCategories extends Blog {
  categories: BlogCategory[];
}

// Generic Interface for API Response
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: {
    meta: Meta;
    result: T[];
  };
}

// Meta Information Interface
interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

// Example of a possible Result Type (Modify this for your specific use case)
interface Result {
  id: string;
  type: string;
  message: string;
  userId: string;
  chatbotId: string;
  status: string;
  url: string;
  metadata: string;
  createdAt: string;
}
