const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.register = async (req, res, next) => {
  const { username, password } = req.body;

  if (password.length < 6) {
    return res.status(400).json({ message: "Password less than 6 characters" });
  }

  bcrypt.hash(password, 10).then(async (hash) => {
    await User.create({
      username,
      password: hash,
    })
      .then((result) => {
        const user = result.rows[0].user_data;
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
        return res.status(200).json({
          message: "User successfully created",
          user,
        });
      })
      .catch((err) => {
        return res.status(401).json({
          message: "User not created",
          error: err.message,
        });
      });
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
    const user = await User.find(username).then((result) => {
      return result.rows[0]?.user_data;
    });

    if (!user) {
      return res.status(400).json({
        message: "Login not successful",
        error: "User not found",
      });
    }
    // Comparing given password with hashed password
    bcrypt.compare(password, user.password).then((result) => {
      if (!result) {
        return res.status(400).json({
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
      return res.status(200).json({
        message: "User successfully logged in",
        user,
      });
    });
  } catch (err) {
    return res.status(400).json({
      message: "An error occurred",
      error: err.message,
    });
  }
};

async function makeUser(id, role, res) {
  await User.findById(id)
    .then((user) => {
      // Verifies the user is not the same role
      if (user.role === role) {
        return res.status(400).json({
          message: `User is already ${role}`,
        });
      }

      user.role = role;
      User.updateRole(id, user.role);
      return res.status(200).json({
        message: "Update successful",
        user,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        message: "An error occurred",
        error: err.message,
      });
    });
}

exports.update = (req, res, next) => {
  const { role, id } = req.body;

  // Verifying if role and id is present
  if (!role || !id) {
    res.status(400).json({
      message: "Role or Id not present",
    });
  }

  // Verifying if the value of role is admin
  if (role === "admin") {
    makeUser(id, role, res);
  } else if (role === "Basic") {
    makeUser(id, role, res);
  } else {
    res.status(400).json({
      message: "Role doesn’t exist",
    });
  }
};

exports.deleteUser = async (req, res, next) => {
  const { id } = req.body;
  await User.findById(id)
    .then((user) => {
      User.remove(user.rows[0].user_data);
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
