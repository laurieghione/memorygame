var bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const db = require("./db.js");
const app = express();
//get env variable
require("dotenv").config({ path: "../.env" });

const apiPort = process.env.API_PORT;
const table = process.env.DATABASE_TABLE;

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));

//POST data
app.post("/game", (req, res) => {
  try {
    //create json game object
    const game = { duration: req.body.duration };
    //insert in database
    db.query("INSERT INTO " + table + " SET ?", game, (err, data) => {
      if (err) {
        throw err;
      }

      //return code 200 OK
      return res.status(200).send("new game id :" + data.insertId);
    });
  } catch (error) {
    //return code 500 internal server error
    return res.status(500).json({
      error,
      message: "Error : game not inserted",
    });
  }
});

//GET min datas
app.get("/game/min", (req, res) => {
  try {
    //select min value in database
    db.query(
      "SELECT * FROM " + table + " ORDER BY duration ASC LIMIT 3",
      (err, rows) => {
        if (err) {
          console.error(err);
          throw err;
        }
        let results = [];
        rows.forEach((row) => {
          results.push(row.duration);
        });
        //return code 200 OK
        return res.status(200).send(results);
      }
    );
  } catch (error) {
    //return code 500 internal server error
    return res.status(500).json({
      error,
      message: error,
    });
  }
});

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));
