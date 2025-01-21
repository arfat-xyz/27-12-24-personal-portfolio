import { routeErrorHandler } from "@/lib/api-error-handler";
import { formatErrorResponse, formatResponse } from "@/lib/api-response";
import { deleteImages } from "@/lib/cloudinary";
import { db } from "@/lib/db";
import { galleryPUTSchema } from "@/lib/validations/galleryValidation";
import {
  idSchema,
  routeBlogContextSchema,
} from "@/lib/validations/id-context-schema";
import { z } from "zod";

export async function PUT(
  req: Request,
  { params }: z.infer<typeof routeBlogContextSchema>
) {
  try {
    // Ensure context.params is resolved, as it's a promise
    const { id } = idSchema("Gallery id").parse(await params);

    const body = await req.json();
    const data = await galleryPUTSchema.parseAsync(body);
    const existingBlog = await db.photo.count({
      where: {
        id,
      },
    });
    if (!existingBlog) return formatErrorResponse("Gallery not found", 404);

    const galleryDoc = await db.photo.update({
      where: {
        id: id,
      },
      data,
    });
    return formatResponse(galleryDoc, "Gallery updated successfully", 200);
  } catch (error) {
    // console.error(error, "from error"); // Log the error for debugging

    return routeErrorHandler(error);
  }
}
export async function DELETE(
  _req: Request,
  { params }: z.infer<typeof routeBlogContextSchema>
) {
  try {
    // Ensure context.params is resolved, as it's a promise
    const { id } = idSchema("Gallery id").parse(await params);

    const existingBlog = await db.photo.findUnique({
      where: { id },
    });
    if (!existingBlog?.id) return formatErrorResponse("Gallery not found", 404);
    await deleteImages(existingBlog.images);

    const blogDoc = await db.photo.delete({
      where: {
        id,
      },
    });
    return formatResponse(blogDoc, "Gallery deleted successfully", 200);
  } catch (error) {
    // console.error(error, "from error"); // Log the error for debugging

    return routeErrorHandler(error);
  }
}
