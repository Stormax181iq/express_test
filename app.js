const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

const users = [];

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

app.get("/users", (req, res) => {
  res.status(200).send(users);
});

app.post("/users", (req, res) => {
  try {
    const user = { name: req.body.name, password: req.body.password };
    if (req.body.name === null || req.body.password === null) {
      res.status(400).send();
    }
    users.push(user);
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
