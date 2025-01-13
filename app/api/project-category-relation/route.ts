/**
 * ToDO: Not updated yet for project
 */

import { routeErrorHandler } from "@/lib/api-error-handler";
import { formatErrorResponse, formatResponse } from "@/lib/api-response";
import { db } from "@/lib/db";
import { stringValidation } from "@/lib/validations/combine-validation";
import { z } from "zod";

// Schema validation for array of blogTagIds
const blogTagRelationPOSTSchema = z.object({
  blogId: stringValidation("Blog id"),
  blogCategoryIds: z.array(stringValidation("Blog tag id"), {
    invalid_type_error: "Blog Tag Ids must be an array",
    required_error: "Blog Tag Ids are required",
  }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { blogId, blogCategoryIds } = blogTagRelationPOSTSchema.parse(body);

    // Check if the blog exists
    const blogIdExist = await db.blog.count({
      where: { id: blogId },
    });
    if (!blogIdExist) {
      return formatErrorResponse("Blog not found", 404);
    }

    // Check for invalid or duplicate tags
    const validTags = await db.blogCategory.findMany({
      where: { id: { in: blogCategoryIds } },
      select: { id: true },
    });
    const validTagIds = validTags.map((tag) => tag.id);

    if (validTagIds.length !== blogCategoryIds.length) {
      return formatErrorResponse("One or more tags are invalid", 400);
    }

    // Filter out existing relations to avoid duplicates
    const existingRelations = await db.blogCategoryRelation.findMany({
      where: { blogId, blogCategoryId: { in: validTagIds } },
      select: { blogCategoryId: true },
    });
    const existingTagIds = existingRelations.map((rel) => rel.blogCategoryId);
    const newTagIds = validTagIds.filter((id) => !existingTagIds.includes(id));

    if (newTagIds.length === 0) {
      return formatErrorResponse(
        "All selected tags are already linked to the blog",
        400
      );
    }

    // Create new relations in bulk
    const blogTagRelations = await db.blogCategoryRelation.createMany({
      data: newTagIds.map((tagId) => ({ blogId, blogCategoryId: tagId })),
    });

    return formatResponse(
      { createdCount: blogTagRelations.count, addedTags: newTagIds },
      "Operation completed successfully",
      201
    );
  } catch (error) {
    return routeErrorHandler(error);
  }
}

// export async function GET(req: Request) {
//   try {
//     const url = new URL(req.url);
//     const searchParams = Object.fromEntries(url.searchParams.entries());
//     const paramsData = paginationSearchSchema.parse(searchParams);
//     const { limit, page, q } = paramsData;

//     const skip = (page - 1) * limit;
//     const blogsFieldsToSearch = [] as Array<
//       keyof Prisma.BlogTagRelationWhereInput
//     >;
//     const blogSearchFilter = generateSearchFilter<Prisma.BlogWhereInput>(
//       blogsFieldsToSearch,
//       q
//     );
//     const whereProps = {
//       OR: blogSearchFilter,
//       status: status as BlogStatus,
//     };
//     // Retrieve the list of feature requests from the database based on search and pagination
//     const notifications = await db.blog.findMany({
//       where: whereProps,
//       skip,
//       take: limit,
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     // Count the total number of records that match the query
//     const total = await db.blog.count({
//       where: whereProps,
//     });

//     // Calculate total pages
//     const totalPage = Math.ceil(total / limit);
//     return formatResponse(
//       {
//         meta: {
//           page,
//           limit,
//           total,
//           totalPage,
//         },

//         result: notifications,
//       },
//       "Successful",
//       200
//     );
//   } catch (error) {
//     return routeErrorHandler(error);
//   }
// }
