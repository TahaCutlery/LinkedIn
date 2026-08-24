import { createSlice } from "@reduxjs/toolkit";
import { createComment, createPost, deletePost, getAllPost, getCommentsOfThePost, incrementLikes } from "../../action/postAction";

const initialState = {
    posts: [],
    isLoading: false,
    isError: false,
    loggedIn: false,
    isSuccess: false,
    message: "",
    postFeched: false,
    postId: "",
    // likes: [],
    commentsFetched: false,
    comments: []
}

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        reset: () => initialState,
        emptyPostId: (state) => state.postId = "",
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllPost.pending, (state) => {
                state.isLoading = true;
                state.message = "Fetching Posts";
            })
            .addCase(getAllPost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.message = action.payload?.message;
                state.posts = action.payload?.posts;
                state.postFeched = true;
            })
            .addCase(getAllPost.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.payload?.message;
                state.postFeched = false;
            })
            .addCase(getCommentsOfThePost.fulfilled, (state, action) => {
                state.comments = action.payload?.comments.reverse();
                state.postId = action.payload?.post_id;
                state.commentsFetched = true;
                state.message = action.payload?.message;
                state.isSuccess = true;
                state.isError = false;
            })
            .addCase(getCommentsOfThePost.rejected, (state, action) => {
                state.commentsFetched = false;
                state.message = action.payload.message;
                state.isSuccess = false;
                state.isError = true;
            })
            .addCase(getCommentsOfThePost.pending, (state, action) => {
                state.message = "Fetching Comments";
            })
            .addCase(createComment.fulfilled, (state, action) => {
                state.isSuccess = true;
                state.isError = false;
                state.commentsFetched = true;
                state.message = action.payload.message;
            })
            .addCase(createComment.pending, (state, action) => {
                state.message = "Creating Comment";
            })
            .addCase(createComment.rejected, (state, action) => {
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload.message;
                state.commentsFetched = false;
            })
            .addCase(incrementLikes.fulfilled, (state, action) => {
                // state.likes = action.payload?.likes;
                state.message = action.payload?.message;
            })
            .addCase(incrementLikes.rejected, (state, action) => {
                state.message = action.payload.message;
                state.isSuccess = false;
                state.isError = true;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.posts = [action.payload?.newPost, ...state.posts];
                state.isSuccess = true;
                state.isError = false;
                state.message = action.payload.message;
            })
            .addCase(createPost.rejected, (state, action) => {
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload.message;
            })
            .addCase(createPost.pending, (state, action) => {
                state.message = "Creating Post";
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.isSuccess = true;
                state.isError = false;
                state.message = action.payload?.message;
                state.posts = state.posts.filter((post) => post._id !== state.postId);
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload?.message;
            })
            .addCase(deletePost.pending, (state, action) => {
                state.message = "Deleting Post";
            })
    }
})

export const { emptyPostId } = postSlice.actions;

export default postSlice.reducer;