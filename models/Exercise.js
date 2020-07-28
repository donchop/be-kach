const mongoose = require("mongoose");

const ExerciseSchema = mongoose.Schema({
  muscleGroup: { type: String, required: true },
  name: { type: String, required: true },
  video: { type: String, required: true },
  text: { type: String, required: true },

  // chest: [
  //   {
  //     name: { type: String, required: true },
  //     video: { type: String, required: true },
  //     text: { type: String, required: true },
  //   },
  // ],
  // shoulders: [
  //   {
  //     name: { type: String, required: true },
  //     video: { type: String, required: true },
  //     text: { type: String, required: true },
  //   },
  // ],
  // back: [
  //   {
  //     name: { type: String, required: true },
  //     video: { type: String, required: true },
  //     text: { type: String, required: true },
  //   },
  // ],
  // biceps: [
  //   {
  //     name: { type: String, required: true },
  //     video: { type: String, required: true },
  //     text: { type: String, required: true },
  //   },
  // ],
  // triceps: [
  //   {
  //     name: { type: String, required: true },
  //     video: { type: String, required: true },
  //     text: { type: String, required: true },
  //   },
  // ],
  // forearm: [
  //   {
  //     name: { type: String, required: true },
  //     video: { type: String, required: true },
  //     text: { type: String, required: true },
  //   },
  // ],
  // legs: [
  //   {
  //     name: { type: String, required: true },
  //     video: { type: String, required: true },
  //     text: { type: String, required: true },
  //   },
  // ],
  // press: [
  //   {
  //     name: { type: String, required: true },
  //     video: { type: String, required: true },
  //     text: { type: String, required: true },
  //   },
  // ],
});

module.exports = mongoose.model("Exercise", ExerciseSchema);
