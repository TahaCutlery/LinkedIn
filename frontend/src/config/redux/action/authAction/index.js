import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { reportInvalidHmrMessage } from "next/dist/client/dev/hot-reloader/shared";

export const userLogin = createAsyncThunk("user/login", async (user, thunkAPI) => {
    try {
        const response = await clientServer.post("/login", {
            email: user.email,
            password: user.password
        });

        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
        }
        else {
            return thunkAPI.rejectWithValue({ message: "Token not found in response" });
        }

        return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
});

export const userRegister = createAsyncThunk("user/register", async (user, thunkAPI) => {
    try {
        const response = await clientServer.post("/register", {
            name: user.name,
            username: user.username,
            email: user.email,
            password: user.password
        })
        return thunkAPI.fulfillWithValue(response?.data);
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data);
    }
})

export const getUser = createAsyncThunk("user/getUser", async (user, thunkAPI) => {
    try {
        const response = await clientServer.get(`/get_user_and_profile?token=${user.token}`);
        return thunkAPI.fulfillWithValue(response?.data);
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data);
    }
})

export const getAllUsersProfile = createAsyncThunk("/users/get_all_users_profile",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.get("/users/get_all_users_profile");
            return thunkAPI.fulfillWithValue(response?.data);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data);
        }
    })

export const sendConnectionRequest = createAsyncThunk("/user/send_connection_request",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post("/user/send_connection_request", {
                token: user.token,
                connection_id: user.user_id
            });
            return thunkAPI.fulfillWithValue(response?.data);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data);
        }
    })

export const getMyConnectionRequest = createAsyncThunk("/user/followings",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.get(`/user/followings?token=${user.token}`);
            return thunkAPI.fulfillWithValue(response?.data);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data);
        }
    })

export const updateUser = createAsyncThunk("user/updateUser", async (user, thunkAPI) => {
    try {
        const response = await clientServer.put("/update_user", {
            token: user.token,
            name: user.name,
            username: user.username,
            email: user.email,
        });
        return thunkAPI.fulfillWithValue(response?.data);
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data);
    }
});

export const updateUserProfile = createAsyncThunk("user/updateUserProfile", async (profile, thunkAPI) => {
    try {
        const response = await clientServer.put("/update_user_profile", {
            token: profile.token,
            bio: profile.bio,
            current_post: profile.current_post,
            past_work: profile.past_work,
            education: profile.education,
        });
        return thunkAPI.fulfillWithValue(response?.data);
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data);
    }
});

export const updateProfilePicture = createAsyncThunk("user/updateProfilePicture", async (data, thunkAPI) => {
    try {
        const formData = new FormData();
        formData.append("token", data.token);
        formData.append("profile_picture", data.profile_picture);
        const response = await clientServer.put("/update_profile_picture", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return thunkAPI.fulfillWithValue(response?.data);
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data);
    }
});

export const requestedUsers = createAsyncThunk("/user/followers",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.get(`/user/followers?token=${user.token}`);
            return thunkAPI.fulfillWithValue(response?.data);
        } catch (err) {
            return thunkAPI.rejectWithValue(err?.response?.data);
        }
    }
)

export const rejectConnectionRequest = createAsyncThunk("/user/reject_connection",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post("/user/reject_connection", {
                token: user.token,
                connection_id: user.connection_id
            });
            return thunkAPI.fulfillWithValue(response?.data);
        } catch (err) {
            return thunkAPI.rejectWithValue(err?.response?.data);
        }
    }
)

export const acceptConnectionRequest = createAsyncThunk("/user/accept_connection",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post("/user/accept_connection", {
                token: user.token,
                connection_id: user.connection_id
            });
            return thunkAPI.fulfillWithValue(response?.data);
        } catch (err) {
            return thunkAPI.rejectWithValue(err?.response?.data);
        }
    });

export const downloadProfile = createAsyncThunk("/users/download_resume",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.get(`/users/download_resume?id=${user.user_id}`);
            return thunkAPI.fulfillWithValue(response?.data);
        } catch (err) {
            return thunkAPI.rejectWithValue(err?.response?.data);
        }
    });