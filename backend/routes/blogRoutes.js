const express = require("express");
const blogController = require("../controllers/blogController");
const { authUser } = require("../middleware/authUser");
const router = express.Router();

router.get("/", blogController.getAllBlogs);

router.get("/:id", authUser, blogController.getBlog);

router.post("/", authUser, blogController.createNewBlog);

router.put("/:id", authUser, blogController.updateBlog);

router.delete("/:id", authUser, blogController.deleteBlog);

router.get("/:id/comments", authUser, blogController.getAllBlogComments);
router.post("/:id/comments", authUser, blogController.createNewComment); 
router.put("/:id/comments/:commentId", authUser, blogController.updateComment);
router.delete("/:id/comments/:commentId", authUser, blogController.deleteComment);
router.post("/:id/comments/like", authUser, blogController.like);
router.post("/:id/comments/unlike", authUser, blogController.unlike);
router.post("/:id/comments/dislike", authUser, blogController.dislike);
router.post("/:id/comments/undislike", authUser, blogController.undislike);

module.exports = router;