const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cors());
app.use(express.json());

//Routes
app.get("/", (req, res) => {
  res.render("index");
});

//API Routes
app.get("/api/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

//Hämta alla användare
app.get("/api/users", (req, res) => {
  res.json({ message: "Get all users" });
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
