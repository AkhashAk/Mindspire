import { useSelector } from "react-redux"
import { selectBlogById } from "../../features/blogsSlice"
import { Link } from "react-router-dom";

const BlogExcerpts = ({ blogId }) => {
    const blog = useSelector(state => selectBlogById(state, blogId));

    return (
        <Link className="blog-container" to={`blog/${blogId}`}>
            <div className="blog-card">
                <h2 className="blog-title">{blog.title}</h2>
                <div className="expandable-div">
                    <pre className="pre-des">
                        {blog.description.slice(0, 275)}<strong><i>...read more</i></strong>
                    </pre>
                </div>
            </div>
        </Link>
    )
}

export default BlogExcerpts