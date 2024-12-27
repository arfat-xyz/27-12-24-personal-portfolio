import { z } from "zod";

// Define the reusable params schema
export const paramsSchema = z.object({
  blogId: z.string({
    invalid_type_error: "Blog must be a string",
    required_error: "Blog id is required",
  }),
});

// Use the reusable paramsSchema in routeBlogContextSchema
export const routeBlogContextSchema = z.object({
  params: paramsSchema, // Reuse the paramsSchema here
});
export const idSchema = z.object({
  id: z.string({
    invalid_type_error: "Blog must be a string",
    required_error: "Blog id is required",
  }),
});
