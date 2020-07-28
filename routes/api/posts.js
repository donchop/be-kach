const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { body, validationResult } = require("express-validator");

const Post = require("../../models/Post");
const User = require("../../models/User");
const Profile = require("../../models/Profile");

// @route  POST api/posts
// @desc   Create post
// @access Private
router.post(
  "/",
  [
    auth,
    [
      body("title", "Введите название программы").notEmpty(),
      body("imgUrl", "Введите ссылку на картинку").notEmpty(),
      body("text", "Введите описание программы").notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        title: req.body.title,
        imgUrl: req.body.imgUrl,
        name: user.name,
        text: req.body.text,
        user: req.user.id,
      });

      const post = await newPost.save();

      return res.json(post);
    } catch (error) {
      console.log(error.message);
      return res.json(500).send("Server error");
    }
  }
);
// @route  PUT api/posts/:id
// @desc   Edit post
// @access Private
router.put(
  "/:id",
  [
    auth,
    [
      body("title", "Введите название программы").notEmpty(),
      body("imgUrl", "Введите ссылку на картинку").notEmpty(),
      body("text", "Введите описание программы").notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const post = await Post.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true }
      );

      return res.json(post);
    } catch (error) {
      console.log(error.message);
      return res.json(500).send("Server error");
    }
  }
);

// @route  GET api/posts
// @desc   Get All Posts
// @access Public
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    return res.json(posts);
  } catch (error) {
    console.log(error.message);
    return res.json(500).send("Server error");
  }
});

// @route  GET api/posts/:id
// @desc   Get Post by id
// @access Public
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Страница не найдена" });
    }

    return res.json(post);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Страница не найдена" });
    }
    return res.json(500).send("Server error");
  }
});

// @route  DELETE api/posts/:id
// @desc   DELETE POST
// @access Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Страница не найдена" });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Пользователь не авторизован" });
    }

    await post.remove();

    return res.json({ msg: "Пост удален" });
  } catch (error) {
    console.log(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Страница не найдена" });
    }
    return res.json(500).send("Server error");
  }
});

// @route  POST api/posts/comment/:id
// @desc   Add comment to post
// @access Private
router.post(
  "/comment/:id",
  [auth, [body("text", "Комментарий не может быть пустым").notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        user: req.user.id,
        name: user.name,
      };

      post.comments.unshift(newComment);

      await post.save();

      return res.json(post.comments);
    } catch (error) {
      console.log(error.message);
      return res.json(500).send("Server error");
    }
  }
);

// @route  POST api/posts/comment/:id/:comment_id
// @desc   Delete comment from post
// @access Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    // Make sure comment exist
    if (!comment) {
      return res.status(404).json({ msg: "Комментария не существует" });
    }
    // Check user

    if (comment.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: "Пользователь не авторизован" });
    }

    //Get remove index
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    return res.json(post.comments);
  } catch (error) {
    console.log(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Страница не найдена" });
    }
    return res.json(500).send("Server error");
  }
});

module.exports = router;
