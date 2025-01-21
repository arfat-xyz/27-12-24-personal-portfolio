"use client";
import { Photo } from "@prisma/client";
import BreadcrumbWithAdminPanel from "../breadcrumb-with-admin-panel";
import Gallery from "../gallery";

const SingleGalleryEditClientComponent = ({
  singleGalleryDetails,
}: {
  singleGalleryDetails: Photo;
}) => {
  return (
    <div className="blogpage">
      <BreadcrumbWithAdminPanel
        h2Title="Edit"
        spanTitleOne={singleGalleryDetails.title}
        spanTitleTwo="Edit Gallery"
      />
      <div className="mt-3">{<Gallery gallery={singleGalleryDetails} />}</div>
    </div>
  );
};

export default SingleGalleryEditClientComponent;
