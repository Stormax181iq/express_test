const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.adminAuth = (req, res, next) => {
  const token = req?.cookies?.jwt;
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
