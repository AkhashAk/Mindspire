const blogdb = require("../database/blogDB");

const getAllBlogs = async (req, res) => {
  try {
    const getAllBlogs = await blogdb.getAllBlogs();
    res.send(getAllBlogs);
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};
const getBlog = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    if (!id) {
      res.status(400).send({
        status: "FAILED",
        data: { error: "Blog ID can not be empty!" },
      });
    }
    const blog = await blogdb.getBlog(id);
    res.send(blog);
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};
const createNewBlog = async (req, res) => {
  const { body } = req;
  if (
    !body.title ||
    !body.description
  ) {
    res.status(400).send({
      status: "FAILED",
      data: {
        error: "Request body missing some of the properties",
      },
    });
    return;
  }
  try {
    const blog = {
      userId: req.user.id,
      title: body.title,
      description: body.description
    };
    const newBlog = await blogdb.createNewBlog(blog);
    res.status(201).send(newBlog);
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};
const updateBlog = async (req, res) => {
  try {
    if (!req.params.id) {
      res.status(400).send({
        status: "FAILED",
        data: { error: "Blog ID can not be empty!" },
      });
    }
    const updatedBlog = await blogdb.updateBlog(req);
    res.status(202).send(updatedBlog);
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};
const deleteBlog = async (req, res) => {
  const {
    params: { id },
  } = req;
  if (!id) {
    res
      .status(400)
      .send({ status: "FAILED", data: { error: "Email ID can not be empty!" } });
  }
  try {
    const deletedBlog = await blogdb.deleteBlog(req);
    res
      .status(200)
      .send({ status: "SUCCESS", deletedBlog: deletedBlog });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const getAllBlogComments = async (req, res) => {
  try {
    const retrivedComments = await blogdb.getAllBlogComments(req);
    res.status(200).send(retrivedComments);
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
}

const createNewComment = async (req, res) => {
  try {
    const addedComment = await blogdb.createComment(req);
    res
      .status(200)
      .send(addedComment);
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
}

const updateComment = async (req, res) => {
  try {
    const updatedComment = await blogdb.updateComment(req);
    res
      .status(200)
      .send(updatedComment);
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
}

const deleteComment = async (req, res) => {
  const {
    params: { id },
  } = req;
  if (!id) {
    res
      .status(400)
      .send({ status: "FAILED", data: { error: "Blog ID can not be empty!" } });
  }
  try {
    const deleteComment = await blogdb.deleteComment(req);
    res
      .status(200)
      .send({ status: "SUCCESS", deleteComment: deleteComment });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
}

const like = async (req, res) => {
  try {
    const result = await blogdb.like(req);
    res
      .status(200)
      .send({ status: "SUCCESS", result: result });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
}
const unlike = async (req, res) => {
  try {
    const result = await blogdb.unlike(req);
    res
      .status(200)
      .send({ status: "SUCCESS", result: result });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
}
const dislike = async (req, res) => {
  try {
    const result = await blogdb.dislike(req);
    res
      .status(200)
      .send({ status: "SUCCESS", result: result });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
}
const undislike = async (req, res) => {
  try {
    const result = await blogdb.undislike(req);
    res
      .status(200)
      .send({ status: "SUCCESS", result: result });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
}

module.exports = {
  getAllBlogs,
  getBlog,
  createNewBlog,
  updateBlog,
  deleteBlog,
  getAllBlogComments,
  createNewComment,
  updateComment,
  deleteComment,
  like,
  unlike,
  dislike,
  undislike
};