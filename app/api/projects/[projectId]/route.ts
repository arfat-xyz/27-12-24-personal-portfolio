import { routeErrorHandler } from "@/lib/api-error-handler";
import { formatErrorResponse, formatResponse } from "@/lib/api-response";
import { deleteImages } from "@/lib/cloudinary";
import { db } from "@/lib/db";
import {
  paramsProjectIdSchema,
  routeBlogContextSchema,
} from "@/lib/validations/id-context-schema";
import { projectPUTSchema } from "@/lib/validations/projectValidation";
import { z } from "zod";

export async function PUT(
  req: Request,
  { params }: z.infer<typeof routeBlogContextSchema>
) {
  try {
    // Ensure context.params is resolved, as it's a promise
    const { projectId } = paramsProjectIdSchema.parse(await params);

    const body = await req.json();
    const data = await projectPUTSchema.parseAsync(body);
    const existingBlog = await db.project.count({
      where: {
        id: projectId,
      },
    });
    if (!existingBlog) return formatErrorResponse("Blog not found", 404);
    const { projectCategory, ...others } = data;
    // Check for invalid or duplicate tags
    const validCategories = await db.projectCategory.findMany({
      where: { id: { in: projectCategory } },
      select: { id: true },
    });
    const validCatogoryIds = validCategories.map((tag) => tag.id);
    if (validCatogoryIds.length !== projectCategory?.length) {
      return formatErrorResponse("One or more categories are invalid", 400);
    }

    // Filter out existing relations to avoid duplicates
    const existingRelations = await db.projectCategoryRelation.findMany({
      where: { projectId },
      select: { projectCategoryId: true },
    });
    const existingCategoryIds = existingRelations.map(
      (rel) => rel.projectCategoryId
    );
    const newCategoryIds = validCatogoryIds.filter(
      (id) => !existingCategoryIds.includes(id)
    );
    if (newCategoryIds.length > 0) {
      // Create new relations in bulk
      await db.projectCategoryRelation.createMany({
        data: newCategoryIds.map((tagId) => ({
          projectId,
          projectCategoryId: tagId,
        })),
      });
    }

    const categoryIdsToDelete = existingCategoryIds.filter(
      (id) => !validCatogoryIds.includes(id)
    );

    if (categoryIdsToDelete.length > 0) {
      await db.projectCategoryRelation.deleteMany({
        where: {
          projectId,
          projectCategoryId: { in: categoryIdsToDelete },
        },
      });
    }

    const blogDoc = await db.project.update({
      where: {
        id: projectId,
      },
      data: others,
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
    const { projectId } = paramsProjectIdSchema.parse(await params);

    const existingProject = await db.project.findUnique({
      where: { id: projectId },
    });
    if (!existingProject?.id) return formatErrorResponse("Blog not found", 404);
    await deleteImages(existingProject.images);
    console.log(existingProject);
    const blogDoc = await db.project.delete({
      where: {
        id: projectId,
      },
    });
    return formatResponse(blogDoc, "Blog deleted successfully", 200);
  } catch (error) {
    // console.error(error, "from error"); // Log the error for debugging

    return routeErrorHandler(error);
  }
}
