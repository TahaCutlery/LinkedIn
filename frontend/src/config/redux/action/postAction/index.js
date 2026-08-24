import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllPost = createAsyncThunk("post/allPorts", async (user, thunkAPI) => {
    try {
        const response = await clientServer.get("/getAllPosts");
        return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data.message);
    }
})

export const getCommentsOfThePost = createAsyncThunk("/getCommentsByPost/:post_id", 
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.get(`/getCommentsByPost/${user.post_id}`);
            return thunkAPI.fulfillWithValue(response?.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data.message);
        }
    }
);

export const createComment = createAsyncThunk("/createComment",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post("/createComment", {
                token: user.token,
                post_id: user.post_id,
                comment: user.comment
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data.message);
        }
    }
);

export const incrementLikes = createAsyncThunk("/incrementLikes",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post("/incrementLikes", {
                token: user.token,
                post_id: user.post_id
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data.message);
        }
    }
);

export const createPost = createAsyncThunk("/createPost", 
    async (user, thunkAPI) => {
        try {
            const formData = new FormData();
            formData.append("token", user.token);
            formData.append("body", user.body);
            formData.append("media", user.media);
            
            const response = await clientServer.post("/createPost", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data.message);
        }
    }
);

export const deletePost = createAsyncThunk("/deletePost", 
    async(user, thunkAPI) => {
        try {
            const response = await clientServer.delete("/deletePost", {
                data: {
                    token: user.token,
                    post_id: user.post_id
                }
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
)