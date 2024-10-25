const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.register = async (req, res, next) => {
  console.log(req.body);
  const { username, password } = req.body;

  if (password.length < 6) {
    return res.status(400).json({ message: "Password less than 6 characters" });
  }

  bcrypt.hash(password, 10).then(async (hash) => {
    await User.create({
      username,
      password: hash,
    })
      .then((user) => {
        console.log(user);
        const maxAge = 3 * 60 * 60;
        const token = jwt.sign(
          { id: user.id, username, role: user.role },
          process.env.JWTSECRET,
          {
            expiresIn: maxAge, // 3 hours in seconds
          }
        );

        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: maxAge * 1000, // 3 hours in ms
        });
        res.status(200).json({
          message: "User successfully created",
          user,
        });
      })
      .catch((err) =>
        res.status(401).json({
          message: "User not created",
          error: err.message,
        })
      );
  });
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  // Check if username and password is provided
  if (!username || !password) {
    return res.status(400).json({
      message: "Username or password missing",
    });
  }

  try {
    const user = await User.find(username);
    if (!user) {
      res.status(400).json({
        message: "Login not successful",
        error: "User not found",
      });
    } else {
      // Comparing given password with hashed password
      bcrypt.compare(password, user.password).then((result) => {
        if (!result) {
          res.status(400).json({
            message: "Bad password",
          });
        }

        const maxAge = 3 * 60 * 60;
        const token = jwt.sign(
          { id: user.id, username, role: user.role },
          process.env.JWTSECRET,
          {
            expiresIn: maxAge, // 3 hours in s
          }
        );

        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: maxAge * 1000, // 3 hours in ms
        });
        res.status(200).json({
          message: "User successfully logged in",
          user,
        });
      });
    }
  } catch (err) {
    res.status(400).json({
      message: "An error occurred",
      error: err.message,
    });
  }
};

exports.update = async (req, res, next) => {
  const { role, id } = req.body;

  // Verifying if role and id is present
  if (!role || !id) {
    res.status(400).json({
      message: "Role or Id not present",
    });
  }

  // Verifying if the value of role is admin
  if (role === "admin") {
    await User.findById(id)
      .then((user) => {
        // Verifies the user is not an admin
        if (user.role === "admin") {
          res.status(400).json({
            message: "User is already an Admin",
          });
        }

        user.role = role;
        User.updateRole(id, user.role);
        res.status(200).json({
          message: "Update successful",
          user,
        });
      })
      .catch((err) => {
        res.status(400).json({
          message: "An error occurred",
          error: err.message,
        });
      });
  } else {
    res.status(400).json({
      message: "Role is not admin",
    });
  }
};

exports.deleteUser = async (req, res, next) => {
  const { id } = req.body;
  await User.findById(id)
    .then((user) => {
      User.remove(user);
      res.status(201).json({
        message: "User successfully deleted",
        user,
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: "An error occurred",
        error: err.message,
      });
    });
};
