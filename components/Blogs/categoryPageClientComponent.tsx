import React, { useEffect, useState } from "react";
import BreadcrumbWithAdminPanel from "../breadcrumb-with-admin-panel";
import Dataloading from "../Dataloading";
import Link from "next/link";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { BlogCategory } from "@prisma/client";
import axios from "axios";
import { frontendErrorResponse } from "@/lib/frontend-response-toast";

const CategoryPageClientComponent = () => {
  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(2);

  const [searchQuery, setSearchQuery] = useState(``);
  const [totalPage, setTotalPage] = useState(1);
  const [allData, setAllData] = useState<BlogCategory[]>([]);
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
          `/api/blogs?q=${searchQuery}&page=${currentPage}&limit=${perPage}`
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
  return (
    <div className="blogpage">
      <BreadcrumbWithAdminPanel
        h2Title=" All Published "
        spanTitleOne={`Blogs`}
        spanTitleTwo="Blogs"
      />
      <div className="blogstable">
        <div className="flex gap-2 mb-1">
          <h2>Search Blogs:</h2>
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
              allData.map((blog, index) => (
                <tr key={blog?.id}>
                  {/* <td>{0 + index + 1}</td>
                  <td>
                    <img src={blog.images[0]} width={180} alt="image" />
                  </td>
                  <td>
                    <h3>{blog.title}</h3>
                  </td>
                  <td>
                    <div className="flex gap-2 flex-center">
                      <Link href={`/blogs/edit/${blog.id}`}>
                        <button>
                          <FaEdit />
                        </button>
                      </Link>
                      <Link href={`/blogs/delete/${blog.id}`}>
                        <button>
                          <RiDeleteBin6Fill />
                        </button>
                      </Link>
                    </div>
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryPageClientComponent;
