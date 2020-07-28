const express = require("express");
const mongoose = require("mongoose");
const config = require("config");

const app = express();

app.use(express.json({ extended: false }));

app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/exercises", require("./routes/api/exercises"));

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await mongoose.connect(config.get("mongoUri"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    app.listen(PORT, () => {
      console.log(`Server has been started at ${PORT}`);
    });
  } catch (e) {
    console.log("Server error", e.message);
    process.exit(1);
  }
}

start();
