import { createSlice } from "@reduxjs/toolkit";
import { acceptConnectionRequest, downloadProfile, getAllUsersProfile, getMyConnectionRequest, getUser, rejectConnectionRequest, requestedUsers, sendConnectionRequest, updateProfilePicture, updateUser, updateUserProfile, userLogin, userRegister } from "../../action/authAction";

const initialState = {
    user: [],
    profile: [],
    allUsersProfile: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
    connections: [],
    connectionRequests: [],
    profileFetched: false,
    loggedIn: false,
};


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: () => initialState,
        handleLogin: (state, action) => {
            state.message = "hello";
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(userLogin.pending, (state) => {
                state.isLoading = true;
                state.message = "Logging in...";
            })
            .addCase(userLogin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.loggedIn = true;
                state.message = {
                    message: "Login successfull",
                };
            })
            .addCase(userLogin.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.payload || "Login failed";
            })
            .addCase(userRegister.pending, (state) => {
                state.isLoading = true;
                state.message = "Registering user...";
            })
            .addCase(userRegister.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.loggedIn = false;
                state.message = "Registration successful. Please sign in.";
            })
            .addCase(userRegister.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.payload || "Registration failed";
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.profile = action.payload.profile;
                state.profileFetched = true;
                state.loggedIn = true;
                state.message = "User data fetched successfully";
            })
            .addCase(getAllUsersProfile.fulfilled, (state, action) => {
                state.connections = action.payload.connections;
                state.connectionRequests = action.payload.connectionRequests;
                state.message = "All users profile fetched successfully";
                state.allUsersProfile = action.payload;
            })
            .addCase(sendConnectionRequest.pending, (state) => {
                state.message = "Sending connection request...";
            })
            .addCase(sendConnectionRequest.fulfilled, (state, action) => {
                state.message = action.payload?.message;
            })
            .addCase(sendConnectionRequest.rejected, (state, action) => {
                state.message = action.payload?.message || "Connection request failed";
            })
            .addCase(getMyConnectionRequest.pending, (state) => {
                state.message = "Fetching followings...";
            })
            .addCase(getMyConnectionRequest.fulfilled, (state, action) => {
                state.connectionRequests = action.payload?.followings;
                state.message = action.payload?.message;
            })
            .addCase(getMyConnectionRequest.rejected, (state, action) => {
                state.message = action.payload?.message || "Failed to get followings";
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.user = action.payload?.user || state.user;
                state.message = action.payload?.message;
                state.isSuccess = true;
                state.isError = false;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.message = action.payload?.message || "Failed to update account";
                state.isError = true;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.profile = action.payload?.profile || state.profile;
                state.message = action.payload?.message;
                state.isSuccess = true;
                state.isError = false;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.message = action.payload?.message || "Failed to update profile";
                state.isError = true;
            })
            .addCase(updateProfilePicture.fulfilled, (state, action) => {
                state.message = action.payload?.message;
                state.isSuccess = true;
                state.isError = false;
            })
            .addCase(updateProfilePicture.rejected, (state, action) => {
                state.message = action.payload?.message || "Failed to update profile picture";
                state.isError = true;
            })
            .addCase(requestedUsers.fulfilled, (state, action) => {
                state.connections = action.payload?.followers;
                state.message = action.payload?.message;
                state.isSuccess = true;
                state.isError = false;
            })
            .addCase(requestedUsers.rejected, (state, action) => {
                state.message = action.payload?.message || "Failed to get requested users";
                state.isError = true;
            })
            .addCase(rejectConnectionRequest.fulfilled, (state, action) => {
                state.message = action.payload?.message;
                state.isSuccess = true;
                state.isError = false;
            })
            .addCase(rejectConnectionRequest.rejected, (state, action) => {
                state.message = action.payload?.message || "Failed to reject connection request";
                state.isError = true;
            })
            .addCase(acceptConnectionRequest.fulfilled, (state, action) => {
                state.message = action.payload?.message;
                state.isSuccess = true;
                state.isError = false;
            })
            .addCase(downloadProfile.fulfilled, (state, action) => {
                state.message = action.payload?.message || "Profile PDF generated successfully";
                state.isSuccess = true;
                state.isError = false;
            })
            .addCase(downloadProfile.rejected, (state, action) => {
                state.message = action.payload?.message || "Failed to generate profile PDF";
                state.isError = true;
            })
    }
})
export const { reset, handleLogin } = authSlice.actions;
export default authSlice.reducer;