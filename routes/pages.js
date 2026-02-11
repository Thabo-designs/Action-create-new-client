const express = require('express');
const router = express.Router();
const mysql = require("mysql");
const db_connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

router.get("/", (req,res) => {
    res.render("index");
})

router.get("/clients", (req, res) => {
  db_connection.query("SELECT client_id, client_name, client_code, linked_contacts FROM clients", (err, results) => {
    if (err) {
      res.render("clients", { message: err.message });

    } else {
      console.log("Fetched clients: ", results);
      res.render("clients", { clients: results });
    }
  });
});

router.get("/clients",(req,res) => {
    res.render("clients");
})

module.exports = router;