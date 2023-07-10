const { User } = require("../models/User");

let auth = (req, res, next) => {
  // 1. 쿠키에서 토큰을 추출
  // 2. 토큰을 복호화하여 userID를 추출 (복화할때 시크릿키는 서버측에만 가지고 있음으로 복호화 자체만으로 인증은 OKAY)
  // 3. userID로 유저가 DB 존재하는지 확인 -> 유저가 있다면 인증성공, 유저가 없다면 인증실패 // 이 로직은 없애도되지않나?

  let token = req.cookies.x_auth; // 1
  const user = User.findByToken(token); // 2
};

module.exports = { auth };
