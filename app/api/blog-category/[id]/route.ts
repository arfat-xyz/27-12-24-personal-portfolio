import { db } from "@/lib/db";
import { blogCategoryPOSTSchema } from "../route";
import {
  categoryIdSchema,
  idSchema,
  routeBlogContextSchema,
  routeCateogoryContextSchema,
} from "@/lib/validations/id-context-schema";
import { formatErrorResponse, formatResponse } from "@/lib/api-response";
import { routeErrorHandler } from "@/lib/api-error-handler";
import { z } from "zod";

export async function PATCH(
  req: Request,
  { params }: z.infer<typeof routeCateogoryContextSchema>
) {
  try {
    const { id } = categoryIdSchema.parse(await params);
    const body = await req.json();
    const data = blogCategoryPOSTSchema.parse(body);
    const blogTagAlreadyExist = await db.blogCategory.count({
      where: {
        id,
      },
    });
    if (!blogTagAlreadyExist)
      return formatErrorResponse("Blog category does not exist", 404);

    const blogDoc = await db.blogCategory.update({
      where: {
        id,
      },
      data: { name: data.name },
    });
    return formatResponse(blogDoc, "Operation completed successfully", 200);
  } catch (error) {
    return routeErrorHandler(error);
  }
}
export async function DELETE(
  req: Request,
  { params }: z.infer<typeof routeCateogoryContextSchema>
) {
  try {
    const { id } = categoryIdSchema.parse(await params);
    await db.blogCategory.delete({
      where: {
        id,
      },
    });
    return formatResponse(true, "Operation completed successfully", 200);
  } catch (error) {
    // console.error(error, "from error"); // Log the error for debugging

    return routeErrorHandler(error);
  }
}
