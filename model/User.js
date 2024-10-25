const { connectDB, client } = require("../db");

connectDB();

async function create({ username, password }) {
  await client.query(
    `INSERT INTO users (username, password) VALUES ('${username}', '${password}');`
  );

  return find(username, password);
}

function read() {}

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

async function find(username) {
  return parseResponseToObject(
    await client.query(
      `SELECT (id, username, password, role) FROM users 
      WHERE username='${username}';`
    )
  );
}

async function findById(id) {
  return parseResponseToObject(
    await client.query(
      `SELECT (id, username, password, role) FROM users
      WHERE id=${id};`
    )
  );
}

function parseResponseToObject(response) {
  console.log(response);
  const userInfos = response?.rows[0].row.slice(1, -1).split(",");
  const user = {
    id: userInfos[0],
    username: userInfos[1],
    password: userInfos[2],
    role: userInfos[3],
  };
  return user;
}

module.exports = { create, read, updateRole, remove, find, findById };
