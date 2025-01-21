import { z } from "zod";
import { db } from "../db";
import { checkIsItValidateImageType } from "./blogValidation";

export const galleryPOSTSchema = z.object({
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
        const existingBlog = await db.photo.count({
          where: { slug },
        });
        return !existingBlog; // Ensure no blog with this slug exists
      },
      {
        message: "Slug must be unique",
      }
    ),
  images: z.array(
    z.union(
      [
        z
          .any()
          .refine(
            (file) => typeof file === "string" || !!file,
            "Image is required"
          )
          .refine(
            (file) =>
              typeof file === "string" ||
              !checkIsItValidateImageType(file.type),
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
      ],
      {
        required_error: "Images are required",
      }
    )
  ),
});
export const galleryPUTSchema = z.object({
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
});
