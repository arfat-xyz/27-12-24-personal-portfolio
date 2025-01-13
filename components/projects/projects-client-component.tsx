"use client";
import { frontendErrorResponse } from "@/lib/frontend-response-toast";
import { Project } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import BreadcrumbWithAdminPanel from "../breadcrumb-with-admin-panel";
import Dataloading from "../Dataloading";

const ProjectsClientComponent = () => {
  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  //search
  const [searchQuery, setSearchQuery] = useState(``);
  const [totalPage, setTotalPage] = useState(1);
  const [allData, setAllData] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(false);
  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const fetchAllData = async () => {
      console.log({ hasdf: "asdf" });
      try {
        const res = await axios.get(
          `/api/projects?q=${searchQuery}&page=${currentPage}&limit=${perPage}`
        );
        const returnData = res?.data?.data;
        setAllData(returnData.result);
        setTotalPage(returnData?.meta?.totalPage);
        setIsLoading(false);
      } catch (error) {
        console.error({ error });
        return frontendErrorResponse({ message: "Something went wrong" });
      }
    };
    fetchAllData();
  }, [searchQuery, currentPage]);

  console.log({ allData, totalPage });
  // function to handle page change
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // total number of blogs
  const allblog = allData.length;

  // calculate index of the first blog displayed on the current page
  const indexOfFirstBlog = (currentPage - 1) * perPage;
  const indexOfLastBlog = currentPage * perPage;
  return (
    <div className="blogpage">
      <BreadcrumbWithAdminPanel
        h2Title=" All Published "
        spanTitleOne={`Projects`}
        spanTitleTwo="Projects"
      />
      <div className="blogstable">
        <div className="flex gap-2 mb-1">
          <h2>Search Projects:</h2>
          <input
            type="text"
            value={searchQuery}
            placeholder="Search by title"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <table className="table table-styling">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Title</th>
              <th>Edit / Delete</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td>
                  <Dataloading />
                </td>
              </tr>
            ) : (
              <></>
            )}
            {allData.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center">
                  No Blogs Found
                </td>
              </tr>
            ) : (
              allData.map((project, index) => (
                <tr key={project?.id}>
                  <td>{indexOfFirstBlog + index + 1}</td>
                  <td>
                    <img src={project.images[0]} width={180} alt="image" />
                  </td>
                  <td>
                    <h3>{project.title}</h3>
                  </td>
                  <td>
                    <div className="flex gap-2 flex-center">
                      <Link href={`/projects/edit/${project.id}`}>
                        <button>
                          <FaEdit />
                        </button>
                      </Link>
                      <Link href={`/projects/delete/${project.id}`}>
                        <button>
                          <RiDeleteBin6Fill />
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectsClientComponent;
