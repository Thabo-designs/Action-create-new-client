const e = require("express");
const mysql = require("mysql");
const db_connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

var client_code = "";

exports.addClient = (req, res) => {
  console.log(req.body);
  const client_name = req.body.name;
  console.log("Client name: ", client_name);

  db_connection.query(
    "INSERT INTO clients SET ?",
    { client_name: client_name , client_code: client_name},
    (err, result) => {
      if (err) {
        console.log("Error adding client: ", err);
        res.render("clients", { message: "Error adding client!" });
        return;
      }
      const nextID = result.insertId;
      const code = generateCode(client_name) + nextID.toString().padStart(3, "0");
      console.log("this is the code: ", code)
      db_connection.query(
        "UPDATE clients SET client_code = ? WHERE client_id = ?",
        [code, nextID],
        (err, result) => {
          if (err) {
            console.log("Error updating client code: ", err);
            res.render("clients", { message: "Error adding client!" });
            return;
          } else {
            console.log("Client added successfully with code: ", code);
          }
        },
      );
      res.render("clients", { message: "Client added successfully!" });
    },
  );

  function generateCode(name_param) {
    result = name_param
      .split(" ")
      .slice(0, 3)
      .map((word) => word.charAt(0))
      .join("");

    if (result.length === 1 && name_param.length >= 3) {
      return name_param.substring(0, 3).toUpperCase();
    } else if (result.length === 1 && name_param.length < 3) {
      if (name_param.length === 2) {
        console.log(" THis is the length: " + name_param.length);
        return name_param.toUpperCase() + "A";
      } else {
        console.log(" THis is the length: " + name_param.length);
        return name_param.toUpperCase() + "AA";
      }
    } else {
      if (result.length < 3) {
        return result.toUpperCase() + "A";
      }
      return result.toUpperCase();
    }
  }

  function formatNumber(client_name) {
    const nextID = getNextIDTwo(db_connection, (err, nextID) => {
      if (err) {
        console.error("Error getting next ID:", err);
      } else {
        console.log("This is next ID: ", nextID);
        const formattedNumber = nextID.toString().padStart(3, "0");
        client_code = generateCode(client_name) + formattedNumber;
        console.log("Generated Code:", client_code);
      }
    });
  }

  function generateCodeWithNumber(client_name) {
    console.log(
      "Generating code for client: ",
      generateCode(client_name) + formatNumber().toString(),
    );
    return generateCode(client_name) + formatNumber().toString();
  }

  function getNextID(db_connection, callback) {
    db_connection.query(
      "SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?",
      [process.env.DATABASE, "clients"],
      (err, result) => {
        if (err) {
          console.log("Error fetching next ID: ", err);
          return callback(err, null);
        } else {
          const nextID = result[0].AUTO_INCREMENT || 1; // Default to 1 if AUTO_INCREMENT is null
          console.log("Next ID: ", nextID);
          callback(null, nextID);
        }
      },
    );
  }

  function getNextIDTwo(db_connection, callback) {
    db_connection.query(
      "SELECT COALESCE(MAX(client_id), 0) + 1 AS NextID FROM clients",
      (err, result) => {
        if (err) {
          
          return callback(err, null);
        }
        const nextID = result[0].NextID;
    
        callback(null, nextID);
      },
    );
  }
};
