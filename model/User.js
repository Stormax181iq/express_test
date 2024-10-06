const { Pool } = require("pg");
const pool = new Pool();

const schemaQuery = `
  CREATE TABLE IF NOT EXISTS users
`;
