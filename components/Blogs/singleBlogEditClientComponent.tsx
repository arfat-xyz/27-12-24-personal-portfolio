"use client";
import { IdProps } from "@/types/server-page";
import { BlogCategory, Blog as PrismaBlog } from "@prisma/client";
import React from "react";
import { SiBloglovin } from "react-icons/si";
import BreadcrumbWithAdminPanel from "../breadcrumb-with-admin-panel";
import Blog from "../Blog";

const SingleBlogEditClientComponent = ({
  singleBlogDetails,
  category,
}: {
  singleBlogDetails: PrismaBlog & { blogCategoryIds: string[] };
  category: BlogCategory[];
}) => {
  return (
    <div className="blogpage">
      <BreadcrumbWithAdminPanel
        h2Title="Edit"
        spanTitleOne={singleBlogDetails.title}
        spanTitleTwo="Edit Blog"
      />
      <div className="mt-3">
        {<Blog blog={singleBlogDetails} category={category} />}
      </div>
    </div>
  );
};

export default SingleBlogEditClientComponent;
