import '../App.css';
import React, { useState } from "react";
import { Navbar } from "./Navbar.js";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { showToast } from "../utils/toast.js";
import Spinner from 'react-spinner-material';
import { useDispatch, useSelector } from 'react-redux';
import { authorizedUser } from '../features/userSlice.js';
import { addNewBlog } from '../features/blogsSlice.js';

export default function AddBlog() {
    const dispatch = useDispatch();
    const auth = useSelector(authorizedUser);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (title === "" || title === null || description === "" || description === null) return showToast("ERROR", "Input all the required fields");
        try {
            dispatch(addNewBlog({
                id: uuidv4(),
                title,
                description,
                userId: auth._id || "Unknown Author"
            })).unwrap();
            setIsLoading(preValue => !preValue);
            showToast("SUCCESS", "Created successfully");
            navigate("/");
        } catch (error) {
            console.error('Error creating blog:', error);
            showToast("ERROR", "Error occured. Please try again later");
        }
        setTitle('');
        setDescription('');
    }

    return (
        <React.Fragment>
            <Navbar />
            {isLoading ?
                <div>
                    <div className='centered-div'>
                        <Spinner radius={60} color={"#333"} stroke={2} visible={isLoading} />
                        <h2 style={{ color: "#274a9c", marginTop: "2rem" }}>Navigating back to homepage...</h2>
                    </div>
                </div> :
                <div className="form-div">
                    <form className='createForm' onSubmit={handleSubmit}>
                        <h2>Get started with creating a blog!</h2>
                        <input
                            className="input-blog input-shadow"
                            name="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter title..."
                        />
                        <textarea
                            className="input-blog input-textarea-blog input-shadow"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Start typing...">
                        </textarea>
                        <button type="submit" className="saveBlog" >Create</button>
                    </form>
                </div>
            }
        </React.Fragment>
    )
}