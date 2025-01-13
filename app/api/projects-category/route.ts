import { routeErrorHandler } from "@/lib/api-error-handler";
import { formatErrorResponse, formatResponse } from "@/lib/api-response";
import { db } from "@/lib/db";
import { stringValidation } from "@/lib/validations/combine-validation";
import {
  generateSearchFilter,
  paginationSearchForBlogTagsSchema,
} from "@/lib/validations/pagination-search-zod";
import { Prisma } from "@prisma/client";
import { z } from "zod";

export const projectCategoryPOSTSchema = z.object({
  name: stringValidation("Name"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = projectCategoryPOSTSchema.parse(body);
    const projectTagAlreadyExist = await db.projectCategory.count({
      where: {
        ...data,
      },
    });
    if (projectTagAlreadyExist)
      return formatErrorResponse("Project tag already exist", 409);
    const projectDoc = await db.projectCategory.create({ data: { ...data } });
    return formatResponse(projectDoc, "Operation completed successfully", 200);
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
      keyof Prisma.ProjectCategoryWhereInput
    >;
    const blogTagsSearchFilter =
      generateSearchFilter<Prisma.ProjectCategoryWhereInput>(
        blogTagsFieldsToSearch,
        q
      );
    const whereProps = {
      OR: blogTagsSearchFilter,
      name: name,
    };
    // Retrieve the list of feature requests from the database based on search and pagination
    const blogCategories = await db.projectCategory.findMany({
      where: whereProps,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Count the total number of records that match the query
    const total = await db.projectCategory.count({
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

        result: blogCategories,
      },
      "Successful",
      200
    );
  } catch (error) {
    return routeErrorHandler(error);
  }
}
