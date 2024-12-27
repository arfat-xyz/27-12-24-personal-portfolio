import { routeErrorHandler } from "@/lib/api-error-handler";
import { formatResponse } from "@/lib/api-response";
import { deleteImages } from "@/lib/cloudinary";
import { z } from "zod";

const deleteImageSchema = z.object({
  link: z.string({
    invalid_type_error: "Link must be a string",
    required_error: "Link is required",
  }),
});
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await deleteImageSchema.parseAsync(body);
    await deleteImages([data.link]);
    return formatResponse({}, "Operation completed successfully", 200);
  } catch (error) {
    // console.error(error, "from error"); // Log the error for debugging

    return routeErrorHandler(error);
  }
}
