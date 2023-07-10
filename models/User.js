const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10; // salt 길이
const jwt = require("jsonwebtoken");
const config = require("../config/key");

// 1. 스키마 정의
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },

  email: {
    type: String,
    trim: true, // 공백 제거
    unique: 1,
  },

  password: {
    type: String,
    minlength: 5,
  },

  lastName: {
    type: String,
    maxlength: 50,
  },

  role: {
    type: Number,
    default: 0,
  },

  image: {
    type: String,
  },

  token: {
    type: String,
  },

  tokenExp: {
    type: Number,
  },
});

//비밀번호 암호화
userSchema.pre("save", function (next) {
  let user = this;

  // 모든 save에 실행하는 것이 아닌, password가 변경될 때만 실행
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

// plainPassword가 encoded password와 동일한지 비교
userSchema.methods.comparePassword = function (plainPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
      if (err) {
        reject(err);
      } else {
        resolve(isMatch);
      }
    });
  });
};

// jwt 생성
userSchema.methods.generateToken = function () {
  const user = this;
  const token = jwt.sign({ userId: user._id.toHexString() }, config.SECRET_KEY);
  user.token = token;
  return user.save().then(() => token);
};

// jwt 복호화
userSchema.methods.findByToken = function (token) {
  return new Promise((resolve, reject) => {
    let user = this;

    jwt.verify(token, config.SECRET_KEY, function (err, decoded) {
      user.findOne({ _id: decoded, token: token }, function (err, user) {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      });
    });
  });
};

// 2. 모델 정의(스키마를 감싸주는 역할)
const User = mongoose.model("User", userSchema);

// 3. 모델을 다른 곳에서 사용할 수 있도록 export
module.exports = { User };
