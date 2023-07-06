const mongoose = require("mongoose");

// 1. 스키마 정의
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },

  email: {
    type: String,
    trim: true,
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

// 2. 모델 정의(스키마를 감싸주는 역할)
const User = mongoose.model("User", userSchema);

// 3. 모델을 다른 곳에서 사용할 수 있도록 export
module.exports = { User };
