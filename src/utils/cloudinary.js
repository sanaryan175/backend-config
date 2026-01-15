import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.log("No file path provided");
            return null;
        }
        
        console.log("Uploading file to Cloudinary:", localFilePath);
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        
        console.log("File uploaded successfully:", response.secure_url);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.error("Cloudinary upload error:", error.message);
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
};

