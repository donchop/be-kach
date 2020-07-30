const mongoose = require("mongoose");

const ExerciseSchema = mongoose.Schema({
  muscleGroup: { type: String, required: true },
  name: { type: String, required: true },
  video: { type: String, required: true },
  text: { type: String, required: true },
});

module.exports = mongoose.model("Exercise", ExerciseSchema);
