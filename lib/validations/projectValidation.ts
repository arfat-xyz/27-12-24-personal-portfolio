import { ProjectStatus } from "@prisma/client";
import { z } from "zod";
import { checkIsItValidateImageType } from "./blogValidation";
import { db } from "../db";

export const projectPOSTSchema = z.object({
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
        const existingProject = await db.project.count({
          where: { slug },
        });
        return !existingProject; // Ensure slug is unique
      },
      {
        message: "Slug must be unique",
      }
    ),

  images: z.array(
    z.union([
      z.string({
        invalid_type_error: "Each image must be a string",
        required_error: "Each image is required",
      }),
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
    ]),
    {
      required_error: "Images are required",
    }
  ),

  description: z.string({
    required_error: "Description is required",
    invalid_type_error: "Description must be a string",
  }),

  client: z.string().nullable().optional(),

  livePreview: z.string().nullable().optional(),

  projectCategory: z.array(
    z.string({
      required_error: "Project categories are required",
      invalid_type_error: "Project categories must be strings",
    }),
    {
      required_error: "At least one project category is required",
    }
  ),

  tags: z.array(
    z.string({
      required_error: "Tags are required",
      invalid_type_error: "Tags must be strings",
    }),
    {
      required_error: "At least one tag is required",
    }
  ),

  status: z.nativeEnum(ProjectStatus, {
    required_error: "Status is required",
    invalid_type_error: "Invalid project status",
  }),
});

export const projectPUTSchema = z.object({
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
    .optional(),

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
            "Image size must be less than 2MB"
          ),
        z.string({
          invalid_type_error: "Each image must be a string",
          required_error: "Each image is required",
        }),
      ])
    )
    .optional(),

  description: z
    .string({
      invalid_type_error: "Description must be a string",
      required_error: "Description is required",
    })
    .optional(),

  client: z.string().nullable().optional(),

  livePreview: z.string().nullable().optional(),

  projectCategory: z
    .array(
      z.string({
        required_error: "Project category is required",
        invalid_type_error: "Project category must be a string",
      })
    )
    .optional(),

  tags: z
    .array(
      z.string({
        required_error: "Tags are required",
        invalid_type_error: "Tags must be strings",
      })
    )
    .optional(),

  status: z
    .nativeEnum(ProjectStatus, {
      invalid_type_error: "Invalid project status",
      required_error: "Status is required",
    })
    .optional(),
});
