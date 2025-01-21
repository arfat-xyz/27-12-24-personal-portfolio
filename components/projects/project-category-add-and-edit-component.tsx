"use client";

import { blogCategoryPOSTSchema } from "@/app/api/blog-category/route";
import {
  frontendErrorResponse,
  frontendSuccessResponse,
} from "@/lib/frontend-response-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { BlogCategory } from "@prisma/client";
import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEdit } from "react-icons/fa";
import { GrAddCircle } from "react-icons/gr";
import { z } from "zod";
import AnyModalComponent from "../any-modal-component";

type BlogCategoryFromData = z.infer<typeof blogCategoryPOSTSchema>;
const ProjectCategoryAddAndEditComponent = ({
  category,
  setReloadData,
}: {
  category?: BlogCategory;
  setReloadData: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BlogCategoryFromData>({
    resolver: zodResolver(blogCategoryPOSTSchema),
    defaultValues: {
      name: category?.name ?? "",
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = async (data: BlogCategoryFromData) => {
    try {
      if (category?.id) {
        await axios
          .patch(`/api/projects-category/${category.id}`, { ...data })
          .then((res) => {
            frontendSuccessResponse({ message: res?.data?.message });
            setIsOpen(false); // Close the modal after submission
            setReloadData(true);
            reset();
          })
          .catch((e) =>
            frontendErrorResponse({ message: e?.response?.data?.message }),
          );
      } else {
        await axios
          .post(`/api/projects-category`, { ...data })
          .then((res) => {
            frontendSuccessResponse({ message: res?.data?.message });
            setReloadData(true);
            setIsOpen(false); // Close the modal after submission
            reset();
          })
          .catch((e) =>
            frontendErrorResponse({ message: e?.response?.data?.message }),
          );
      }
    } catch (error) {
      frontendErrorResponse({ message: "Something went wrong" });
    }
  };

  return (
    <AnyModalComponent
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      buttontext={
        category?.id ? (
          <FaEdit />
        ) : (
          <GrAddCircle className="size-5 transition-all duration-300 hover:rotate-90" />
        )
      }
      insideComponent={
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col px-3"
        >
          <input
            type="text"
            id="name"
            placeholder="Enter name"
            {...register("name")}
          />
          {errors.name && (
            <span className="text-sm text-red-500">{errors.name.message}</span>
          )}
          <div className="mt-1 flex w-full justify-end">
            <button type="submit" className="h-8 rounded-md text-sm">
              Submit
            </button>
          </div>
        </form>
      }
      modalHeading={category?.id ? "Edit category modal" : "Add category modal"}
    />
  );
};

export default ProjectCategoryAddAndEditComponent;
