"use client";
import { frontendErrorResponse } from "@/lib/frontend-response-toast";
import { Contact, Project } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import BreadcrumbWithAdminPanel from "../breadcrumb-with-admin-panel";
import Dataloading from "../Dataloading";

const ContactsClientComponent = () => {
  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  //search
  const [searchQuery, setSearchQuery] = useState(``);
  const [totalPage, setTotalPage] = useState(1);
  const [allData, setAllData] = useState<
    (Contact & {
      project: Project;
    })[]
  >([]);
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
      try {
        const res = await axios.get(
          `/api/contact?q=${searchQuery}&page=${currentPage}&limit=${perPage}`,
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
        spanTitleOne={`Contacts`}
        spanTitleTwo="Contacts"
      />
      <div className="blogstable">
        <div className="mb-1 flex gap-2">
          <h2>Search Contacts:</h2>
          <input
            type="text"
            value={searchQuery}
            placeholder="Search by title"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <table className="table-styling table">
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Email</th>
              <th>Phone no</th>
              <th>Project</th>
              <th>Open Contact</th>
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
                <td colSpan={6} className="text-center">
                  No Contact Found
                </td>
              </tr>
            ) : (
              allData.map((contact, index) => (
                <tr key={contact?.id}>
                  <td>{indexOfFirstBlog + index + 1}</td>
                  <td>
                    {" "}
                    <h3>{contact.name}</h3>{" "}
                  </td>
                  <td>
                    {" "}
                    <h3>{contact.email}</h3>{" "}
                  </td>
                  <td>
                    {" "}
                    <h3>{contact.phone}</h3>{" "}
                  </td>
                  <td>
                    {" "}
                    <h3>{contact.project?.title}</h3>{" "}
                  </td>
                  <td>
                    <div className="flex-center flex gap-2">
                      <Link href={`/dashboard/blogs/edit/${contact.id}`}>
                        <button>
                          <FaEdit />
                        </button>
                      </Link>
                      <Link href={`/dashboard/blogs/delete/${contact.id}`}>
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

export default ContactsClientComponent;
