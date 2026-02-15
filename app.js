const e = require('express');
const express = require('express');
const mysql = require('mysql');
const path = require('path');
const dotenv = require('dotenv');
const exphbs = require("express-handlebars");
const hbs = require("hbs");



dotenv.config({path: "./.env"});


const app = express();


const db_connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

db_connection.connect((err) => {
    if(err) {
        console.log("Error connecting to database: ", err);
        return;
    } else {
        console.log("Connected to workbench successfully!");
    }});



const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));

hbs.registerHelper("ifCond", function (v1, v2, options) {
  return (v1 === v2) ? options.fn(this) : options.inverse(this);
});

app.set("view engine", "hbs");

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/', require('./routes/pages'));
app.use('/add-client', require('./routes/add-client')); 

app.get("/table", (req, res) => {
  db_connection.query("SELECT id, client_name, client_code FROM clients", (err, results) => {
    if (err) {
      res.render("clients", { message: "Error fetching clients!" });
    } else {
      console.log("Fetched clients: ", results);
      res.render("clients", { clients: results });
    }
  });
});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
})
