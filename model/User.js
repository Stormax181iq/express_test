const { connectDB, client } = require("../db");

connectDB();

async function create(username, password) {
  await client.query(
    `INSERT INTO users (username, password) VALUES ('${username}', '${password}');`
  );
}

function read() {}

async function updateRole(id, newRole) {
  await client.query(
    `UPDATE users
      SET role = '${newRole}'
      WHERE id = ${id}`
  );
}

function remove() {}

async function find(username, password) {
  return await client.query(
    `SELECT (id, username, password, role) FROM users 
      WHERE username='${username}' AND password='${password}';`
  );
}

async function findById(id) {
  return await client.query(
    `SELECT (id, username, password, role) FROM users
      WHERE id=${id};`
  );
}

module.exports = { create, read, updateRole, remove, find, findById };
