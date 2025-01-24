import SingleGalleryEditClientComponent from "@/components/gallery/singleGalleryEditClientComponent";
import config from "@/lib/config";
import { db } from "@/lib/db";
import { frontendErrorResponse } from "@/lib/frontend-response-toast";
import { SingleProjectPageProps } from "@/types/server-page";
import { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";
export async function generateMetadata(
  { params }: SingleProjectPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = await params;
  const singleGalleryDetails = await db.photo.findUnique({
    where: {
      id,
    },
  });

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: !singleGalleryDetails
      ? config.metadataDefaultTitle
      : singleGalleryDetails.title,
    openGraph: {
      images: [config.metadataDefaultImageLink, ...previousImages],
    },
    description: !singleGalleryDetails
      ? config.metadataDefaultDescription
      : singleGalleryDetails.title,
  };
}
const SignleGalleryEdit = async (
  { params }: SingleProjectPageProps,
  parent: ResolvingMetadata,
) => {
  const { id } = await params;
  const singleGalleryDetails = await db.photo.findUnique({
    where: {
      id,
    },
  });

  if (!singleGalleryDetails?.id) {
    frontendErrorResponse({ message: `Blog not found` });
    return redirect("/");
  }

  return (
    <SingleGalleryEditClientComponent
      singleGalleryDetails={singleGalleryDetails}
    />
  );
};

export default SignleGalleryEdit;
