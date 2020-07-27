const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  title: { type: String, required: true },
  imgUrl: { type: String, required: true },
  text: { type: String, required: true },
  comments: [
    {
      user: { type: mongoose.Types.ObjectId, ref: "User" },
      name: { type: String, required: true },
      text: { type: String, required: true },
      date: { type: Date, default: Date.now() },
    },
  ],
  date: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Post", PostSchema);
