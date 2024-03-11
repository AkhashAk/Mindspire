import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosJWT } from "../components/http-common";

// const USERS_URL = 'https://jsonplaceholder.typicode.com/user';

const initialState = null;

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
    const response = await axiosJWT.get();
    return response.data
})

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setAuth(state, action) {
            if (action?.payload) localStorage.setItem("token", action.payload.token);
            return action.payload;
        },
        setRefreshAuth(state, action) {
            localStorage.setItem("token", action.payload.token);
            return {
                ...state.user,
                token: action.payload.token,
                refreshToken: action.payload.refreshToken,
            }
        }
    },
    extraReducers(builder) {
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            return action.payload;
        })
    }
})

export const authorizedUser = (state) => state.user;

// export const selectUserById = (state, userId) => state.user.find(user => user.id === userId)

export const { setAuth, setRefreshAuth } = userSlice.actions;

export default userSlice.reducer