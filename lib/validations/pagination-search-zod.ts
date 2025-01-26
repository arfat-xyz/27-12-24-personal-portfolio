import { BlogStatus, Prisma } from "@prisma/client";
import { z } from "zod";

/**
 * Schema for pagination and search parameters.
 * - 'q': Optional search query string, trimmed of whitespace.
 * - 'page': Optional page number, defaults to 1 if invalid or not provided.
 * - 'limit': Optional limit per page, defaults to 10 if invalid or not provided.
 */
export const paginationSearchSchema = z.object({
  q: z
    .string()
    .optional()
    .transform((val) => val?.trim() || ""), // Trim whitespace or set to empty string
  page: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return 1; // Default to page 1 if not provided
      const num = parseInt(val, 10);
      return Number.isInteger(num) && num > 0 ? num : 1; // Ensure positive integer
    }),
  limit: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return 10; // Default limit to 10 if not provided
      const num = parseInt(val, 10);
      return Number.isInteger(num) && num > 0 ? num : 10; // Ensure positive integer
    }),
});

/**
 * Generates a Prisma OR filter for multiple fields with a search query, usable across different models.
 *
 * @param fields - Array of field names to search
 * @param query - The search query string
 * @returns Prisma filter object for an OR search across the specified fields
 */
export function generateSearchFilter<
  T extends
    | Prisma.BlogWhereInput
    | Prisma.BlogCategoryWhereInput
    | Prisma.ProjectCategoryWhereInput
    | Prisma.ProjectWhereInput
    | Prisma.PhotoWhereInput
    | Prisma.ContactWhereInput,
>(fields: Array<keyof T>, query: string): T["OR"] {
  return fields.map((field) => ({
    [field]: {
      contains: query,
      mode: "insensitive",
    },
  })) as T["OR"];
}

export const paginationSearchForBlogSchema = paginationSearchSchema.extend({
  status: z
    .string()
    .optional()
    .refine(
      (val) => !val || Object.values(BlogStatus).includes(val as BlogStatus),
      {
        message: "Invalid status value. Allowed values: Draft, Publish",
      },
    )
    .default(BlogStatus.Publish), // Default value if none provided
  blogCategoryName: z.string().optional(),
});
export const paginationSearchForBlogTagsSchema = paginationSearchSchema.extend({
  name: z.string().optional(),
});

export const paginationSearchForProjectSchema = paginationSearchSchema.extend({
  status: z
    .string()
    .optional()
    .refine(
      (val) => !val || Object.values(BlogStatus).includes(val as BlogStatus),
      {
        message: "Invalid status value. Allowed values: Draft, Publish",
      },
    )
    .default(BlogStatus.Publish), // Default value if none provided
  projectCategoryName: z.string().optional(),
});
