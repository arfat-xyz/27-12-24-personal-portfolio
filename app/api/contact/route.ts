import { routeErrorHandler } from "@/lib/api-error-handler";
import { formatErrorResponse, formatResponse } from "@/lib/api-response";
import { db } from "@/lib/db";
import { contactPOSTSchema } from "@/lib/validations/contact-validation";
import {
  generateSearchFilter,
  paginationSearchSchema,
} from "@/lib/validations/pagination-search-zod";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await contactPOSTSchema.parseAsync(body);
    const projectIdExist = await db.project.count({
      where: { id: data?.projectId },
    });
    if (!projectIdExist)
      return formatErrorResponse("Project does not exist", 404);
    const { ...othersData } = data;
    const contactDoc = await db.contact.create({ data: { ...othersData } });
    return formatResponse(contactDoc, "Operation completed successfully", 200);
  } catch (error) {
    console.error(error, "from error"); // Log the error for debugging

    return routeErrorHandler(error);
  }
}
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = Object.fromEntries(url.searchParams.entries());
    const paramsData = paginationSearchSchema.parse(searchParams);
    const { limit, page, q } = paramsData;

    const skip = (page - 1) * limit;
    const contactFieldsToSearch = [
      "company",
      "name",
      "phone",
      "email",
    ] as Array<keyof Prisma.ContactWhereInput>;
    const contactSearchFilter = generateSearchFilter<Prisma.ContactWhereInput>(
      contactFieldsToSearch,
      q,
    );
    const whereProps = {
      OR: contactSearchFilter,
    };
    // Retrieve the list of feature requests from the database based on search and pagination
    const notifications = await db.contact.findMany({
      where: whereProps,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        project: true,
      },
    });

    // Count the total number of records that match the query
    const total = await db.contact.count({
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
      200,
    );
  } catch (error) {
    return routeErrorHandler(error);
  }
}
