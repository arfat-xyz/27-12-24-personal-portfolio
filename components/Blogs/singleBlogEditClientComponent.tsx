"use client";
import { IdProps } from "@/types/server-page";
import { Blog as PrismaBlog } from "@prisma/client";
import React from "react";
import { SiBloglovin } from "react-icons/si";
import BreadcrumbWithAdminPanel from "../breadcrumb-with-admin-panel";
import Blog from "../Blog";

const SingleBlogEditClientComponent = ({
  singleBlogDetails,
}: {
  singleBlogDetails: PrismaBlog;
}) => {
  console.log({ singleBlogDetails });
  return (
    <div className="blogpage">
      <BreadcrumbWithAdminPanel
        h2Title="Edit"
        spanTitleOne={singleBlogDetails.title}
        spanTitleTwo="Edit Blog"
      />
      <div className="mt-3">{<Blog blog={singleBlogDetails} />}</div>
    </div>
  );
};

export default SingleBlogEditClientComponent;
