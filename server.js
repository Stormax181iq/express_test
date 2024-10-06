const express = require("express");
const app = express();
const PORT = 5000;

const connectDB = require("./db");
connectDB();
app.use(express.json());

const server = app.listen(PORT, () => {
  console.log(`Server connected to port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`An error occurred: ${err.message}`);
  server.close(() => process.exit(1));
});
// TODO stop at https://www.loginradius.com/blog/engineering/guest-post/nodejs-authentication-guide/#perform-crud-operations
