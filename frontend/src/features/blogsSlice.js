
import {
    createSlice,
    createAsyncThunk,
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { axiosJWT } from "../components/http-common";
import axios from "axios";
import { formatRelative } from 'date-fns';

const blogsAdapter = createEntityAdapter({
    selectId: (post) => post._id,
    sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt)
})

const initialState = blogsAdapter.getInitialState({
    status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    count: 0
})

export const fetchBlogs = createAsyncThunk('blogs/fetchBlogs', async () => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/blogs`, {
        headers: {
            "Content-type": "application/json"
        }
    });
    return response.data;
})

export const addNewBlog = createAsyncThunk('blogs/addNewBlog', async (initialBlog) => {
    const response = await axiosJWT.post("", initialBlog);
    return response.data;
})

export const updateBlog = createAsyncThunk('blogs/updateBlog', async (initialBlog) => {
    const { _id } = initialBlog;
    const response = await axiosJWT.put(`${_id}`, initialBlog);
    return response.data;
})

export const deleteBlog = createAsyncThunk('blogs/deleteBlog', async (initialBlog) => {
    const { id } = initialBlog;

    const response = await axiosJWT.delete(`${id}`);
    if (response?.status === 200) return initialBlog;
    return `${response?.status}: ${response?.statusText}`;
})

const blogsSlice = createSlice({
    name: 'blogs',
    initialState,
    reducers: {
        reactionAdded(state, action) {
            const { blogId, reaction } = action.payload
            const existingBlog = state.entities[blogId]
            if (existingBlog) {
                existingBlog.reactions[reaction]++
            }
        },
        increaseCount(state, action) {
            state.count = state.count + 1
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchBlogs.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchBlogs.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Adding date and reactions
                // let min = 1;
                const loadedBlogs = action.payload.map(blog => {
                    blog.updatedAt = formatRelative(new Date(blog.updatedAt), new Date(), { addSuffix: true });
                    return blog;
                });

                // Add any fetched blogs to the array
                blogsAdapter.upsertMany(state, loadedBlogs);
            })
            .addCase(fetchBlogs.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addNewBlog.fulfilled, (state, action) => {
                action.payload.updatedAt = new Date().toISOString();
                action.payload.comments = [];
                blogsAdapter.addOne(state, action.payload)
            })
            .addCase(updateBlog.fulfilled, (state, action) => {
                if (!action.payload?._id) {
                    console.log('Update could not complete');
                    console.log(action.payload);
                    return;
                }
                // action.payload.date = new Date().toISOString();
                blogsAdapter.upsertOne(state, action.payload);
            })
            .addCase(updateBlog.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteBlog.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log('Delete could not complete');
                    console.log(action.payload);
                    return;
                }
                const { id } = action.payload;
                blogsAdapter.removeOne(state, id);
            })
            .addCase(deleteBlog.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    }
})

export const {
    selectAll: selectAllBlogs,
    selectById: selectBlogById,
    selectIds: selectBlogIds
} = blogsAdapter.getSelectors(state => state.blogs)


export const getBlogsStatus = (state) => state.blogs.status;
export const getBlogsError = (state) => state.blogs.error;
export const getCount = (state) => state.blogs.count;

export const selectBlogsByUser = createSelector(
    [selectAllBlogs, (state, userId) => userId],
    (blogs, userId) => blogs.filter(blog => blog.userId === userId)
)

export const { increaseCount, reactionAdded } = blogsSlice.actions

export default blogsSlice.reducer