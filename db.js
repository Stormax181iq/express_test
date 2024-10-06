const pg = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const { Client } = pg;
const client = new Client();
async function connectDB() {
  await client
    .connect()
    .then(() => {
      console.log("Connected to the database !");
    })
    .catch((err) => {
      console.error("Error connecting to the database:", err);
    });
}

module.exports = connectDB;
