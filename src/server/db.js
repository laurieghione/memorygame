const mysql = require("mysql");
//get env variable
require("dotenv").config({ path: "../.env" });

// Create a connection to the database
const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
});

const table = process.env.DATABASE_TABLE;

//read all datas
connection.query("SELECT * FROM " + table, (err, rows) => {
  if (err) throw err;

  console.log("Data received from DB : ");

  rows.forEach((row) => {
    console.log(`id : ${row.id} - duration :  ${row.duration} sec`);
  });
});

module.exports = connection;
