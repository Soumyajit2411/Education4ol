const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
let ejs = require("ejs");

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/taskDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const taskSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  country: String,
  newsletter: String,
});

const courseSchema = new mongoose.Schema({
  title: String,
  img: String,
});

const Task = mongoose.model("Task", taskSchema);
const Course = mongoose.model("Course", courseSchema);
app.get("/", (req, res) => {
  res.render("front");
});
app.get("/home", (req, res) => {
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
  res.render("profile", { name: "Soumyajit Roy" });
});
app.get("/history", (req, res) => {
  Course.find({}, (err, Course) => {
    res.render("history", { Course: Course });
  });
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

app.post("/signup", (req, res) => {
  const newUser = new Task({
    lastname: req.body.lastname,
    firstname: req.body.firstname,
    email: req.body.username,
    password: req.body.password,
    country: req.body.country,
    newsletter: req.body.newsletter,
  });
  newUser.save((err) => {
    if (err) {
      console.log(err);
    } else {
      res.render("home");
    }
  });
});

app.get("/out", (req, res) => {
  res.redirect("/");
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  Task.findOne({ email: username }, (err, docs) => {
    if (err) {
      console.log(err);
    } else {
      if (docs) {
        if (docs.password === password) {
          res.render("home");
        } else {
          res.render("login");
        }
      }
    }
  });
});

app.post("/details", (req, res) => {
  const course = new Course({
    title: req.body.title,
    img: req.body.img,
  });
  course.save((err) => {
    if (!err) {
      res.redirect("/history");
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
