// express.js
const express = require("express");
const app = express();
const port = 5000;

// mongoDB
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://root:1234@localhost:27017/?authMechanism=DEFAULT")
  .then(() => console.log("MongoDB에 연결되었습니다."))
  .catch((error) => console.log("MongoDB 연결에 실패했습니다.", error));

app.get("/", (req, res) => res.send("Hello world!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
