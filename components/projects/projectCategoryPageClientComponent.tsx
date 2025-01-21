"use client";
import {
  frontendErrorResponse,
  frontendSuccessResponse,
} from "@/lib/frontend-response-toast";
import { BlogCategory } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import { RiDeleteBin6Fill } from "react-icons/ri";
import BreadcrumbWithAdminPanel from "../breadcrumb-with-admin-panel";
import Dataloading from "../Dataloading";
import DeleteModalComponent from "../delete-modal-component";
import ProjectCategoryAddAndEditComponent from "./project-category-add-and-edit-component";

const ProjectCategoryPageClientComponent = () => {
  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  const [searchQuery, setSearchQuery] = useState(``);
  const [totalPage, setTotalPage] = useState(1);
  const [allData, setAllData] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(false);
  const [reloadData, setReloadData] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      setIsLoading(false);
      return;
    }

    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `/api/projects-category?q=${searchQuery}&page=${currentPage}&limit=${perPage}`,
        );
        const returnData = res?.data?.data;
        setAllData(returnData.result);
        setTotalPage(returnData?.meta?.totalPage);
        setIsLoading(false);
      } catch (error) {
        console.error({ error });
        return frontendErrorResponse({ message: "Something went wrong" });
      } finally {
        setIsLoading(false);
        setReloadData(false);
      }
    };
    fetchAllData();
  }, [searchQuery, currentPage, reloadData]);

  const handleDeleteFunc = async (id: string) => {
    await axios
      .delete(`/api/projects-category/${id}`)
      .then((res) => {
        frontendSuccessResponse({ message: res?.data?.message });
        setIsDeleteModalOpen(false); // Close the modal after submission
        setReloadData(true);
      })
      .catch((e) =>
        frontendErrorResponse({ message: e?.response?.data?.message }),
      );
  };
  console.log({ allData, currentPage, totalPage });
  return (
    <div className="blogpage">
      <BreadcrumbWithAdminPanel
        h2Title=" All Published "
        spanTitleOne={`Projects`}
        spanTitleTwo="Projects"
      />
      <div className="blogstable">
        <div className="flex justify-between">
          <div className="mb-1 flex gap-2">
            <h2>Search Projects:</h2>
            <input
              type="text"
              value={searchQuery}
              placeholder="Search by title"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="">
            <ProjectCategoryAddAndEditComponent setReloadData={setReloadData} />
          </div>
        </div>
        <table className="table-styling table">
          <thead>
            <tr>
              <th>#</th>
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
              allData.map((category, index) => (
                <tr key={category?.id}>
                  <td>{0 + index + 1}</td>
                  <td>
                    <h3>{category.name}</h3>
                  </td>
                  <td>
                    <div className="flex-center flex gap-2">
                      <ProjectCategoryAddAndEditComponent
                        category={category}
                        setReloadData={setReloadData}
                      />
                      {/* <Link href={`/blogs/delete/${category.id}`}>
                        <button>
                          <RiDeleteBin6Fill />
                        </button>
                      </Link> */}
                      <DeleteModalComponent
                        buttontext={<RiDeleteBin6Fill />}
                        isOpen={isDeleteModalOpen}
                        setIsOpen={setIsDeleteModalOpen}
                        modalHeading="Delete cannot be undone"
                        onClickFunc={() => handleDeleteFunc(category?.id)}
                      />
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

export default ProjectCategoryPageClientComponent;
