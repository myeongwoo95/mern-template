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

// cookie-parser
const cookieParser = require("cookie-parser");

// config
const config = require("./config/key");

// mongoDB
const mongoose = require("mongoose");
mongoose
  .connect(config.MONGO_URL)
  .then(() => console.log("MongoDB에 연결되었습니다."))
  .catch((error) => console.log("MongoDB 연결에 실패했습니다.", error));

// controller
app.get("/", (req, res) => res.send("Hello world"));

// 회원가입
app.post("/api/users/register", (req, res) => {
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

app.post("/api/users/login", (req, res) => {
  // 1. 요청된 이메일을 DB에서 검색
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.json({
          loginSuccess: false,
          messsage: "제공된 이메일에 해당하는 유저가 없습니다.",
        });
      }

      // 2. 이메일이 DB에 존재한다면 pw 검증
      user
        .comparePassword(req.body.password)
        .then((isMatch) => {
          if (!isMatch) {
            return res.json({
              loginSuccess: false,
              messsage: "비밀번호가 틀렸습니다.",
            });
          } else {
            // 3. 올바른 pw라면 jwt 생성
            user
              .generateToken()
              .then((token) => {
                res
                  .cookie("x_auth", token) // F12 -> Application -> Storage -> Cookies에 저장된다.
                  .status(200)
                  .json({
                    loginSuccess: true,
                    userId: user._id,
                  });
              })
              .catch((err) => {
                console.error(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      return res.status(400).send(err);
    });
});

app.listen(port, () => {
  console.log(`Express app listening on port ${port}!`);
});
