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
    const { limit, page, q, status, blogCategoryName } = paramsData;

    const skip = (page - 1) * limit;
    const blogFieldsToSearch = ["description", "slug", "title"] as Array<
      keyof Prisma.BlogWhereInput
    >;
    const blogSearchFilter = generateSearchFilter<Prisma.BlogWhereInput>(
      blogFieldsToSearch,
      q,
    );

    // Base where clause
    const whereProps: Prisma.BlogWhereInput = {
      OR: blogSearchFilter,
      status: status as BlogStatus,
    };

    // Add category filter if `blogCategoryName` is provided
    if (blogCategoryName) {
      whereProps.BlogTagRelation = {
        some: {
          blogCategory: {
            name: {
              equals: blogCategoryName,
              mode: "insensitive",
            },
          },
        },
      };
    }

    // Retrieve the list of blogs from the database based on filters
    const blogs = await db.blog.findMany({
      where: whereProps,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        BlogTagRelation: {
          include: {
            blogCategory: true,
          },
        },
      },
    });

    // Add a `category` field with all related category names for each blog
    const result = blogs.map((blog) => ({
      ...blog,
      categories: blog.BlogTagRelation.map((relation) => relation.blogCategory),
      BlogTagRelation: null,
    }));

    // Count the total number of matching records
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
        result,
      },
      "Successful",
      200,
    );
  } catch (error) {
    return routeErrorHandler(error);
  }
}
