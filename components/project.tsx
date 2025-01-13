"use client";
import {
  frontendErrorResponse,
  frontendSuccessResponse,
} from "@/lib/frontend-response-toast";
import { stringValidation } from "@/lib/validations/combine-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Project as PrismaProject,
  ProjectCategory,
  ProjectStatus,
} from "@prisma/client";
import axios from "axios";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MdDeleteForever } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import MarkdownEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { ItemInterface, ReactSortable } from "react-sortablejs";
import { z } from "zod";

// Define the Zod schema for validation
const ProjectSchema = z.object({
  title: stringValidation("Title").nonempty("Title is required"),
  slug: stringValidation("Slug")
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
  projectCategory: z.array(
    z.object({
      label: stringValidation("Project category label"),
      value: stringValidation("Project category value"),
    })
  ),
  images: z.array(stringValidation("Image")).optional(),
  description: z.string().nonempty("Blog content is required"),
  tags: z
    .array(
      z.object({
        label: stringValidation("Tag label"),
        value: stringValidation("Tag value"),
      })
    )
    .nonempty("At least one tag must be selected"),
  status: z.nativeEnum(ProjectStatus, {
    invalid_type_error: "Invalid project status",
    required_error: "Status is required",
  }),
});

// Infer the form data type from the Zod schema
type ProjectFormData = z.infer<typeof ProjectSchema>;
const tagOptions = z.object({
  label: stringValidation("Tag label"),
  value: stringValidation("Tag value"),
});

type TagOptionsProps = z.infer<typeof tagOptions>;
export default function Project({
  project,
  category,
}: {
  project?: PrismaProject & { projectCategoryIds: string[] };
  category: ProjectCategory[];
}) {
  const [redirect, setRedirect] = useState(false);
  const [images, setImages] = useState<string[]>(project?.images ?? []);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
    clearErrors,
    control,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      title: project?.title ?? "",
      slug: project?.slug ?? "",
      projectCategory: project?.projectCategoryIds.length
        ? category
            .filter((cat) => project?.projectCategoryIds.includes(cat.id)) // Filter categories with matching ids
            .map((cat) => ({ label: cat.name, value: cat.id }))
        : [],
      description: project?.description ?? "",
      tags: project?.tags?.length
        ? project.tags.map((cat) => ({
            label: cat,
            value: cat,
          }))
        : [],
      status: project?.status ?? "Draft",
    },
  });
  const [tagOptions, setTagOptions] = useState<TagOptionsProps[]>(
    category.map((cat) => ({
      label: cat.name,
      value: cat.id,
    }))
  );
  const router = useRouter();
  const onSubmit = async (data: ProjectFormData) => {
    const { projectCategory, tags, ...others } = data;
    const newProjectCategory = projectCategory.map((c) => c.value);
    const newtags = tags.map((c) => c.label);
    console.log({ newtags, newProjectCategory });
    if (!images.length)
      return setError("images", {
        message: "Minimum one  image requied",
        type: "manual",
      });
    data.images = [...images];
    try {
      if (project?.id) {
        await axios
          .put(`/api/projects/${project?.id}`, {
            ...others,
            projectCategory: newProjectCategory,
            tags: newtags,
            images: [...images],
          })
          .then((res) => {
            frontendSuccessResponse({ message: res?.data?.message });
            return router.push("/projects");
          })
          .catch((e) =>
            frontendErrorResponse({ message: e?.response?.data?.message })
          );
      } else {
        await axios
          .post(`/api/projects`, {
            ...others,
            projectCategory: newProjectCategory,
            tags: newtags,
            images: [...images],
          })
          .then((res) => {
            frontendSuccessResponse({ message: res?.data?.message });
            return router.push("/projects");
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

  // Synchronize default tags with `tagOptions`
  useEffect(() => {
    const initialTags = project?.tags?.map((tag) => ({
      label: tag,
      value: tag,
    }));

    if (initialTags) {
      setTagOptions((prev) => [...new Set([...prev, ...initialTags])]);
    }
  }, [project, category]);
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
          {/* <select id="category" multiple {...register("blogCategory")}>
            <option value="Node js">Node js</option>
            {category.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select> */}
          {/* <Select
            closeMenuOnSelect={false}
            defaultValue={blog?.id ? [] : []}
            isMulti
            options={options}
            className="w-full"
            {...register("blogCategory")}
          /> */}
          {/* <Controller
            name="blogCategory"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={category.map((cat) => ({
                  label: cat.name,
                  value: cat.id,
                }))}
                defaultValue={[]}
                isMulti
                closeMenuOnSelect={false}
                className="w-full"
                value={category.map((cat) => ({
                  label: cat.name,
                  value: cat.id,
                }))}
                onChange={(selected) =>
                  field.onChange(selected?.map((option) => option.value))
                } // Map selected values to their IDs
              />
            )}
          /> */}
          <Controller
            name="projectCategory"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={category.map((cat) => ({
                  label: cat.name,
                  value: cat.id,
                }))}
                isMulti
                closeMenuOnSelect={false}
                className="w-full"
                onChange={(selected) => field.onChange(selected)} // Set the selected value
              />
            )}
          />
          {errors.projectCategory && (
            <span className="form-error">{errors.projectCategory.message}</span>
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
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index, link)}
                    >
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
          {/* <select id="tags" multiple {...register("tags")}>
            <option value="html">html</option>
            <option value="css">css</option>
            <option value="Javascript">Javascript</option>
            <option value="nextjs">nextjs</option>
            <option value="reactjs">reactjs</option>
            <option value="database">database</option>
          </select> */}
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <CreatableSelect
                isMulti
                closeMenuOnSelect={false}
                options={tagOptions}
                className="w-full"
                value={field.value}
                onChange={(selected) => {
                  // Update form field
                  field.onChange(selected);

                  // Add new tags to `tagOptions` if created
                  selected.forEach((tag) => {
                    if (
                      !tagOptions.find((option) => option.value === tag.value)
                    ) {
                      setTagOptions((prev) => [...prev, tag]);
                    }
                  });
                }}
                onCreateOption={(inputValue) => {
                  const newTag = { label: inputValue, value: inputValue };

                  // Add the new tag to options and update the form
                  setTagOptions((prev) => [...prev, newTag]);
                  const updatedTags = [...(field.value || []), newTag];
                  field.onChange(updatedTags);
                }}
              />
            )}
          />
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
