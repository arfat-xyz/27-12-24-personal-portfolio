"use client";
import ReactMarkdown from "react-markdown";
import MarkdownEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ReactNode, useEffect, useState } from "react";
import {
  frontendErrorResponse,
  frontendSuccessResponse,
} from "@/lib/frontend-response-toast";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ItemInterface, ReactSortable } from "react-sortablejs";
import { MdDeleteForever } from "react-icons/md";
import { CldUploadWidget } from "next-cloudinary";
import { Blog as PrsimaBLog } from "@prisma/client";
import { deleteImages } from "@/lib/cloudinary";

// Define the Zod schema for validation
const blogSchema = z.object({
  title: z.string().nonempty("Title is required"),
  slug: z
    .string()
    .nonempty("Slug is required")
    .transform(
      (value) =>
        value
          .trim()
          .replace(/\s+/g, "-") // Replace spaces with hyphens
          .replace(/[^a-z0-9-]/g, "") // Remove invalid characters
    )
    .refine(
      (value) => /^[a-z0-9-]+$/.test(value),
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  blogCategory: z
    .array(z.string())
    .nonempty("At least one category must be selected"),
  images: z.array(z.string()).optional(),
  description: z.string().nonempty("Blog content is required"),
  tags: z.array(z.string()).nonempty("At least one tag must be selected"),
  status: z.string().nonempty("Status is required"),
});

// Infer the form data type from the Zod schema
type BlogFormData = z.infer<typeof blogSchema>;

export default function Blog({ blog }: { blog?: PrsimaBLog }) {
  const [redirect, setRedirect] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [images, setImages] = useState<string[]>(blog?.images ?? []);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: blog?.title ?? "",
      slug: blog?.slug ?? "",
      blogCategory: blog?.blogCategory?.length ? blog.blogCategory : [],
      description: blog?.description ?? "",
      tags: blog?.tags?.length ? blog.tags : [],
      status: blog?.status ?? "Draft",
    },
  });
  const router = useRouter();
  const onSubmit = async (data: BlogFormData) => {
    if (!images.length)
      return setError("images", {
        message: "Minimum one  image requied",
        type: "manual",
      });
    data.images = [...images];
    // Handle form submission
    try {
      if (blog?.id) {
        const response = await axios.put(`/api/blogs/${blog?.id}`, data);
        console.log({ response });
      } else {
        await axios
          .post(`/api/blogs`, data)
          .then((res) => {
            frontendSuccessResponse({ message: res?.data?.message });
            return router.push("/blogs");
          })
          .catch((e) =>
            frontendErrorResponse({ message: e?.response?.data?.message })
          );
      }
      setRedirect(true);
    } catch (error) {
      frontendErrorResponse({ message: `Something went wrong` });
    }
  };
  useEffect(() => {
    const slug = watch("slug"); // Get the current value of the slug field

    // Replace spaces with hyphens and remove invalid characters
    const sanitizedSlug = slug.replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    // Update the field value with the sanitized slug
    setValue("slug", sanitizedSlug);

    // If the sanitized value doesn't match the original, set an error
    if (slug !== sanitizedSlug) {
      setError("slug", {
        type: "manual",
        message:
          "Slug can only contain lowercase letters, numbers, and hyphens",
      });
    } else {
      clearErrors("slug"); // Clear error if the value is valid
    }
  }, [watch("slug")]);

  // async function uploadImages(ev: { target: { files: unknown } }) {
  //   const files = ev.target.files;
  //   setIsUploading(true);
  //   if (files?.length > 0) {
  //     for (const file of files) {
  //       const data = new FormData();
  //       data.append("file", file);

  //       //use the axios.post method and push the promise to the queue
  //       uploadImagesQueue.push(
  //         axios.post("/api/upload", data).then((res) => {
  //           console.log(res.data);
  //           setImages((prev) => [...prev, ...res?.data?.data?.link]);
  //         })
  //       );
  //     }
  //     await Promise.all(uploadImagesQueue);
  //     setIsUploading(false);
  //   } else {
  //     toast.error("An error occure");
  //   }
  // }

  const updateImagesOrder = (images: string[]) => {
    setImages(images);
  };
  const handleDeleteImage = async (index: number, link: string) => {
    const updateImages = [...images];
    await axios.post(`/api/delete-image`, { link });
    updateImages.splice(index, 1);
    setImages(updateImages);
    toast.success("Image deleted successfully");
  };

  return (
    <>
      <form className="addWebsiteform" onSubmit={handleSubmit(onSubmit)}>
        {/* blog title */}
        <div className="w-100 flex flex-col flex-left mb-2">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            placeholder="Enter small title"
            {...register("title")}
          />
          {errors.title && (
            <span className="form-error">{errors.title.message}</span>
          )}
        </div>

        {/* blog slug */}
        <div className="w-100 flex flex-col flex-left mb-2">
          <label htmlFor="slug">Slug (SEO friendly URL)</label>
          <input
            type="text"
            id="slug"
            placeholder="Enter small URL"
            {...register("slug")}
          />
          {errors.slug && (
            <span className="form-error">{errors.slug.message}</span>
          )}
        </div>

        {/* blog category */}
        <div className="w-100 flex flex-col flex-left mb-2">
          <label htmlFor="category">Select Category</label>
          <select id="category" multiple {...register("blogCategory")}>
            <option value="Node js">Node js</option>
            <option value="React js">React js</option>
            <option value="Next js">Next js</option>
            <option value="Digital Marketing">Digital Marketing</option>
          </select>
          {errors.blogCategory && (
            <span className="form-error">{errors.blogCategory.message}</span>
          )}
        </div>

        {/* blog images */}
        <div className="w-100 flex flex-col flex-left mb-2">
          <div className="w-100">
            {/* <label htmlFor="images">Images</label>
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={uploadImages}
            />
            {errors.images && (
              <span className="form-error">{errors.images.message}</span>
            )} */}
            <CldUploadWidget
              uploadPreset="udhfc7vu"
              // signatureEndpoint={"/api/sign-image"}
              onSuccess={(result) => {
                if (!result || typeof result === "string") return;
                setImages((prev) => [
                  ...prev,
                  (result?.info as { secure_url: string })?.secure_url,
                ]);
              }}
            >
              {({ open }) => {
                return (
                  <button
                    type="button" // Prevents form submission
                    onClick={() => open()}
                  >
                    Upload an Image
                  </button>
                );
              }}
            </CldUploadWidget>
          </div>
          {errors.images && (
            <span className="form-error">{errors.images.message}</span>
          )}
          {/* <div className="w-100 flex flex-left mt-1">
            {isUploading && <Spinner />}
          </div> */}
        </div>

        {images.length ? (
          <div className="flex">
            <ReactSortable
              list={
                Array.isArray(images)
                  ? (images as unknown as ItemInterface[])
                  : ([] as unknown as ItemInterface[])
              }
              setList={updateImagesOrder as () => ItemInterface[]}
              animation={200}
              className="flex gap-1"
            >
              {images.map((link, index) => (
                <div className="uploadedimg" key={index}>
                  <img src={link} alt="image" className="object-cover" />
                  <div className="deleteimg">
                    <button onClick={() => handleDeleteImage(index, link)}>
                      <MdDeleteForever />
                    </button>
                  </div>
                </div>
              ))}
            </ReactSortable>
          </div>
        ) : (
          ""
        )}

        {/* markdown description */}
        <div className="description w-100 flex flex-col flex-left mb-2">
          <label htmlFor="description">Blog Content</label>
          <MarkdownEditor
            style={{
              width: "100%",
              height: "400px",
            }}
            defaultValue={watch("description")}
            renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
            onChange={({ text }) => setValue("description", text)}
          />
          {errors.description && (
            <span className="form-error">{errors.description.message}</span>
          )}
        </div>

        {/* tags */}
        <div className="w-100 flex flex-col flex-left mb-2">
          <label htmlFor="tags">Tags</label>
          <select id="tags" multiple {...register("tags")}>
            <option value="html">html</option>
            <option value="css">css</option>
            <option value="Javascript">Javascript</option>
            <option value="nextjs">nextjs</option>
            <option value="reactjs">reactjs</option>
            <option value="database">database</option>
          </select>
          {errors.tags && (
            <span className="form-error">{errors.tags.message}</span>
          )}
        </div>

        {/* blog status */}
        <div className="w-100 flex flex-col flex-left mb-2">
          <label htmlFor="status">Status</label>
          <select id="status" {...register("status")}>
            <option value="">No select</option>
            <option value="Draft">Draft</option>
            <option value="Publish">Publish</option>
          </select>
          {errors.status && (
            <span className="form-error">{errors.status.message}</span>
          )}
        </div>

        {/* submit button */}
        <div className="w-100 mb-1">
          <button
            type="submit"
            className="w-100 addwebbtn flex-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "SAVE BLOG"}
          </button>
        </div>
      </form>
    </>
  );
}
