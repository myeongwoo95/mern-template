const { User } = require("../models/User");

let auth = (req, res, next) => {
  // 1. 쿠키에서 토큰을 추출
  let token = req.cookies.x_auth;

  // 2. 토큰을 복호화하여 userID를 추출 (복화할때 시크릿키는 서버측에만 가지고 있음으로 복호화 자체만으로 인증은 OKAY
  User.findByToken(token)
    .then((user) => {
      // 유저가 없다면 인증실패
      if (!user) {
        return res.json({
          isAuth: false,
          error: true,
        });
      }

      // 유저가 있다면 인증성공
      // request에 토큰과 user를 넣어준다. 그러면 controller에서 토큰과 user를 쉽게 가져올 수 있음
      req.token = token;
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = { auth };
