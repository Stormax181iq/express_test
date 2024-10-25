const User = require("../model/User");
const bcrypt = require("bcryptjs");

exports.register = async (req, res, next) => {
  console.log(req.body);
  const { username, password } = req.body;

  if (password.length < 6) {
    return res.status(400).json({ message: "Password less than 6 characters" });
  }

  bcrypt.hash(password, 10).then(async (hash) => {
    await User.create({ username, password: hash })
      .then((user) =>
        res.status(200).json({
          message: "User successfully created",
          user,
        })
      )
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
    console.log(user);
    if (!user) {
      res.status(400).json({
        message: "Login not successful",
        error: "User not found",
      });
    } else {
      // Comparing given password with hashed password
      bcrypt.compare(password, user.password).then((result) => {
        result
          ? res.status(200).json({
              message: "Login successful",
              user,
            })
          : res.status(400).json({
              message: "Bad password",
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
    .catch((err) =>
      res.status(400).json({
        message: "An error occurred",
        error: err.message,
      })
    );
};
