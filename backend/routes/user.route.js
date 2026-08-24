import { Router } from "express";
import { acceptConnection, downloadProfile, followers, followings, getAllUsersProfile, getUserAndProfile, getUserAndProfileBasedOnUsername, login, register, rejectConnectionRequest, sendConnectionRequest, updateProfilePicture, updateUser, updateUserProfile } from "../controllers/user.controller.js";
import multer from "multer";
const router = Router();

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'media/profile_pictures/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})
const upload = multer({ storage });

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/update_user").put(updateUser);
router.route("/update_user_profile").put(updateUserProfile);
router.route("/update_profile_picture").put(upload.single("profile_picture"), updateProfilePicture);
router.route("/get_user_and_profile").get(getUserAndProfile);
router.route("/users/get_all_users_profile").get(getAllUsersProfile);
router.route("/users/download_resume").get(downloadProfile);

router.route("/user/send_connection_request").post(sendConnectionRequest);
router.route("/user/followers").get(followers);
router.route("/user/followings").get(followings);
router.route("/user/accept_connection").post(acceptConnection);
router.route("/user/reject_connection").post(rejectConnectionRequest);
router.route("/user/userProfile").get(getUserAndProfileBasedOnUsername);

export default router;