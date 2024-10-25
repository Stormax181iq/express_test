const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const PORT = 3000;
const { adminAuth, userAuth } = require("./middleware/auth");

app.use(express.json());
app.use("/api/Auth", require("./Auth/Route"));
app.use(cookieParser());

app.get("/admin", adminAuth, (req, res) => res.send("Admin route"));
app.get("/basic", userAuth, (req, res) => res.send("User route"));

const server = app.listen(PORT, () => {
  console.log(`Server connected to port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`An error occurred: ${err.message}`);
  server.close(() => process.exit(1));
});
// TODO stop at https://www.loginradius.com/blog/engineering/guest-post/nodejs-authentication-guide/#refactor-the-login-function
