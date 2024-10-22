const { connectDB, client } = require("../db");

connectDB();

async function create(username, password) {
  await client.query(
    `INSERT INTO users (username, password) VALUES ('${username}', '${password}');`
  );
}

function read() {}

function update() {}

function remove() {}

async function find(username, password) {
  return await client.query(
    `SELECT (id, username, password, role) FROM users 
      WHERE username='${username}' AND password='${password}';`
  );
}

module.exports = { create, read, update, remove, find };
