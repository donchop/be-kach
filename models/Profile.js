const mongoose = require("mongoose");

const ProfileSchema = mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User" },
  posts: { type: mongoose.Types.ObjectId, ref: "Post" },
  //avatar:{}, дописать аватар пользователя
  //calendar:{}, дописать календарь тренировок
  date: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Profile", ProfileSchema);
