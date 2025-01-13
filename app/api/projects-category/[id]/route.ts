import { db } from "@/lib/db";
import {
  categoryIdSchema,
  routeCateogoryContextSchema,
} from "@/lib/validations/id-context-schema";
import { formatErrorResponse, formatResponse } from "@/lib/api-response";
import { routeErrorHandler } from "@/lib/api-error-handler";
import { z } from "zod";
import { projectCategoryPOSTSchema } from "../route";

export async function PATCH(
  req: Request,
  { params }: z.infer<typeof routeCateogoryContextSchema>
) {
  try {
    const { id } = categoryIdSchema.parse(await params);
    const body = await req.json();
    const data = projectCategoryPOSTSchema.parse(body);
    const blogTagAlreadyExist = await db.projectCategory.count({
      where: {
        id,
      },
    });
    if (!blogTagAlreadyExist)
      return formatErrorResponse("Blog category does not exist", 404);

    const blogDoc = await db.projectCategory.update({
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
    await db.projectCategory.delete({
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
