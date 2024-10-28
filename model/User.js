const { connectDB, client } = require("../db");

connectDB();

async function create({ username, password }) {
  await client.query(
    `INSERT INTO users (username, password) VALUES ('${username}', '${password}');`
  );

  return find(username);
}

async function read() {}

async function updateRole(id, newRole) {
  await client.query(
    `UPDATE users
    SET role = '${newRole}'
    WHERE id = ${id}`
  );
}

async function remove(user) {
  await client.query(
    `DELETE FROM users
    WHERE username = '${user.username}' AND id = ${user.id};`
  );
}

async function find(username = null) {
  return await client.query(
    `SELECT row_to_json(
      (SELECT u FROM (SELECT id, username, password, role) AS u)
      ) AS user_data
      FROM users
      ${username ? `WHERE username = '${username}'` : ""};
      `
  );
}

async function findById(id) {
  return await client.query(
    `SELECT row_to_json(
      (SELECT u FROM (SELECT id, username, password, role) AS u)
      ) AS user_data
      FROM users
      WHERE id = ${id};
      `
  );
}

module.exports = { create, read, updateRole, remove, find, findById };
