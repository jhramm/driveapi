const mongoose = require("mongoose");

const BlogsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: new Date(),
  },
  uploadedBy: {
    type: String,
    required: true,
  },
  pupilId: {
    type: String,
    required: true,
  },
  likes: [
    {
      userId: {
        type: String  
      },
      liked: {
        type: Boolean
      }
    },
  ],
  
  comments: [
    {
      userId: {
        type: String,
      },
      userName: {
        type: String,
      },
      comment: {
        type: String,
      },
      uploadedAt: {
        type: Date,
        default: new Date(),
      },
    },
  ],
  image: {
    type: String,
    required: true,
  },
});

let Blogs = new mongoose.model("blogs", BlogsSchema);
module.exports = Blogs;
