import React, { useState } from 'react'
import "./Blog.css";
import { useDispatch, useSelector } from 'react-redux';
import { authorizedUser } from '../../features/userSlice';
import { deleteBlog, selectBlogById, updateBlog } from '../../features/blogsSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { showToast } from '../../utils/toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Comment } from '../Comment';

export const Blog = () => {
    const { blogId } = useParams();
    const blog = useSelector(state => selectBlogById(state, blogId));
    const auth = useSelector(authorizedUser);
    const dispatch = useDispatch();
    const [title, setTitle] = useState(blog.title);
    const [description, setDescription] = useState(blog.description);
    const [editBlog, setEditBlog] = useState(false);

    const handleEditBlog = async () => {
        setEditBlog((prev) => !prev);
    }

    const nav = useNavigate();
    const handleDeleteBlog = async () => {
        dispatch(deleteBlog({ id: blogId })).unwrap();
        showToast("SUCCESS", "Deleted successfully");
        nav("/");
    }

    const handleEditBlogSubmit = async () => {
        try {
            dispatch(updateBlog({
                ...blog,
                title: title,
                description: description
            })).unwrap();
            setEditBlog(prev => !prev);
            showToast("SUCCESS", "Updated successfully!");
        } catch (error) {
            console.log("Error updating blog:", error.message);
        }
    }
    return (
        <div className='blog-div'>
            {!editBlog ?
                <React.Fragment>
                    <div className="blog-div-title" style={{ borderRadius: "1rem 1rem 0 0" }}>
                        <h2>{title}</h2>
                        {
                            blog.userId === auth._id ?
                                <div >
                                    <button className='blog-edit-del-btns' onClick={handleEditBlog}><FontAwesomeIcon icon="fa-solid fa-pen-to-square" className='icon' size="xl" /></button>
                                    <button className='blog-edit-del-btns' onClick={handleDeleteBlog}><FontAwesomeIcon icon="fa-solid fa-trash-can" className='icon' size="xl" /></button>
                                </div>
                                :
                                null
                        }
                    </div>
                    <div className="blog-modal-description">
                        <pre className='pre-description'>{description}</pre>
                    </div>
                </React.Fragment> :
                <React.Fragment>
                    <div className="blog-div-title" style={{ borderRadius: "1rem 1rem 0 0" }}>
                        <input
                            className="input-blog"
                            name="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <button onClick={() => { setEditBlog(prev => !prev) }} className="blog-edit-del-btns" ><FontAwesomeIcon icon="fa-solid fa-xmark" className='icon' size='2xl' /></button>
                    </div>
                    <div className="blog-modal-description">
                        <textarea
                            className="input-textarea-blog-div"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        >
                        </textarea><br />
                        <button onClick={handleEditBlogSubmit} className="saveBlog" style={{ marginTop: "0" }}>update</button>
                    </div>
                </React.Fragment>
            }
            <h4 className='modal-comment-header'>Comments:</h4>
            <Comment currentBlogID={blog._id} />
        </div>
    )
}