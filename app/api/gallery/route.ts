import { routeErrorHandler } from "@/lib/api-error-handler";
import { formatResponse } from "@/lib/api-response";
import { db } from "@/lib/db";
import { galleryPOSTSchema } from "@/lib/validations/galleryValidation";
import {
  generateSearchFilter,
  paginationSearchSchema,
} from "@/lib/validations/pagination-search-zod";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await galleryPOSTSchema.parseAsync(body);
    const { ...othersData } = data;
    const galleryDoc = await db.photo.create({ data: { ...othersData } });
    return formatResponse(galleryDoc, "Operation completed successfully", 200);
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
    const galleryFieldsToSearch = ["slug", "title"] as Array<
      keyof Prisma.PhotoWhereInput
    >;
    const gallerySearchFilter = generateSearchFilter<Prisma.PhotoWhereInput>(
      galleryFieldsToSearch,
      q
    );
    const whereProps = {
      OR: gallerySearchFilter,
    };
    // Retrieve the list of feature requests from the database based on search and pagination
    const notifications = await db.photo.findMany({
      where: whereProps,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Count the total number of records that match the query
    const total = await db.photo.count({
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
