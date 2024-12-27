import { routeErrorHandler } from "@/lib/api-error-handler";
import { formatResponse } from "@/lib/api-response";
import { db } from "@/lib/db";
import { blogPOSTSchema } from "@/lib/validations/blogValidation";
import {
  generateSearchFilter,
  paginationSearchForBlogSchema,
} from "@/lib/validations/pagination-search-zod";
import { BlogStatus, Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await blogPOSTSchema.parseAsync(body);
    const { blogCategory, ...othersData } = data;
    const blogDoc = await db.blog.create({ data: { ...othersData } });

    // Check for invalid or duplicate tags
    const validTags = await db.blogCategory.findMany({
      where: { id: { in: blogCategory } },
      select: { id: true },
    });
    const validTagIds = validTags.map((tag) => tag.id);
    await db.blogCategoryRelation.createMany({
      data: validTagIds.map((tagId) => ({
        blogId: blogDoc.id,
        blogCategoryId: tagId,
      })),
    });
    return formatResponse(blogDoc, "Operation completed successfully", 200);
  } catch (error) {
    console.error(error, "from error"); // Log the error for debugging

    return routeErrorHandler(error);
  }
}
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = Object.fromEntries(url.searchParams.entries());
    const paramsData = paginationSearchForBlogSchema.parse(searchParams);
    const { limit, page, q, status } = paramsData;

    const skip = (page - 1) * limit;
    const blogsFieldsToSearch = ["description", "slug", "title"] as Array<
      keyof Prisma.BlogWhereInput
    >;
    const blogSearchFilter = generateSearchFilter<Prisma.BlogWhereInput>(
      blogsFieldsToSearch,
      q
    );
    const whereProps = {
      OR: blogSearchFilter,
      status: status as BlogStatus,
    };
    // Retrieve the list of feature requests from the database based on search and pagination
    const notifications = await db.blog.findMany({
      where: whereProps,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Count the total number of records that match the query
    const total = await db.blog.count({
      where: whereProps,
    });

    // Calculate total pages
    const totalPage = Math.ceil(total / limit);
    return formatResponse(
      {
        meta: {
          page,
          limit,
          total,
          totalPage,
        },

        result: notifications,
      },
      "Successful",
      200
    );
  } catch (error) {
    return routeErrorHandler(error);
  }
}
