"use client";

import { frontendErrorResponse } from "@/lib/frontend-response-toast";
import { Blog, Project, ProjectCategory } from "@prisma/client";
import { useEffect, useState } from "react";
import HeroSection from "./hero-section";
import ProjectsSection from "./projects-section";
import ServiceSection from "./service-section";

const HomeClientComponent = ({
  allProjectCategory,
}: {
  allProjectCategory: ProjectCategory[];
}) => {
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(false);
  const [blogLists, setBlogLists] = useState<Blog[]>([]);
  const [projectLists, setProjectLists] = useState<Project[]>([]);
  const [projectCategoryName, setProjectCategoryName] = useState("All");
  const [blogCategoryName, setBlogCategoryName] = useState("All");

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoadingProjects(true);
      try {
        const projectResponse = await fetch(
          `/api/projects?limit=8${
            projectCategoryName === "All"
              ? ""
              : `&projectCategoryName=${projectCategoryName}`
          }`,
        ).then((res) => res.json());

        if (!projectResponse.success) {
          return frontendErrorResponse({
            message: projectResponse.message || "Unknown error",
          });
        }
        setProjectLists(projectResponse?.data?.result || []);
      } catch (error) {
        frontendErrorResponse({ message: "Something went wrong" });
      } finally {
        setIsLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [projectCategoryName]); // Dependencies trigger re-fetching projects when category changes.

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoadingBlogs(true);
      try {
        const blogResponse = await fetch(
          `/api/blogs?limit=8${
            projectCategoryName === "All"
              ? ""
              : `&blogCategoryName=${blogCategoryName}`
          }`,
        ).then((res) => res.json());

        if (!blogResponse.success) {
          return frontendErrorResponse({
            message: blogResponse.message || "Unknown error",
          });
        }
        setBlogLists(blogResponse?.data?.result || []);
      } catch (error) {
        frontendErrorResponse({ message: "Something went wrong" });
      } finally {
        setIsLoadingBlogs(false);
      }
    };

    fetchBlogs();
  }, []); // Only run on component mount for blogs.

  return (
    <>
      {" "}
      {/* hero section */}
      <HeroSection />
      {/* Services */}
      <ServiceSection />
      {/* Projects */}
      <ProjectsSection
        projectLists={projectLists}
        isLoading={isLoadingProjects}
        allProjectCategory={allProjectCategory}
        setProjectCategoryName={setProjectCategoryName}
        projectCategoryName={projectCategoryName}
      />
      {/* Experience study */}
      <section className="exstudy"></section>
      {/* My Skills */}
      <section className="myskills"></section>
      {/* Recent Blogs */}
      <section className="recentblogs"></section>
    </>
  );
};

export default HomeClientComponent;
