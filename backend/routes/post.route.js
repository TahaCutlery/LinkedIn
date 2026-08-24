import { Router } from "express";
import { createComment, createPost, deleteComment, deletePost, getAllPosts, getCommentsByPost, incrementLikes } from "../controllers/post.controller.js";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "media/posts/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

router.route("/createPost").post(upload.single("media"), createPost);
router.route("/getAllPosts").get(getAllPosts);
router.route("/deletePost").delete(deletePost);

router.route("/createComment").post(createComment);
router.route("/getCommentsByPost/:post_id").get(getCommentsByPost);
router.route("/deleteComment").delete(deleteComment);
router.route("/incrementLikes").post(incrementLikes);

export default router;