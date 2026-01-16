import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || "").trim();
    const apiKey = (process.env.CLOUDINARY_API_KEY || "").trim();
    const apiSecret = (process.env.CLOUDINARY_API_SECRET || "").trim();

    if (!cloudName || !apiKey || !apiSecret) {
      console.error("Cloudinary env missing:", {
        CLOUDINARY_CLOUD_NAME: Boolean(cloudName),
        CLOUDINARY_API_KEY: Boolean(apiKey),
        CLOUDINARY_API_SECRET: Boolean(apiSecret),
      });
      return null;
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    if (!localFilePath) {
      console.error("Cloudinary upload: missing localFilePath");
      return null;
    }

    if (!fs.existsSync(localFilePath)) {
      console.error("Cloudinary upload: file does not exist:", localFilePath);
      return null;
    }

    try {
      const stat = fs.statSync(localFilePath);
      console.log("Cloudinary upload: local file ready", {
        path: localFilePath,
        size: stat.size,
      });
    } catch (e) {
      console.error("Cloudinary upload: failed to stat file:", {
        path: localFilePath,
        message: e?.message,
      });
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    try {
      fs.unlinkSync(localFilePath);
    } catch (e) {
      console.error("Cloudinary upload: failed to delete temp file:", {
        path: localFilePath,
        message: e?.message,
      });
    }

    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", {
      message: error?.message,
      name: error?.name,
      http_code: error?.http_code,
      stack: error?.stack,
    });

    if (localFilePath && fs.existsSync(localFilePath)) {
      try {
        fs.unlinkSync(localFilePath);
      } catch (e) {
        console.error("Cloudinary upload: failed to delete temp file after error:", {
          path: localFilePath,
          message: e?.message,
        });
      }
    }

    return null;
  }
};
