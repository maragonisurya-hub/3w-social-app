const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  username: String,
  text: String,
  image: String,
  likes: [String],
  comments: [
    {
      username: String,
      text: String
    }
  ]
});

module.exports = mongoose.model("Post", postSchema);