import { configureStore } from "@reduxjs/toolkit";
import blogsReducer from '../features/blogsSlice';
import userReducer from '../features/userSlice';


export const store = configureStore({
    reducer: {
        blogs: blogsReducer,
        user: userReducer
    }
})