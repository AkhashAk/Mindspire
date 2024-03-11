import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from 'react-spinner-material';
import { authorizedUser } from '../features/userSlice';
import { useSelector } from 'react-redux';
import { axiosJWT } from './http-common';
import { showToast } from '../utils/toast';

export const Comment = ({ currentBlogID }) => {

    const auth = useSelector(authorizedUser);
    const [isLoading, setIsLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [commentStatus, setCommentStatus] = useState({});
    const [editComment, setEditComment] = useState(false);
    const [currentComment, setCurrentComment] = useState({});

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            if (newComment === null || newComment === "") return showToast("WARNING", "Comment cannot be empty!");
            let updatedNewComment = {
                id: uuidv4(),
                name: auth?.name || "Anonymous",
                emailID: auth?.emailID || "",
                comment: newComment,
                likes: 0,
                dislikes: 0
            };

            // console.log("New comment = ", updatedNewComment);

            await axiosJWT.post(`${currentBlogID}/comments`, updatedNewComment, {
                headers: {
                    authorization: "Bearer " + auth.token
                },
            })
                .then((response) => {
                    // console.log(response.data, typeof (response.data), comments);
                    setComments((preComments) => [...(preComments ? preComments : []), response.data]);
                    setCommentStatus((prevStatus) => ({ ...prevStatus, [response.data._id]: { liked: false, disliked: false } }));
                    setNewComment("");
                }).catch(err => {
                    return showToast("ERROR", "Something went wrong! Try again later");
                })
        } catch (error) {
            showToast("ERROR", error?.message || error);
        }
    }

    const handleLike = async (comment) => {
        let likes1 = comment.likes;
        let dislikes1 = comment.dislikes;
        if (commentStatus[comment._id].liked) {
            // If already liked, remove the like
            await axiosJWT.post(`${currentBlogID}/comments/unlike`, { commentId: comment._id }, {
                headers: {
                    authorization: "Bearer " + auth.token
                },
            });
            likes1 -= 1;
        } else {
            // If not liked, add a like
            await axiosJWT.post(`${currentBlogID}/comments/like`, { commentId: comment._id }, {
                headers: {
                    authorization: "Bearer " + auth.token
                },
            });
            likes1 += 1;
            if (commentStatus[comment._id].disliked) {
                await axiosJWT.post(`${currentBlogID}/comments/undislike`, { commentId: comment._id }, {
                    headers: {
                        authorization: "Bearer " + auth.token
                    },
                });
                dislikes1 -= 1;
            }
        }
        setComments((prevComments) => prevComments.map((c) => (c._id === comment._id ? { ...c, likes: likes1, dislikes: dislikes1 } : c)));
        setCommentStatus((prevStatus) => ({ ...prevStatus, [comment._id]: { liked: !commentStatus[comment._id].liked, disliked: false } }));
    }

    const handleDisLike = async (comment) => {
        let likes2 = comment.likes;
        let dislikes2 = comment.dislikes;
        if (commentStatus[comment._id].disliked) {
            await axiosJWT.post(`${currentBlogID}/comments/undislike`, { commentId: comment._id }, {
                headers: {
                    authorization: "Bearer " + auth.token
                },
            });
            dislikes2 -= 1;
        } else {
            // If not disliked, add the dislike
            await axiosJWT.post(`${currentBlogID}/comments/dislike`, { commentId: comment._id }, {
                headers: {
                    authorization: "Bearer " + auth.token
                },
            });
            dislikes2 += 1;
            if (commentStatus[comment._id].liked) {
                await axiosJWT.post(`${currentBlogID}/comments/unlike`, { commentId: comment._id }, {
                    headers: {
                        authorization: "Bearer " + auth.token
                    },
                });
                likes2 -= 1;
            }
        }
        setComments((prevComments) => prevComments.map((c) => (c._id === comment._id ? { ...c, likes: likes2, dislikes: dislikes2 } : c)));
        setCommentStatus((prevStatus) => ({ ...prevStatus, [comment._id]: { liked: false, disliked: !commentStatus[comment._id].disliked } }));
    }

    const handleDeleteComment = async (c) => {
        try {
            await axiosJWT.delete(`${currentBlogID}/comments/${c._id}`, {
                headers: {
                    authorization: "Bearer " + auth.token
                },
            });
            const updatedComments = comments.filter(cmt => cmt._id !== c._id);
            setComments(preValues => preValues = updatedComments);
        } catch (error) {
            showToast("ERROR", "Something went wrong! Try again later");
            console.log("Error deleting comment: ", error.message);
        }
    }

    const handleEdit = (comment) => {
        setCurrentComment(comment);
        setEditComment(preValue => !preValue);
    }

    const handleEditComment = async (comment) => {
        try {
            // console.log("Current Comment = ", currentComment);
            if (currentComment.comment === "") return showToast("ERROR", "Comment cannot be empty!");
            if (currentComment.comment === comment.comment) return showToast("WARNING", "Do some changes to update");
            await axiosJWT.put(`${currentBlogID}/comments/${currentComment._id}`, currentComment)
                .then((response) => {
                    console.log("1 Response after comment update = ", response, comments);
                })
                .catch((error) => {
                    return showToast("ERROR", error?.message || error)
                });
            // console.log("2 Response after comment update = ", currentComment, comments);
            setCurrentComment({});
            setEditComment(preVal => !preVal);
            setComments((preComments) =>
                preComments.map((cmt) =>
                    cmt._id === currentComment._id ? { ...cmt, comment: currentComment.comment } : cmt
                )
            );
        } catch (error) {
            console.log(error);
            showToast("ERROR", error?.message || error);
        }
    }

    useEffect(() => {
        const fetchComments = async () => {
            const retrivedComments = await axiosJWT.get(`${currentBlogID}/comments`, {
                headers: {
                    authorization: "Bearer " + auth.token
                },
            });
            // console.log("retrivedComments = ", retrivedComments);
            setComments(retrivedComments.data);

            const initialStatus = {};
            retrivedComments.data.forEach((comment) => {
                initialStatus[comment._id] = { liked: false, disliked: false };
            });
            setCommentStatus(initialStatus);
            setIsLoading(preValue => !preValue);
        }
        fetchComments();
    }, [])

    return (
        <div className='comments-container'>
            {isLoading ?
                <div>
                    <div className='centered'>
                        <Spinner radius={60} color={"#333"} stroke={2} visible={isLoading} />
                    </div>
                </div> :
                (!isLoading && comments && comments.length > 0) ?
                    <div>
                        <ul className='comments'>
                            {
                                comments.map((comment, index) =>
                                    <li key={index}>
                                        {(editComment && currentComment && ((currentComment?._id) === comment._id)) ? (
                                            <div className='single-comment'>
                                                <div className='single-comment-key'>
                                                    <p>{comment.name === auth?.name ? `${comment.name} (You)` : comment.name}</p>
                                                    <div>
                                                        <button className='blog-edit-del-btns' onClick={() => { handleEdit(comment) }}>
                                                            <FontAwesomeIcon icon="fa-solid fa-pen-to-square" className='icon' size="xl" />
                                                        </button>
                                                        <button className='blog-edit-del-btns' onClick={() => { handleDeleteComment(comment) }}>
                                                            <FontAwesomeIcon icon="fa-solid fa-trash-can" className='icon' size="xl" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", paddingRight: "1rem" }}>
                                                    <textarea
                                                        style={{
                                                            width: "100%",
                                                            marginLeft: "1rem",
                                                            marginRight: "1rem",
                                                            fontSize: "1.2em"
                                                        }}
                                                        className="input-post input-textarea-post"
                                                        type="text"
                                                        value={currentComment.comment}
                                                        onChange={(e) => setCurrentComment({ ...currentComment, comment: e.target.value })}
                                                        placeholder="Enter your comment"
                                                    />
                                                    <div>
                                                        <button onClick={() => { handleEditComment(comment) }} className="saveBlog"
                                                            style={{
                                                                fontSize: "14px",
                                                                fontWeight: 0,
                                                                margin: 0,
                                                                minHeight: 0
                                                            }}><FontAwesomeIcon icon="fa-solid fa-check" size="xl" /></button>
                                                    </div>
                                                </div>
                                                <div className='box'>
                                                    <div className={commentStatus[comment._id].liked ? "liked" : ""} style={{ padding: "0.2rem" }}>
                                                        <span onClick={() => handleLike(comment)}>&#128077; {comment.likes}</span>
                                                    </div>
                                                    <div className={commentStatus[comment._id].disliked ? "disliked" : ""} style={{ padding: "0.2rem" }}>
                                                        <span onClick={() => handleDisLike(comment)}>&#128078; {comment.dislikes}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className='single-comment'>
                                                <div className='single-comment-key'>
                                                    {console.log(comment, auth)}
                                                    <p>{comment.name === auth?.name ? `${comment.name} (You)` : comment.name}</p>
                                                    {
                                                        comment.emailID === auth?.emailID ?
                                                            <div>
                                                                <button className='blog-edit-del-btns' onClick={() => { handleEdit(comment) }}>
                                                                    <FontAwesomeIcon icon="fa-solid fa-pen-to-square" className='icon' size="xl" />
                                                                </button>
                                                                <button className='blog-edit-del-btns' onClick={() => { handleDeleteComment(comment) }}>
                                                                    <FontAwesomeIcon icon="fa-solid fa-trash-can" className='icon' size="xl" />
                                                                </button>
                                                            </div>
                                                            :
                                                            <></>
                                                    }
                                                </div>
                                                <div className='span-comment'>
                                                    <span>{comment.comment}</span>
                                                </div>
                                                <div className='box'>
                                                    <div className={commentStatus[comment._id].liked ? "liked" : ""} style={{ padding: "0.2rem" }}>
                                                        <span onClick={() => handleLike(comment)}>&#128077; {comment.likes}</span>
                                                    </div>
                                                    <div className={commentStatus[comment._id].disliked ? "disliked" : ""} style={{ padding: "0.2rem" }}>
                                                        <span onClick={() => handleDisLike(comment)}>&#128078; {comment.dislikes}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </li>
                                )
                            }
                        </ul>
                    </div> :
                    <div>
                        <div className='centered'>
                            <h4>No comments yet!</h4>
                        </div>
                    </div>
            }
            <ul className='comments'>
                <li>
                    <form className='commentForm' onSubmit={handleSubmit}>
                        <textarea
                            className="input-blog input-comment-textarea"
                            name="comment"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment...">
                        </textarea>
                        <button type='submit' className='saveComment'>
                            comment
                        </button>
                    </form>
                </li>
            </ul>
        </div>
    )
}