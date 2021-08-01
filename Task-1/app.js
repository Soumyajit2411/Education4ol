const express = require("express");
const app = express();
const port = 3000;
let ejs = require("ejs");
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/logout", (req, res) => {
  res.render("logout");
});
app.get("/signup", (req, res) => {
  res.render("signup");
});
app.get("/profile", (req, res) => {
  res.render("profile");
});
app.get("/history", (req, res) => {
  res.render("history");
});
app.get("/contact", (req, res) => {
  res.render("contact");
});
app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/details", (req, res) => {
  res.render("details");
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
