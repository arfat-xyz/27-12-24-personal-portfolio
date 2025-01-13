import SingleProjectEditClientComponent from "@/components/projects/singleProjectEditClientComponent";
import config from "@/lib/config";
import { db } from "@/lib/db";
import { frontendErrorResponse } from "@/lib/frontend-response-toast";
import { SingleProjectPageProps } from "@/types/server-page";
import { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";
export async function generateMetadata(
  { params }: SingleProjectPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const singleProjectDetails = await db.project.findUnique({
    where: {
      id,
    },
  });

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: !singleProjectDetails
      ? config.metadataDefaultTitle
      : singleProjectDetails.title,
    openGraph: {
      images: [config.metadataDefaultImageLink, ...previousImages],
    },
    description: !singleProjectDetails
      ? config.metadataDefaultDescription
      : singleProjectDetails.title,
  };
}
const SingleBlogEdit = async (
  { params }: SingleProjectPageProps,
  parent: ResolvingMetadata
) => {
  const { id } = await params;
  const singleProjectDetails = await db.project.findUnique({
    where: {
      id,
    },
    include: {
      ProjectCategoryRelation: {
        where: {
          projectId: id,
        },
        include: {
          projectCategory: true,
        },
      },
    },
  });

  if (!singleProjectDetails?.id) {
    frontendErrorResponse({ message: `Blog not found` });
    return redirect("/");
  }
  const projectCategoryIds =
    singleProjectDetails?.ProjectCategoryRelation?.map(
      (relation) => relation.projectCategoryId
    ) ?? [];

  const category = await db.projectCategory.findMany({});
  return (
    <SingleProjectEditClientComponent
      singleProjectDetails={{
        projectCategoryIds,
        ...singleProjectDetails,
      }}
      category={category}
    />
  );
};

export default SingleBlogEdit;
