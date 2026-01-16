import {asynchandler} from "../utils/asynchandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.clean.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const registerUser = asynchandler( async (req, res) => {
    try {
        console.log("REQ FILES => ", JSON.stringify(req.files, null, 2));
        console.log("REQ BODY  => ", req.body);
        
        const {fullName, email, username, password } = req.body

        if (!fullName || !email || !username || !password) {
            throw new ApiError(400, "All fields are required");
        }

        const existedUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existedUser) {
            throw new ApiError(409, "User with email or username already exists");
        }

        // Check if files were uploaded
        if (!req.files || !req.files.avatar || !req.files.avatar[0]) {
            console.error("No avatar file uploaded or error in file upload");
            console.error("Files received:", req.files);
            throw new ApiError(400, "Avatar file is required");
        }

        const avatarFile = req.files.avatar[0];
        const avatarLocalPath = avatarFile.path;
        
        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar file path is missing");
        }

        let coverImageLocalPath;
        if (req.files.coverImage && req.files.coverImage[0] && req.files.coverImage[0].path) {
            coverImageLocalPath = req.files.coverImage[0].path;
        }

        console.log("Avatar path:", avatarLocalPath);
        console.log("Cover image path:", coverImageLocalPath || "No cover image");

        const avatar = await uploadOnCloudinary(avatarLocalPath);
        if (!avatar) {
            throw new ApiError(400, "Failed to upload avatar to Cloudinary");
        }

        const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

        const user = await User.create({
            fullName,
            avatar: avatar.secure_url,
            coverImage: coverImage?.secure_url || "",
            email, 
            password,
            username: username.toLowerCase()
        });

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        );

        if (!createdUser) {
            throw new ApiError(500, "Something went wrong while registering the user");
        }

        return res.status(201).json(
            new ApiResponse(200, createdUser, "User registered Successfully")
        );

    } catch (error) {
        console.error("Registration error:", error);
        throw error; // This will be caught by the asynchandler
    }
});

export {registerUser}