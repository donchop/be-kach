const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");
const { body, validationResult } = require("express-validator");

const User = require("../../models/User");
const Profile = require("../../models/Profile");

// @router POST /api/auth/register
// @desc Register user & get token
// @access Public
router.post(
  "/register",
  [
    body("name", "Введите имя").notEmpty(),
    body("email", "Пожалуйста введите корректный email").isEmail(),
    body("password", "Пароль должен состоять из 6 и более символов").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); 
    }

    const { name, email, password } = req.body;

    try {
      const candidate = await User.findOne({ email });

      if (candidate) {
        return res
          .status(400)
          .json({ msg: "Такой пользователь уже существует" });
      }

      user = new User({ name, email, password });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const profilefields = { user: user._id };
      profile = new Profile(profilefields);
      await profile.save();

      const payload = { user: { id: user.id } };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// @router POST /api/auth/login
// @desc Authenticated user & get token
// @access Public
router.post(
  "/login",
  [
    body("email", "Пожалуйста введите корректный email").isEmail(),
    body("password", "Пожалуйста введите пароль").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Неверные учетные данные" }] });
      }
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Неверные учетные данные" }] });
      }

      const payload = { user: { id: user.id } };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    GET api/auth
// @desc     Get user by token
// @access   Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
