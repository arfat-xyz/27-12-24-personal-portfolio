"use client";
import {
  frontendErrorResponse,
  frontendSuccessResponse,
} from "@/lib/frontend-response-toast";
import { imageConfig } from "@/lib/image-config";
import { Project } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BreadcrumbWithAdminPanel from "../breadcrumb-with-admin-panel";

const DeleteSingleProjectClientComponent = ({ project }: { project: Project }) => {
  const router = useRouter();
  function goBack() {
    router.push("/projects");
  }

  async function deleteBlog() {
    const response = await axios.delete("/api/projects/" + project.id);
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
        spanTitleOne={project?.title}
        spanTitleTwo="Delete Project"
      />
      <div className="deletesec flex flex-center wh_100">
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

export default DeleteSingleProjectClientComponent;
