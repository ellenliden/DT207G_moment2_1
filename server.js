const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const { Client } = require("pg");
require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cors());
app.use(express.json());

//anslut till databasen
const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect((err) => {
  if (err) {
    console.error("Fel vid anslutning till databasen" + err);
  } else {
    console.log("Ansluten till databasen");
  }
});

//Routes
app.get("/", (req , res) => {
  res.render("index");
});

//API Routes
app.get("/api/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

//Hämta alla användare

app.get("/api/users", (req, res) => {
  // Hämta alla användare från databasen
  client.query("SELECT * FROM users", (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Fel vid hämtning av användare: " + err });
    }
    // Kontrollera om några användare hittades
    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ error: "Ingen användare hittad" });
    }
    return res.status(200).json(result.rows);
  });


//Hämta en specifik användare
app.get("/api/users/:id", (req, res) => {
  res.json({ message: "Get user: " + req.params.id });
});

//Lägg till en användare
app.post("/api/users", (req, res) => {
  //error hantering
  let errors = {
    message: "",
    details: "",
    http_response: {},
  };

  //Kontrollera att req.body finns
  if (!req.body) {
    return res.json({ error: "No data received" });
  }

  let companyname = req.body.companyname;
  let jobtitle = req.body.jobtitle;
  let location = req.body.location;
  let startdate = req.body.startdate;
  let enddate = req.body.enddate;
  let is_current = req.body.is_current || false;
  let description = req.body.description;

  if (!companyname || !jobtitle || !location || !startdate || !description) {
    //error meddelande
    errors.message =
      "Company name, job title, location, start date and description are required";
    errors.details =
      "You must include Company name, job title, location, start date and description";

    //respons
    errors.http_response.message = "Bad Request";
    errors.http_response.code = 400;
    return res.status(400).json(errors);
  }
  let newUser = {
    companyname: companyname,
    jobtitle: jobtitle,
    location: location,
    startdate: startdate,
    enddate: enddate,
  };
  res.json({ message: "User added", newUser });
});

//Uppdatera en användare
app.put("/api/users/:id", (req, res) => {
  res.json({ message: "User updated: " + req.params.id });
});

//Ta bort en användare
app.delete("/api/users/:id", (req, res) => {
  res.json({ message: "User deleted: " + req.params.id });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
