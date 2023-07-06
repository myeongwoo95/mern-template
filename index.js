// models
const { User } = require("./models/User");

// express.js
const express = require("express");
const app = express();
const port = 5000;

// body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true })); // x-www-form-urlencoded를 받을 수 있게 설정
app.use(bodyParser.json()); // json를 받을 수 있게 설정

// mongoDB
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://root:1234@localhost:27017/?authMechanism=DEFAULT")
  .then(() => console.log("MongoDB에 연결되었습니다."))
  .catch((error) => console.log("MongoDB 연결에 실패했습니다.", error));

// controller
app.listen(port, () => console.log(`Express app listening on port ${port}!`));

app.get("/", (req, res) => res.send("Hello world!!!!!"));

app.post("/register", (req, res) => {
  const user = new User(req.body);

  user
    .save()
    .then((userInfo) => {
      res.json({
        success: true,
        userInfo,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        success: false,
        err,
      });
    });
});
