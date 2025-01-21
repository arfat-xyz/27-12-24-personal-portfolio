"use client";
import config from "@/lib/config";
import { db } from "@/lib/db";
import {
  frontendErrorResponse,
  frontendSuccessResponse,
} from "@/lib/frontend-response-toast";
import { imageConfig } from "@/lib/image-config";
import { SingleProjectPageProps } from "@/types/server-page";
import { Photo } from "@prisma/client";
import axios from "axios";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BreadcrumbWithAdminPanel from "../breadcrumb-with-admin-panel";
export async function generateMetadata(
  { params }: SingleProjectPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const singleGalleryDetails = await db.photo.findUnique({
    where: {
      id: params.id,
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
      : singleGalleryDetails.title,
  };
}
const DeleteSingleGalleryClientComponent = ({
  gallery,
}: {
  gallery: Photo;
}) => {
  const router = useRouter();
  function goBack() {
    router.push("/gallery");
  }

  async function deleteGallery() {
    const response = await axios.delete("/api/gallery/" + gallery.id);
    console.log(response);
    if (!response?.data.success)
      return frontendErrorResponse({ message: response?.data?.message });
    frontendSuccessResponse({ message: "Deleted successfully" });
    goBack();
  }
  return (
    <div className="blogpage">
      <BreadcrumbWithAdminPanel
        h2Title="Delete"
        spanTitleOne={gallery?.title}
        spanTitleTwo="Delete Gallery"
      />
      <div className="deletesec flex-center wh_100 flex">
        <div className="deletecard">
          <Image
            width={100}
            height={100}
            alt="Arfat Delete Gif"
            src={imageConfig.deleteGif}
          />
          <p className="cookieHeading">Are you sure?</p>
          <p className="cookieDescription">
            If you delete this website content it will be permement delete your
            content.
          </p>
          <div className="buttonContainer">
            <button onClick={deleteGallery} className="acceptButton">
              Delete
            </button>
            <button className="declineButton" onClick={goBack}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteSingleGalleryClientComponent;
