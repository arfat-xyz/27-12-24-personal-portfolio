import { v2 as cloudinary } from "cloudinary";
import config from "./config";

const {
  cloudinaryApiKey,
  cloudinaryApiSecret,
  cloudinaryCloudName,
  cloudinaryMainUrlForDeleteImage,
} = config;
cloudinary.config({
  cloud_name: cloudinaryCloudName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret,
});
export const deleteImages = async (images: string[]) => {
  const slicedImages = images.map(
    (img) => img.slice(cloudinaryMainUrlForDeleteImage?.length).split(".")[0]
  );
  console.log({ slicedImages });
  cloudinary.api
    .delete_resources(slicedImages)
    .then((result) => console.log(result));
};
