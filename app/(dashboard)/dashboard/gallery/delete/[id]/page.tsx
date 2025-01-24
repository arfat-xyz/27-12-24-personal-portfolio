import DeleteSingleGalleryClientComponent from "@/components/gallery/deleteSingleGalleryClientComponent";
import config from "@/lib/config";
import { db } from "@/lib/db";
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
    select: {
      title: true,
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
      : `Delete ${singleGalleryDetails.title}`,
  };
}
export default async function DeleteProduct(
  { params }: SingleProjectPageProps,
  parent: ResolvingMetadata,
) {
  const { id } = await params;
  const singlePhotoDetails = await db.photo.findUnique({
    where: {
      id,
    },
  });
  if (!singlePhotoDetails?.id) redirect(`/photo`);
  return (
    <>
      <DeleteSingleGalleryClientComponent gallery={singlePhotoDetails} />
    </>
  );
}
