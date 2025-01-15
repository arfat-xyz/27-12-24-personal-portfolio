import ProjectCategoryPageClientComponent from "@/components/projects/projectCategoryPageClientComponent";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Project Category",
  description: "",
};
const CategoryPage = () => {
  return <ProjectCategoryPageClientComponent />;
};

export default CategoryPage;
