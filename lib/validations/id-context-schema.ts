import { z } from "zod";

// Define the reusable params schema
export const paramsSchema = z.object({
  blogId: z.string({
    invalid_type_error: "Blog must be a string",
    required_error: "Blog id is required",
  }),
});
export const paramsProjectIdSchema = z.object({
  projectId: z.string({
    invalid_type_error: "Blog must be a string",
    required_error: "Blog id is required",
  }),
});

export const categoryIdSchema = z.object({
  id: z.string({
    invalid_type_error: "Category id must be a string",
    required_error: "Category  id is required",
  }),
});
// Use the reusable paramsSchema in routeBlogContextSchema
export const routeBlogContextSchema = z.object({
  params: paramsSchema, // Reuse the paramsSchema here
});
export const routeCateogoryContextSchema = z.object({
  params: categoryIdSchema, // Reuse the paramsSchema here
});
export const idSchema = (fieldName: string = "Blog id") => {
  return z.object({
    id: z.string({
      invalid_type_error: `${fieldName} must be a string`,
      required_error: `${fieldName} is required`,
    }),
  });
};
