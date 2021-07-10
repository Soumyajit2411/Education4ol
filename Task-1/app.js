const express = require("express");
const app = express();
const port = 3000;
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});
app.get("/logout", (req, res) => {
  res.sendFile(__dirname + "/logout.html");
});

app.get("/contact", (req, res) => {
  res.send("Contact Me!");
});

app.get("/about", (req, res) => {
  res.send("About Me!");
});
app.get("/portfolio", (req, res) => {
  res.send("Portfolio!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
