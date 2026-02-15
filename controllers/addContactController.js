const e = require("express");
const mysql = require("mysql");
const db_connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

var client_code = "";

exports.addContact = (req, res) => {
  console.log(req.body);
  const contact_name = req.body.name;
  var contact_surname = req.body.Surname;
  var contact_email = req.body.email;

  console.log("body name: ", req.body);
 
//   res.render("contacts", { message: "Error adding contacts!" });

  db_connection.query(
    "INSERT INTO contacts SET ?",
    { contact_name: contact_name , contact_surname: contact_surname, contact_email: contact_email},
    (err, result) => {
      if (err) {
        console.log("Error adding ccontacts: ", err);
        res.render("contacts", { message: "Error adding contacts!" });
        return;
      }
      res.render("contacts", { message: "Client added successfully!" });
      res.redirect("/contacts");

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

