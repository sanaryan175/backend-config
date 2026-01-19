import { Router } from "express";
import { 
    // loginUser, 
    // logoutUser, 
    registerUser 
    // refreshAccessToken, 
    // changeCurrentPassword, 
    // getCurrentUser, 
    // updateUserAvatar, 
    // updateUserCoverImage, 
    // getUserChannelProfile, 
    // getWatchHistory, 
    // updateAccountDetails
} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { User } from "../models/user.model.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )

// Testing/debug endpoint: list all users (no passwords/tokens)
router.route("/").get(async (req, res) => {
    try {
        const users = await User.find({}).select("-password -refreshToken");
        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// router.route("/login").post(loginUser)

// //secured routes
// router.route("/logout").post(verifyJWT,  logoutUser)
// router.route("/refresh-token").post(refreshAccessToken)
// router.route("/change-password").post(verifyJWT, changeCurrentPassword)
// router.route("/current-user").get(verifyJWT, getCurrentUser)
// router.route("/update-account").patch(verifyJWT, updateAccountDetails)

// router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
// router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

// router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
// router.route("/history").get(verifyJWT, getWatchHistory)

export default router