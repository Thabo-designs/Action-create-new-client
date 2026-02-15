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
});

router.get("/contacts", (req, res) => {
  const contactsQuery = `
    SELECT 
  contacts.contact_id,
  contacts.contact_name,
  contacts.contact_surname,
  contacts.contact_email,
  clients.client_code
FROM contacts
LEFT JOIN clients ON contacts.client_id = clients.client_id;

  `;

  const clientsQuery = `
    SELECT client_id, client_name, client_code FROM clients
  `;



  db_connection.query(contactsQuery, (err, contacts) => {
    if (err) {
      return res.render("contacts", { message: err.message });
    }

    db_connection.query(clientsQuery, (err, clients) => {
      if (err) {
        return res.render("contacts", { message: err.message });
      }

      res.render("contacts", { contacts, clients });
    });
  });
});



router.get("/contacts",(req,res) => {
    res.render("contacts");
});

module.exports = router;