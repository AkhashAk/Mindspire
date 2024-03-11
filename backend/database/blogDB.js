const Blog = require("./blogModal");

const getAllBlogs = async () => {
  try {
    const result = await Blog.find({});
    return result;
  } catch (err) {
    throw err;
  }
};

const getBlog = async (id) => {
  try {
    const retrivedBlog = await Blog.findOne({ _id: id });
    if (!retrivedBlog) {
      return ({
        status: 404,
        message: `Blog not found`,
      });
    }
    return retrivedBlog;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

const createNewBlog = async (newBlog) => {
  try {
    // const isPresent = DB.posts.findIndex((post) => post.postName == newBlog.postName) > -1;
    const isBlogPresent = await Blog.findOne({ _id: newBlog._id });
    if (isBlogPresent) {
      return ({
        status: 400,
        message: `Blog with id ${newBlog._id} already exists`,
      });
    }
    // DB.posts.push(newBlog);
    const createdBlog = await Blog.create(newBlog);
    return createdBlog;
  } catch (error) {
    console.log(error);
    throw { status: 500, message: error?.message || error };
  }
};

const updateBlog = async (req) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) {
      throw { message: "Blog not found" };
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return updatedBlog;
  } catch (error) {
    throw { status: 500, message: error?.message || error };
  }
};

const deleteBlog = async (req) => {
  try {
    // const retrivedBlog = DB.posts.findIndex((post) => post._id == id);
    const post = await Blog.findById(req.params.id);
    if (!post) {
      throw {
        status: 404,
        message: `Blog doesn't exist`,
      };
    }

    const deletedBlog = await Blog.findByIdAndDelete(req.params.id, { new: true });
    return deletedBlog;
  } catch (error) {
    throw { status: 500, message: error?.message || error };
  }
};

const getAllBlogComments = async (req) => {
  const blogId = req.params.id;
  try {
    const foundBlog = await Blog.findOne({ _id: blogId });
    if (!foundBlog) {
      throw { message: `Blog with ID ${blogId} doesn't exist` };
    }
    return foundBlog.comments;
  } catch (error) {
    throw { status: 500, message: error?.message || error };
  }
}

const createComment = async (req) => {
  const blogId = req.params.id;
  const newComment = req.body;

  try {
    await Blog.updateOne(
      { _id: blogId },
      { $push: { comments: newComment } },
      { new: true }
    )
      .then(result => {
        console.log('New comment added successfully:', result);
      })
      .catch(err => {
        console.error('Error adding new comment:', err);
      });
    const addedComment = await Blog.findOne({ _id: blogId });
    return addedComment.comments.find(cmt => cmt.id == newComment.id);
  } catch (error) {
    throw { status: 500, message: error?.message || error };
  }
}

const updateComment = async (req) => {

  // Specify the new comment data
  const { id, commentId } = req.params;
  try {
    const updatedComment = await Blog.updateOne(
      { "_id": id, "comments._id": commentId },
      { $set: { "comments.$.comment": req.body.comment } }
    )
      .then(result => {
        console.log('Comment updated successfully:', result);
      })
      .catch(err => {
        console.error('Error updating comment:', err);
      });

    const foundBlog = await Blog.findOne({ _id: id });
    if (!foundBlog) {
      throw { message: `Blog with ID ${id} doesn't exist` };
    }
    return foundBlog.comments;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw { status: 500, message: error?.message || error };
  }
}

const deleteComment = async (req) => {
  const blogId = req.params.id;
  const commentId = req.params.commentId;
  try {
    Blog.updateOne(
      { _id: blogId },
      { $pull: { comments: { _id: commentId } } },
      { new: true } // To get the updated document
    )
      .then((updatedBlog) => {
        if (!updatedBlog) {
          console.log('Blog not found');
          return;
        }
        console.log('Comment deleted successfully:', updatedBlog);
      })
      .catch((error) => {
        console.error('Error deleting comment:', error);
      });
    return { status: 200 };
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw { status: 500, message: error?.message || error };
  }
}
const like = async (req) => {
  const blogId = req.params.id;

  // Specify the new comment data
  const { commentId } = req.body;

  try {
    const updatedComment = await Blog.updateOne(
      { _id: blogId, 'comments._id': commentId },
      { $inc: { "comments.$.likes": 1 } }
    ).then(result => {
      console.log('Comment updated successfully:', result);
    })
      .catch(err => {
        console.error('Error updating comment:', err);
      });
    return updatedComment;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw { status: 500, message: error?.message || error };
  }
}
const unlike = async (req) => {
  const blogId = req.params.id;

  // Specify the new comment data
  const { commentId } = req.body;

  try {
    const updatedComment = await Blog.updateOne(
      { _id: blogId, 'comments._id': commentId },
      { $inc: { "comments.$.likes": -1 } }
    ).then(result => {
      console.log('Comment updated successfully:', result);
    })
      .catch(err => {
        console.error('Error updating comment:', err);
      });
    return updatedComment;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw { status: 500, message: error?.message || error };
  }
}
const dislike = async (req) => {
  const blogId = req.params.id;

  // Specify the new comment data
  const { commentId } = req.body;

  try {
    const updatedComment = await Blog.updateOne(
      { _id: blogId, 'comments._id': commentId },
      { $inc: { "comments.$.dislikes": 1 } }
    ).then(result => {
      console.log('Comment updated successfully:', result);
    })
      .catch(err => {
        console.error('Error updating comment:', err);
      });
    return updatedComment;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw { status: 500, message: error?.message || error };
  }
}
const undislike = async (req) => {
  const blogId = req.params.id;

  // Specify the new comment data
  const { commentId } = req.body;

  try {
    const updatedComment = await Blog.updateOne(
      { _id: blogId, 'comments._id': commentId },
      { $inc: { "comments.$.dislikes": -1 } }
    ).then(result => {
      console.log('Comment updated successfully:', result);
    })
      .catch(err => {
        console.error('Error updating comment:', err);
      });
    return updatedComment;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw { status: 500, message: error?.message || error };
  }
}

module.exports = {
  getAllBlogs,
  getBlog,
  createNewBlog,
  updateBlog,
  deleteBlog,
  getAllBlogComments,
  createComment,
  updateComment,
  deleteComment,
  like,
  unlike,
  dislike,
  undislike
};