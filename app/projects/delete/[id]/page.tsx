import DeleteSingleProjectClientComponent from "@/components/projects/deleteSingleProjectClientComponent";
import config from "@/lib/config";
import { db } from "@/lib/db";
import { SingleProjectPageProps } from "@/types/server-page";
import { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";
export async function generateMetadata(
  { params }: SingleProjectPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const singleBlogDetails = await db.project.findUnique({
    where: {
      id: params.id,
    },
    select: {
      title: true,
      description: true,
    },
  });

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: !singleBlogDetails
      ? config.metadataDefaultTitle
      : singleBlogDetails.title,
    openGraph: {
      images: [config.metadataDefaultImageLink, ...previousImages],
    },
    description: !singleBlogDetails
      ? config.metadataDefaultDescription
      : `Delete ${singleBlogDetails.title}`,
  };
}
export default async function DeleteProduct(
  { params }: SingleProjectPageProps,
  parent: ResolvingMetadata
) {
  const singleProjectDetails = await db.project.findUnique({
    where: {
      id: params.id,
    },
  });
  if (!singleProjectDetails?.id) redirect(`/projects`);
  return (
    <>
      <DeleteSingleProjectClientComponent project={singleProjectDetails} />
    </>
  );
}
