const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../model/User");
dotenv.config();

exports.adminAuth = (req, res, next) => {
  const token = req.cookies?.jwt;
  if (!token) {
    return res.status(401).json({
      message: "Not authorized, token not available",
    });
  }

  jwt.verify(token, process.env.JWTSECRET, (err, decodedToken) => {
    if (err || decodedToken.role !== "admin") {
      return res.status(401).json({ message: "Not authorized" });
    }

    next();
  });
};

exports.userAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({
      message: "Not authorized, token not available",
    });
  }

  jwt.verify(token, process.env.JWTSECRET, (err, decodedToken) => {
    if (err || decodedToken.role !== "Basic") {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    next();
  });
};

exports.getUsers = async (req, res, next) => {
  await User.find()
    .then((response) => {
      const users = response.rows;
      const userFunction = users.map((user) => {
        const container = {};
        container.username = user.user_data.username;
        container.role = user.user_data.role;
        container.id = user.user_data.id;
        return container;
      });
      res.status(200).json({ user: userFunction });
    })
    .catch((err) => {
      res.status(400).json({
        message: "Not successful",
        error: err.message,
      });
    });
};
