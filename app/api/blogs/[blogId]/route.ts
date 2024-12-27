import { routeErrorHandler } from "@/lib/api-error-handler";
import { formatErrorResponse, formatResponse } from "@/lib/api-response";
import { db } from "@/lib/db";
import cloudinary from "cloudinary";
import { blogPUTSchema } from "@/lib/validations/blogValidation";
import {
  paramsSchema,
  routeBlogContextSchema,
} from "@/lib/validations/id-context-schema";
import { z } from "zod";
import { deleteImages } from "@/lib/cloudinary";

export async function PUT(
  req: Request,
  { params }: z.infer<typeof routeBlogContextSchema>
) {
  try {
    // Ensure context.params is resolved, as it's a promise
    const { blogId } = paramsSchema.parse(await params);

    const body = await req.json();
    const data = await blogPUTSchema.parseAsync(body);
    const existingBlog = await db.blog.count({
      where: {
        id: blogId,
      },
    });
    if (!existingBlog) return formatErrorResponse("Blog not found", 404);
    const blogDoc = await db.blog.update({
      where: {
        id: blogId,
      },
      data,
    });
    return formatResponse(blogDoc, "Blog updated successfully", 200);
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
    const { blogId } = paramsSchema.parse(await params);

    const existingBlog = await db.blog.findUnique({
      where: { id: blogId },
    });
    if (!existingBlog?.id) return formatErrorResponse("Blog not found", 404);
    await deleteImages(existingBlog.images);

    const blogDoc = await db.blog.delete({
      where: {
        id: blogId,
      },
    });
    return formatResponse(blogDoc, "Blog deleted successfully", 200);
  } catch (error) {
    // console.error(error, "from error"); // Log the error for debugging

    return routeErrorHandler(error);
  }
}
