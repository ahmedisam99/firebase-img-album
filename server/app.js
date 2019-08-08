const { join } = require("path");
const express = require("express");
const morgan = require("morgan");

const app = express();

app.set("port", process.env.PORT || 3333);

app.use(morgan("dev"));
app.use(express.static(join(__dirname, "..", "build")));

app.use("*", (req, res) =>
  res.sendFile(join(__dirname, "..", "build", "index.html"))
);

app.use((err, req, res, next) => {
  console.log({ err });
  res.status(500).send("Internal Server Error");
});

module.exports = app;
