import SingleBlogEditClientComponent from "@/components/Blogs/singleBlogEditClientComponent";
import config from "@/lib/config";
import { db } from "@/lib/db";
import { frontendErrorResponse } from "@/lib/frontend-response-toast";
import { SingleBlogPageProps } from "@/types/server-page";
import { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";
import React from "react";
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
      : singleBlogDetails.title,
  };
}
const SingleBlogEdit = async (
  { params }: SingleBlogPageProps,
  parent: ResolvingMetadata
) => {
  const { id } = await params;
  const singleBlogDetails = await db.blog.findUnique({
    where: {
      id,
    },
  });
  if (!singleBlogDetails?.id) {
    frontendErrorResponse({ message: `Blog not found` });
    return redirect("/");
  }
  return (
    <SingleBlogEditClientComponent singleBlogDetails={singleBlogDetails} />
  );
};

export default SingleBlogEdit;
