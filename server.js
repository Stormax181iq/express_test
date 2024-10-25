const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/api/Auth", require("./Auth/Route"));

const server = app.listen(PORT, () => {
  console.log(`Server connected to port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`An error occurred: ${err.message}`);
  server.close(() => process.exit(1));
});
// TODO stop at https://www.loginradius.com/blog/engineering/guest-post/nodejs-authentication-guide/#refactor-the-login-function
