const { connectDB, client } = require("../db");

connectDB();

async function create(username, password) {
  await client.query(
    `INSERT INTO users (username, password) VALUES ('${username}', '${password}')`
  );
}

function read() {}

function update() {}

function remove() {}

module.exports = { create, read, update, remove };
