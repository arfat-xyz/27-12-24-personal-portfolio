"use client";
import {
  frontendErrorResponse,
  frontendSuccessResponse,
} from "@/lib/frontend-response-toast";
import { stringValidation } from "@/lib/validations/combine-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Photo } from "@prisma/client";
import axios from "axios";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MdDeleteForever } from "react-icons/md";
import "react-markdown-editor-lite/lib/index.css";
import { ItemInterface, ReactSortable } from "react-sortablejs";
import { z } from "zod";

// Define the Zod schema for validation
const gallerySchema = z.object({
  title: stringValidation("Title"),
  slug: stringValidation("Slug")
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

  images: z.array(stringValidation("Image")).optional(),
});

// Infer the form data type from the Zod schema
type GalleryFormData = z.infer<typeof gallerySchema>;
export default function Gallery({ gallery }: { gallery?: Photo }) {
  const [redirect, setRedirect] = useState(false);
  const [images, setImages] = useState<string[]>(gallery?.images ?? []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
    clearErrors,
    control,
  } = useForm<GalleryFormData>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      title: gallery?.title ?? "",
      slug: gallery?.slug ?? "",
    },
  });
  const router = useRouter();
  const onSubmit = async (data: GalleryFormData) => {
    if (!images.length)
      return setError("images", {
        message: "Minimum one  image requied",
        type: "manual",
      });
    data.images = [...images];
    try {
      if (gallery?.id) {
        await axios
          .put(`/api/gallery/${gallery?.id}`, {
            ...data,
            images: [...images],
          })
          .then((res) => {
            frontendSuccessResponse({ message: res?.data?.message });
            return router.push("/dashboard/gallery");
          })
          .catch((e) =>
            frontendErrorResponse({ message: e?.response?.data?.message })
          );
      } else {
        await axios
          .post(`/api/gallery`, {
            ...data,
            images: [...images],
          })
          .then((res) => {
            frontendSuccessResponse({ message: res?.data?.message });
            return router.push("/dashboard/gallery");
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
        <div className="w-100 flex-left mb-2 flex flex-col">
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

        <div className="w-100 flex-left mb-2 flex flex-col">
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

        <div className="w-100 flex-left mb-2 flex flex-col">
          <div className="w-100">
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

        {/* submit button */}
        <div className="w-100 mb-1">
          <button
            type="submit"
            className="w-100 addwebbtn flex-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "SAVE GALLERY"}
          </button>
        </div>
      </form>
    </>
  );
}
