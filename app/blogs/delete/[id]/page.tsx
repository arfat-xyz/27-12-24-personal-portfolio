import DeleteSingleBlogClientComponent from "@/components/Blogs/deleteSingleBlogClientComponent";
import config from "@/lib/config";
import { db } from "@/lib/db";
import { SingleBlogPageProps } from "@/types/server-page";
import { Metadata, ResolvingMetadata } from "next";
export async function generateMetadata(
  { params }: SingleBlogPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const singleBlogDetails = await db.blog.findUnique({
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
  { params }: SingleBlogPageProps,
  parent: ResolvingMetadata
) {
  const singleBlogDetails = await db.blog.findUnique({
    where: {
      id: params.id,
    },
  });
  return (
    <>
      <DeleteSingleBlogClientComponent blog={singleBlogDetails} />
    </>
  );
}
