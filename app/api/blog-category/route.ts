import { routeErrorHandler } from "@/lib/api-error-handler";
import { formatErrorResponse, formatResponse } from "@/lib/api-response";
import { db } from "@/lib/db";
import { stringValidation } from "@/lib/validations/combine-validation";
import { idSchema } from "@/lib/validations/id-context-schema";
import {
  generateSearchFilter,
  paginationSearchForBlogTagsSchema,
  paginationSearchSchema,
} from "@/lib/validations/pagination-search-zod";
import { Prisma } from "@prisma/client";
import { z } from "zod";

export const blogCategoryPOSTSchema = z.object({
  name: stringValidation("Name"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = blogCategoryPOSTSchema.parse(body);
    const blogTagAlreadyExist = await db.blogCategory.count({
      where: {
        name: data.name,
      },
    });
    if (blogTagAlreadyExist)
      return formatErrorResponse("Blog tag already exist", 409);
    const blogDoc = await db.blogCategory.create({ data: { ...data } });
    return formatResponse(blogDoc, "Operation completed successfully", 200);
  } catch (error) {
    return routeErrorHandler(error);
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = Object.fromEntries(url.searchParams.entries());
    const paramsData = paginationSearchForBlogTagsSchema.parse(searchParams);
    const { limit, page, q, name } = paramsData;

    const skip = (page - 1) * limit;
    const blogTagsFieldsToSearch = ["name"] as Array<
      keyof Prisma.BlogCategoryWhereInput
    >;
    const blogTagsSearchFilter =
      generateSearchFilter<Prisma.BlogCategoryWhereInput>(
        blogTagsFieldsToSearch,
        q
      );
    const whereProps = {
      OR: blogTagsSearchFilter,
      name: name,
    };
    // Retrieve the list of feature requests from the database based on search and pagination
    const notifications = await db.blogCategory.findMany({
      where: whereProps,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Count the total number of records that match the query
    const total = await db.blogCategory.count({
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
