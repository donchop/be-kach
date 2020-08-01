const expres = require("express");
const router = expres.Router();
const auth = require("../../middleware/auth");
const { body, validationResult } = require("express-validator");

const Exercise = require("../../models/Exercise");

// @route  POST api/exercises
// @desc   Create exercise
// @access PRIVATE
router.post(
  "/",
  [
    auth,
    [
      body(
        "muscleGroup",
        "Выберите к какой группе мышц относиться упражнение"
      ).notEmpty(),
      body("name", "Введите название упражнения").notEmpty(),
      body("video", "Введите ссылку на видео упражнения").notEmpty(),
      body("text", "Введите описание упражнения").notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      if (req.user.fullRigth) {
       return res.status(401).json({ msg: "Нет авторизации" });
      }
      if (
        ![
          "chest",
          "shoulders",
          "trapezius",
          "latissimus",
          "lowerback",
          "frontdelt",
          "middledelt",
          "reardelt",
          "biceps",
          "triceps",
          "forearm",
          "buttocks",
          "quadriceps",
          "bicepsfemoris",
          "calf",
          "press",
        ].includes(req.body.muscleGroup)
      ) {
        return res.status(400).json({
          msg: "Такой группы мышц не существует, выберите из существующих",
        });
      }
      const exercise = await new Exercise(req.body);
      await exercise.save();
      return res.json(exercise);
    } catch (error) {
      console.log(error.message);
      return res.json(500).send("Server error");
    }
  }
);

// @route  PUT api/exercises/:id
// @desc   Edit exercise
// @access PRIVATE
router.put(
  "/:id",
  [
    auth,
    [
      body(
        "muscleGroup",
        "Выберите к какой группе мышц относиться упражнение"
      ).notEmpty(),
      body("name", "Введите название упражнения").notEmpty(),
      body("video", "Введите ссылку на видео упражнения").notEmpty(),
      body("text", "Введите описание упражнения").notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      if (
        ![
          "chest",
          "shoulders",
          "trapezius",
          "latissimus",
          "lowerback",
          "frontdelt",
          "middledelt",
          "reardelt",
          "biceps",
          "triceps",
          "forearm",
          "buttocks",
          "quadriceps",
          "bicepsfemoris",
          "calf",
          "press",
        ].includes(req.body.muscleGroup)
      ) {
        return res.status(400).json({
          msg: "Такой группы мышц не существует, выберите из существующих",
        });
      }
      const exercise = await Exercise.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true }
      );

      return res.json(exercise);
    } catch (error) {
      if (error.kind === "ObjectId") {
        return res.status(404).json({ msg: "Страница не найдена" });
      }
      return res.json(500).send("Server error");
    }
  }
);

// @route  POST api/exercises/muscleGroup
// @desc   Get exercises by muscleGroup
// @access PUBLIC
router.get("/:muscleGroup", async (req, res) => {
  try {
    const exercises = await Exercise.find({
      muscleGroup: req.params.muscleGroup,
    });
    if (!exercises || exercises.length === 0) {
      return res
        .status(400)
        .json({ msg: "Для данной группы мышц - упражнений нет" });
    }

    return res.json(exercises);
  } catch (error) {
    console.log(error.message);
    return res.json(500).send("Server error");
  }
});

// @route  POST api/exercises/musclegroup/:id
// @desc   Get exercise by id
// @access PUBLIC
router.get("/musclegroup/:id", async (req, res) => {
  try {
    const exercises = await Exercise.findById(req.params.id);
    if (!exercises) {
      return res.status(404).json({ msg: "Страница не найдена" });
    }
    return res.json(exercises);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Страница не найдена" });
    }
    return res.json(500).send("Server error");
  }
});

// @route  POST api/exercises/:id
// @desc   Delete exercise
// @access PRIVATE
router.delete("/:id", auth, async (req, res) => {
  try {
    const exercises = await Exercise.findById(req.params.id);
    if (!exercises) {
      return res.status(404).json({ msg: "Страница не найдена" });
    }

    await exercises.remove();
    return res.json({ msg: "Упражнение удалено" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Страница не найдена" });
    }
    return res.json(500).send("Server error");
  }
});

module.exports = router;
