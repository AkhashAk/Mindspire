import React, { useState } from "react";
import Spinner from "react-spinner-material";
import BlogExcerpts from "./BlogExcerpts.js";
import { useSelector } from "react-redux";
import { getBlogsStatus, selectBlogIds } from "../../features/blogsSlice.js";


export const Blogs = () => {
    const blogsId = useSelector(selectBlogIds);
    const isLoading = useSelector(getBlogsStatus);

    return (
        <React.Fragment>
            {isLoading === "loading" ?
                <div>
                    <div className='centered'>
                        <Spinner radius={90} color={"#333"} stroke={2} visible={isLoading} />
                    </div>
                </div> :
                blogsId.length > 0 ?
                    blogsId?.map((id, index) =>
                        <BlogExcerpts key={index} blogId={id} />
                    ) : (
                        <div className="blog-card">
                            <h1 style={{
                                textAlign: "center",
                                alignContent: "center"
                            }}>No content</h1>
                        </div>
                    )
            }
        </React.Fragment>
    )
}