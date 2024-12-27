const config = {
  mongodbURI: process.env.DATABASE_URL,
  nextAuthURL: process.env.NEXTAUTH_URL,
  nextAuthSecret: process.env.NEXTAUTH_SECRET,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  cloudinaryFolderName: process.env.CLOUDINARY_FOLDER_NAME,
  cloudinaryMainUrlForDeleteImage:
    process.env.CLOUDINARY_MAIN_URL_FOR_DELETE_IMAGE,
  metadataDefaultTitle: "Arfat blog",
  metadataDefaultDescription: "Arfat is a full stack web developer",
  metadataDefaultImageLink: "https://i.ibb.co/LzyywS0/arfat-rahman.jpg",
};

export default config;
