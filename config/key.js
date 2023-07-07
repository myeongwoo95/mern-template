if (process.env.NODE_ENV === "production") {
  module.exports = require("./prod");
  console.log("production 모드로 동작중입니다...");
} else if (process.env.NODE_ENV === "development") {
  module.exports = require("./dev");
  console.log("Development 모드로 동작중입니다...");
} else if (process.env.NODE_ENV === "local") {
  module.exports = require("./local");
  console.log("Local 모드로 동작중입니다...");
}
