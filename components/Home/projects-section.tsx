"use client";
import { Project, ProjectCategory } from "@prisma/client";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { GoArrowUpRight } from "react-icons/go";
import Spinner from "../spinner";

const ProjectsSection = ({
  projectLists,
  isLoading,
  allProjectCategory,
  setProjectCategoryName,
  projectCategoryName,
}: {
  projectLists: Project[];
  isLoading: boolean;
  allProjectCategory: ProjectCategory[];
  setProjectCategoryName: Dispatch<SetStateAction<string>>;
  projectCategoryName: string;
}) => {
  return (
    <section className="projects">
      <div className="container">
        <div className="project_titles">
          <h2>My Recent Works</h2>
          <p>
            We put your ideas and thus your wishes in the form of a unique web
            project that inspires you and your customers
          </p>
        </div>
        <div className="project_buttons">
          <button
            className={projectCategoryName === "All" ? "active" : ""}
            onClick={() => setProjectCategoryName("All")}
          >
            All
          </button>
          {allProjectCategory.map(({ name }, i) => (
            <button
              className={projectCategoryName === name ? "active" : ""}
              onClick={() => setProjectCategoryName(name)}
              key={i}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="projects_cards">
          {isLoading ? (
            <div className="flex-center wh_50 flex">
              <Spinner />
            </div>
          ) : (
            <>
              {projectLists.length === 0 ? (
                <>
                  <h1 className="w-100 flex-center mt-3 flex text-3xl">
                    No Project Found
                  </h1>
                </>
              ) : (
                projectLists.map((project, i) => (
                  <Link key={project.id} className="procard" href="/">
                    <div className="proimgbox">
                      <img src={project.images[0]} alt={project.title} />
                    </div>
                    <div className="procontentbox">
                      <h2>{project.title}</h2>
                      <GoArrowUpRight />
                    </div>
                  </Link>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
