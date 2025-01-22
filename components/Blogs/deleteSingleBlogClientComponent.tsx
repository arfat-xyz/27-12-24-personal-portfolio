"use client";
import config from "@/lib/config";
import { db } from "@/lib/db";
import {
  frontendErrorResponse,
  frontendSuccessResponse,
} from "@/lib/frontend-response-toast";
import { imageConfig } from "@/lib/image-config";
import { SingleProjectPageProps } from "@/types/server-page";
import { Blog } from "@prisma/client";
import axios from "axios";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BreadcrumbWithAdminPanel from "../breadcrumb-with-admin-panel";
export async function generateMetadata(
  { params }: SingleProjectPageProps,
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
const DeleteSingleBlogClientComponent = ({ blog }: { blog: Blog }) => {
  const router = useRouter();
  function goBack() {
    router.push("/dashboard/blogs");
  }

  async function deleteBlog() {
    const response = await axios.delete("/api/blogs/" + blog.id);
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
        spanTitleOne={blog?.title}
        spanTitleTwo="Delete Blog"
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
            <button onClick={deleteBlog} className="acceptButton">
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

export default DeleteSingleBlogClientComponent;
