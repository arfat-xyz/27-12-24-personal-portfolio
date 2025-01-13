"use client";
import { Project as PrismaPronect, ProjectCategory } from "@prisma/client";
import BreadcrumbWithAdminPanel from "../breadcrumb-with-admin-panel";
import Project from "../project";

const SingleProjectEditClientComponent = ({
  singleProjectDetails,
  category,
}: {
  singleProjectDetails: PrismaPronect & { projectCategoryIds: string[] };
  category: ProjectCategory[];
}) => {
  return (
    <div className="blogpage">
      <BreadcrumbWithAdminPanel
        h2Title="Edit"
        spanTitleOne={singleProjectDetails.title}
        spanTitleTwo="Edit Project"
      />
      <div className="mt-3">
        {<Project project={singleProjectDetails} category={category} />}
      </div>
    </div>
  );
};

export default SingleProjectEditClientComponent;
