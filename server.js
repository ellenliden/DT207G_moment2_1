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
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
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
  const id = req.params.id;
  client.query("SELECT * FROM users WHERE id = $1", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Fel vid hämtning av användare: " + err });
    }
    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ error: "Ingen användare hittad" });
    }
    return res.status(200).json(result.rows[0]);
  });
});

//Lägg till en användare
app.post("/api/users", (req, res) => {
  // Validering
  const { companyname, jobtitle, location, startdate, enddate, description } = req.body;
  if (!companyname || !jobtitle || !location || !startdate || !description) {
    return res.status(400).json({
      error: "Company name, job title, location, start date och description krävs."
    });
  }
  const query = `INSERT INTO users (companyname, jobtitle, location, startdate, enddate, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
  const values = [companyname, jobtitle, location, startdate, enddate, description];
  client.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Fel vid skapande av användare: " + err });
    }
    return res.status(201).json({ message: "User added", user: result.rows[0] });
  });
});

//Uppdatera en användare
app.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const { companyname, jobtitle, location, startdate, enddate, description } = req.body;
  if (!companyname || !jobtitle || !location || !startdate || !description) {
    return res.status(400).json({
      error: "Company name, job title, location, start date och description krävs."
    });
  }
  const query = `UPDATE users SET companyname=$1, jobtitle=$2, location=$3, startdate=$4, enddate=$5, description=$6 WHERE id=$7 RETURNING *`;
  const values = [companyname, jobtitle, location, startdate, enddate, description, id];
  client.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Fel vid uppdatering av användare: " + err });
    }
    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ error: "Ingen användare hittad att uppdatera" });
    }
    return res.status(200).json({ message: "User updated", user: result.rows[0] });
  });
});

//Ta bort en användare
app.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;
  client.query("DELETE FROM users WHERE id = $1 RETURNING *", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Fel vid borttagning av användare: " + err });
    }
    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ error: "Ingen användare hittad att ta bort" });
    }
    return res.status(200).json({ message: "User deleted", user: result.rows[0] });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
