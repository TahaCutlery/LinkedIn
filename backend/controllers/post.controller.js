import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const createPost = async (req, res) => {
    try {
        const { token } = req.body;
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const newPost = new Post({
            user_id: user._id,
            body: req.body.body,
            media: req.file != undefined ? req.file.filename : "",
            fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : ""
        })
        await newPost.save();
        return res.status(201).json({ message: "Post created successfully", newPost });
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error", error: err });
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("user_id", "name username email profile_picture");
        return res.status(200).json({ message: "Posts retrieved successfully", posts });
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error", error: err });
    }
}

export const deletePost = async (req, res) => {
    try {
        const { token, post_id } = req.body;
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const post = await Post.findOne({ _id: post_id });
        if (!post) {
            return res.status(400).json({ message: "Post not found" });
        }
        if (post.user_id.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }
        await Post.deleteOne({ _id: post_id, user_id: user._id });
        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error", error: err });
    }
}

export const createComment = async (req, res) => {
    try {
        const { token, post_id, comment } = req.body;
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const post = await Post.findOne({ _id: post_id });
        if (!post) {
            return res.status(400).json({ message: "Post not found" });
        }
        const newComment = new Comment({
            user_id: user._id,
            post_id: post._id,
            body: comment,
        })
        await newComment.save();
        return res.status(201).json({ message: "Comment added successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error", error: err });
    }
}

export const getCommentsByPost = async (req, res) => {
    try {
        const { post_id } = req.params;
        const post = await Post.findOne({ _id: post_id });
        if (!post) {
            return res.status(400).json({ message: "Post not found" });
        }
        const comments = await Comment.find({ post_id }).populate("user_id", "name username profilePicture");
        return res.status(200).json({ message: "Comments retrieved successfully", comments, post_id });
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error", error: err });
    }
}

export const deleteComment = async (req, res) => {
    try {
        const { token, comment_id } = req.body;
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const comment = await Comment.findOne({ _id: comment_id });
        if (!comment) {
            return res.status(400).json({ message: "Comment not found" });
        }
        if (comment.user_id.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this comment" });
        }
        await Comment.deleteOne({ _id: comment_id, user_id: user._id });
        return res.status(200).json({ message: "Comment deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error", error: err });
    }
}

export const incrementLikes = async (req, res) => {
    try {
        const { token, post_id } = req.body;
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const post = await Post.findOne({ _id: post_id });
        if (!post) {
            return res.status(400).json({ message: "Post not found" });
        }
        const isLiked = post.likes.find((id) => id.toString() === user._id.toString());
        if (isLiked) {
            post.likes = post.likes.filter((id) => id.toString() !== user._id.toString());
        }
        else {
            post.likes = [...post.likes, user._id];
        }
        await post.save();
        return res.status(200).json({ message: "Post liked successfully", likes: post.likes });

    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error", error: err });
    }
}