"use client";
import { frontendErrorResponse } from "@/lib/frontend-response-toast";
import { Blog } from "@prisma/client";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import axios from "axios";
import { useEffect, useState } from "react";
import { SiBloglovin } from "react-icons/si";
import Dataloading from "../Dataloading";
import Link from "next/link";
import BreadcrumbWithAdminPanel from "../breadcrumb-with-admin-panel";

const ProjectDraftPageClientComponent = () => {
  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(2);

  //search
  const [searchQuery, setSearchQuery] = useState(``);
  const [totalPage, setTotalPage] = useState(1);
  const [allData, setAllData] = useState<Blog[]>([]);
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
          `/api/projects?q=${searchQuery}&page=${currentPage}&limit=${perPage}&status=Draft`
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
        h2Title="All Draft "
        spanTitleOne={`Blogs`}
        spanTitleTwo="Blogs"
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
            {isLoading && (
              <tr>
                <td>
                  <Dataloading />
                </td>
              </tr>
            )}

            {allData.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center">
                  No Blogs Found
                </td>
              </tr>
            ) : (
              allData.map((projects, index) => (
                <tr key={projects?.id}>
                  <td>{indexOfFirstBlog + index + 1}</td>
                  <td>
                    <img src={projects.images[0]} width={180} alt="image" />
                  </td>
                  <td>
                    <h3>{projects.title}</h3>
                  </td>
                  <td>
                    <div className="flex gap-2 flex-center">
                      <Link href={`/projects/edit/${projects.id}`}>
                        <button>
                          <FaEdit />
                        </button>
                      </Link>
                      <Link href={`/projects/delete/${projects.id}`}>
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

export default ProjectDraftPageClientComponent;