const e = require("express");
const mysql = require("mysql");
const db_connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

var client_code = "";

exports.linkClient = (req, res) => {
  const { contactId, clientId } = req.body;
    const update_linked_contacts = `UPDATE clients c
SET linked_contacts = (
  SELECT COUNT(*)
  FROM contacts ct
  WHERE ct.client_id = c.client_id);`;

  db_connection.query(
    "UPDATE contacts SET client_id = ? WHERE contact_id = ?",
    [clientId, contactId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Failed to link contact");
      }
      db_connection.query(update_linked_contacts,
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Failed to link contact");
      }
    });
      // Redirect back to contacts page so user sees updated table
      res.redirect("/contacts");
    }
  );
};


exports.delinkClient = (req, res) => {
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
      res.redirect("/clients");

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
};

