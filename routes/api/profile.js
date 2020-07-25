const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");

// @route  GET /api/profile/me
// @desc   Get current users profile
// @access Private

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", "name");
    res.json(profile);
  } catch (error) {
    console.log(error.message);
    return res.json(500).send("Server error");
  }
});

// @route  GET /api/profile/user/:userId
// @desc   Get profile by user id
// @access Pulic
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    })
      .populate("user", "name")
      .populate("post");

    if (!profile) {
      return res.status(400).json({ msg: "Профиль не найден" });
    }

    return res.json(profile);
  } catch (error) {
    console.log(error.message);
    if (error.kind == "ObjectId") {
      return res.status(400).json({ msg: "Профиль не найден" });
    }
    return res.json(500).send("Server error");
  }
});

// @route  DELETE api/profile
// @desc   Delete profile, user & post
// @access Private
router.delete("/", auth, async (req, res) => {
  try {
    // Remove user posts
    await Post.deleteMany({ user: req.user.id });
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    return res.json({ msg: "Пользователь удален" });
  } catch (error) {
    console.log(error.message);
    return res.json(500).send("Server error");
  }
});

module.exports = router;
