import { routeErrorHandler } from "@/lib/api-error-handler";
import { formatErrorResponse, formatResponse } from "@/lib/api-response";
import { db } from "@/lib/db";
import { contactPUTSchema } from "@/lib/validations/contact-validation";
import {
  idSchema,
  routeBlogContextSchema,
} from "@/lib/validations/id-context-schema";
import { z } from "zod";

export async function PUT(
  req: Request,
  { params }: z.infer<typeof routeBlogContextSchema>,
) {
  try {
    // Ensure context.params is resolved, as it's a promise
    const { id } = idSchema("Contact id").parse(await params);

    const body = await req.json();
    const data = await contactPUTSchema.parseAsync(body);
    const existingContact = await db.contact.count({
      where: {
        id,
      },
    });
    if (!existingContact) return formatErrorResponse("Contact not found", 404);

    const contactDoc = await db.contact.update({
      where: {
        id: id,
      },
      data,
    });
    return formatResponse(contactDoc, "Contact updated successfully", 200);
  } catch (error) {
    // console.error(error, "from error"); // Log the error for debugging

    return routeErrorHandler(error);
  }
}
export async function DELETE(
  _req: Request,
  { params }: z.infer<typeof routeBlogContextSchema>,
) {
  try {
    // Ensure context.params is resolved, as it's a promise
    const { id } = idSchema("Contact id").parse(await params);

    const existingBlog = await db.contact.findUnique({
      where: { id },
    });
    if (!existingBlog?.id) return formatErrorResponse("Contact not found", 404);

    const blogDoc = await db.contact.delete({
      where: {
        id,
      },
    });
    return formatResponse(blogDoc, "Contact deleted successfully", 200);
  } catch (error) {
    // console.error(error, "from error"); // Log the error for debugging

    return routeErrorHandler(error);
  }
}
