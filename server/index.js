const express = require("express");
const bodyParser = require("body-parser");
const chalk = require("chalk");
const fs = require("fs");
require("dotenv").config();

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// make the directory "public" static and available for public view
app.use(express.static("public"));

// set pug as view engine
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/users", (req, res) => {
  res.render("users-list");
});

app.get("/users/new", (req, res) => {
  res.render("user-new");
});

app.get("/users/:id", (req, res) => {
  res.render("user-details", { id: req.params.id });
});

app.get("/api/get-users", (req, res) => {
  fs.readFile("./public/final.json", (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

app.get("/api/get-user/:id", (req, res) => {
  fs.readFile("./public/final.json", (err, data) => {
    if (err) throw err;
    const id = req.params.id;
    const parsedData = JSON.parse(data);
    const user = parsedData.find(user => user.id == id);

    if (user) res.json({ success: true, user });
    else res.json({ success: false, msg: "User not found." });
  });
});

app.post("/api/new-user", (req, res) => {
  console.log(req.body);
  if (req.body.newUser)
    fs.readFile("./public/final.json", (err, data) => {
      if (err) throw err;
      let users = JSON.parse(data);
      let newUser = req.body.newUser;

      newUser.id = users.length;
      users.push(newUser);

      fs.writeFileSync("./public/final.json", JSON.stringify(users));

      res.send({ success: true });
    });
  else res.send({ success: false });
});

app.listen(process.env.PORT, () => {
  console.log(
    chalk.green("Website is available on:") +
      ` http://localhost:${process.env.PORT}`
  );
});
