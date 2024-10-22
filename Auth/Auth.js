const User = require("../model/User");

exports.register = async (req, res, next) => {
  console.log(req.body);
  const { username, password } = req.body;

  if (password.length < 6) {
    return res.status(400).json({ message: "Password less than 6 characters" });
  }

  try {
    await User.create(username, password).then((user) =>
      res.status(200).json({
        message: "User successfully created",
        user,
      })
    );
  } catch (err) {
    res.status(401).json({
      message: "User not created",
      error: err.message,
    });
  }
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
    const dataResponse = (await User.find(username, password)).rows[0];

    if (!dataResponse) {
      res.status(401).json({
        message: "Login not successful",
        error: "User not found",
      });
    } else {
      const userInfos = dataResponse.row.slice(1, -1).split(",");
      const user = {
        id: userInfos[0],
        username: userInfos[1],
        password: userInfos[2],
        role: userInfos[3],
      };
      res.status(200).json({
        message: "Login successful",
        user,
      });
    }
  } catch (err) {
    res.status(400).json({
      message: "An error occurred",
      error: err.message,
    });
  }
};
