const { Client } = require("pg");
require("dotenv").config();

//Anslut till databasen
const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: {
    rejectUnauthorized: false, //måste man ha detta för att kunna ansluta till databasen vid gratis hosting
  },
});
client.connect((err) => {
  if (err) {
    console.log("Fel vid anslutning till databasen");
  } else {
    console.log("Ansluten till databasen");
  }
});

//Skapa tabell
client.query(
  `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    companyname VARCHAR(100) NOT NULL,
    jobtitle VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    startdate DATE NOT NULL,
    enddate DATE NULL,
    is_current BOOLEAN DEFAULT FALSE, -- detta visar om användaren fortfarande jobbar på företaget
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`,
  (err, res) => {
    if (err) {
      console.error("Fel vid skapande av tabell:", err);
    } else {
      console.log("Tabellen users finns nu!");
    }
    client.end();
  }
);
