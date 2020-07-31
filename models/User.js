const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, uniq: true },
  password: { type: String, required: true },
  fullRights: { type: Boolean, default: false },
  date: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("User", UserSchema);
