import { routeErrorHandler } from "@/lib/api-error-handler";
import { formatResponse } from "@/lib/api-response";
import { db } from "@/lib/db";
import {
  generateSearchFilter,
  paginationSearchForProjectSchema,
} from "@/lib/validations/pagination-search-zod";
import { projectPOSTSchema } from "@/lib/validations/projectValidation";
import { Prisma, ProjectStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await projectPOSTSchema.parseAsync(body);
    const { projectCategory, ...othersData } = data;
    const projectDoc = await db.project.create({ data: { ...othersData } });

    // Check for invalid or duplicate tags
    const validCategory = await db.projectCategory.findMany({
      where: { id: { in: projectCategory } },
      select: { id: true },
    });
    const validCategoryIds = validCategory.map((category) => category.id);
    await db.projectCategoryRelation.createMany({
      data: validCategoryIds.map((categoryId) => ({
        projectId: projectDoc.id,
        projectCategoryId: categoryId,
      })),
    });
    return formatResponse(projectDoc, "Operation completed successfully", 200);
  } catch (error) {
    console.error(error, "from error"); // Log the error for debugging

    return routeErrorHandler(error);
  }
}
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = Object.fromEntries(url.searchParams.entries());
    const paramsData = paginationSearchForProjectSchema.parse(searchParams);
    const { limit, page, q, status } = paramsData;

    const skip = (page - 1) * limit;
    const blogsFieldsToSearch = ["description", "slug", "title"] as Array<
      keyof Prisma.ProjectWhereInput
    >;
    const blogSearchFilter = generateSearchFilter<Prisma.ProjectWhereInput>(
      blogsFieldsToSearch,
      q
    );
    const whereProps = {
      OR: blogSearchFilter,
      status: status as ProjectStatus,
    };
    // Retrieve the list of feature requests from the database based on search and pagination
    const notifications = await db.project.findMany({
      where: whereProps,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Count the total number of records that match the query
    const total = await db.project.count({
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
