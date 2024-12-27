"use client";

import { blogCategoryPOSTSchema } from "@/app/api/blog-category/route";
import { zodResolver } from "@hookform/resolvers/zod";
import { BlogCategory } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { z } from "zod";
import {
  frontendErrorResponse,
  frontendSuccessResponse,
} from "@/lib/frontend-response-toast";
import AnyModalComponent from "../any-modal-component";
import { GrAddCircle } from "react-icons/gr";

type BlogCategoryFromData = z.infer<typeof blogCategoryPOSTSchema>;
const AddAndEditComponent = ({
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
          .patch(`/api/blog-category/${category.id}`, { ...data })
          .then((res) => {
            frontendSuccessResponse({ message: res?.data?.message });
            setIsOpen(false); // Close the modal after submission
            setReloadData(true);
            reset();
          })
          .catch((e) =>
            frontendErrorResponse({ message: e?.response?.data?.message })
          );
      } else {
        await axios
          .post(`/api/blog-category`, { ...data })
          .then((res) => {
            frontendSuccessResponse({ message: res?.data?.message });
            setReloadData(true);
            setIsOpen(false); // Close the modal after submission
            reset();
          })
          .catch((e) =>
            frontendErrorResponse({ message: e?.response?.data?.message })
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
          <GrAddCircle className="size-5 hover:rotate-90 transition-all duration-300" />
        )
      }
      insideComponent={
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col px-3"
        >
          <input
            type="text"
            id="name"
            placeholder="Enter name"
            {...register("name")}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
          <div className="w-full flex justify-end mt-1">
            <button type="submit" className="h-8 text-sm rounded-md">
              Submit
            </button>
          </div>
        </form>
      }
      modalHeading={category?.id ? "Edit category modal" : "Add category modal"}
    />
  );
};

export default AddAndEditComponent;
