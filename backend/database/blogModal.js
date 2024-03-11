const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    title: {
      type: String,
      required: [true, "Please enter a title"],
    },
    description: {
      type: String,
      required: true,
    },
    comments: [{
      "id": String,  // Universally Unique Identifier
      "name": String,
      "emailID": String,
      "comment": String,
      "likes": Number,
      "dislikes": Number
    }]
  }, {
    timestamps: true
  },
  { versionKey: false }
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;