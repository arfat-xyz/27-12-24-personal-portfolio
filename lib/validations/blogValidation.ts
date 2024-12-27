import { z } from "zod";
import { db } from "../db";
import { BlogStatus } from "@prisma/client";
export const checkIsItValidateImageType = (type: string) =>
  /^image\/(jpeg|png|webp|svg\+xml)$/.test(type);
export const blogPOSTSchema = z.object({
  title: z.string({
    invalid_type_error: "Title must be a string",
    required_error: "Title is required",
  }),
  slug: z
    .string({
      invalid_type_error: "Slug must be a string",
      required_error: "Slug is required",
    })
    .min(1, "Slug is required")
    .transform(
      (value) =>
        value
          .trim()
          .replace(/\s+/g, "-") // Replace spaces with hyphens
          .replace(/[^a-z0-9-]/g, "") // Remove invalid characters
    )
    .refine(
      (value) => /^[a-z0-9-]+$/.test(value),
      "Slug can only contain lowercase letters, numbers, and hyphens"
    )
    .refine(
      async (slug) => {
        const existingBlog = await db.blog.count({
          where: { slug },
        });
        return !existingBlog; // Ensure no blog with this slug exists
      },
      {
        message: "Slug must be unique",
      }
    ),
  images: z.array(
    z.union([
      z
        .any()
        .refine(
          (file) => typeof file === "string" || !!file,
          "Image is required"
        )
        .refine(
          (file) =>
            typeof file === "string" || !checkIsItValidateImageType(file.type),
          "Only JPEG, PNG, WebP, and SVG formats are supported"
        ),
      // .refine(
      //   (file) => typeof file === "string" || file.size <= 2 * 1024 * 1024,
      //   "Image size only less then 2MB"
      // ),
      z.string({
        invalid_type_error: "Each image must be a string",
        required_error: "Each image is required",
      }), // Supports both file and URL as string
    ])
  ),
  description: z.string({
    required_error: "Description is required",
    invalid_type_error: "Description must be a string",
  }),
  blogCategory: z.array(
    z.string({
      required_error: "Blog category is required",
      invalid_type_error: "Blog category must be a string",
    })
  ),
  tags: z.array(
    z.string({
      required_error: "Tags are required",
      invalid_type_error: "Tags must be a string",
    })
  ),
  status: z.nativeEnum(BlogStatus),
});
export const blogPUTSchema = z.object({
  title: z
    .string({
      invalid_type_error: "Title must be a string",
      required_error: "Title is required",
    })
    .optional(), // Optional string
  slug: z
    .string({
      invalid_type_error: "Slug must be a string",
      required_error: "Slug is required",
    })
    .min(1, "Slug is required")
    .transform(
      (value) =>
        value
          .trim()
          .replace(/\s+/g, "-") // Replace spaces with hyphens
          .replace(/[^a-z0-9-]/g, "") // Remove invalid characters
    )
    .refine(
      (value) => /^[a-z0-9-]+$/.test(value),
      "Slug can only contain lowercase letters, numbers, and hyphens"
    )
    // .refine(
    //   async (slug) => {
    //     const existingBlog = await db.blog.findUnique({
    //       where: { slug },
    //     });
    //     return !existingBlog; // Ensure no blog with this slug exists
    //   },
    //   {
    //     message: "Slug must be unique",
    //   }
    // )
    .optional(), // Required string with a minimum length of 1
  images: z
    .array(
      z.union([
        z
          .any()
          .refine(
            (file) => typeof file === "string" || !!file,
            "Image is required"
          )
          .refine(
            (file) =>
              typeof file === "string" || checkIsItValidateImageType(file.type),
            "Only JPEG, PNG, WebP, and SVG formats are supported"
          )
          .refine(
            (file) => typeof file === "string" || file.size <= 2 * 1024 * 1024,
            "Image size only less then 2MB"
          ),
        z.string({
          invalid_type_error: "Each image must be a string",
          required_error: "Each image is required",
        }), // Supports both file and URL as string
      ])
    )
    .optional(), // Optional array of strings
  description: z
    .string({
      required_error: "Description is required",
      invalid_type_error: "Description must be a string",
    })
    .optional(), // Optional string
  blogCategory: z
    .array(
      z.string({
        required_error: "Blog category is required",
        invalid_type_error: "Blog category must be a string",
      })
    )
    .optional(), // Optional string
  tags: z
    .array(
      z.string({
        required_error: "Tags are required",
        invalid_type_error: "Tags must be a string",
      })
    )
    .optional(), // Optional string
  status: z
    .nativeEnum(BlogStatus, {
      invalid_type_error: "Invalid blog status",
      required_error: "Status is required",
    })
    .optional(),
});
