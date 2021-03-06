const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
let ejs = require("ejs");
require("dotenv").config();
var session = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose");
const passport = require("passport");

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: "Soumyajit Roy",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

mongoose.connect("mongodb://localhost:27017/taskDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const courseSchema = new mongoose.Schema({
  title: String,
  img: String,
});
const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  country: String,
  newsletter: String,
  courses: [courseSchema],
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

const Course = mongoose.model("Course", courseSchema);
app.get("/", (req, res) => {
  res.render("front");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/logout", (req, res) => {
  res.render("logout");
});

app.get("/out", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.get("/home", (req, res) => {
  if (req.isAuthenticated()) {
    User.findById(req.user.id, (err, docs) => {
      res.render("home", {
        proname: capitalize(docs.firstname) + " " + capitalize(docs.lastname),
      });
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/profile", (req, res) => {
  if (req.isAuthenticated()) {
    User.findById(req.user.id, (err, docs) => {
      res.render("profile", {
        proname: capitalize(docs.firstname) + " " + capitalize(docs.lastname),
        name: capitalize(docs.firstname) + " " + capitalize(docs.lastname),
      });
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/history", (req, res) => {
  if (req.isAuthenticated()) {
    User.findById(req.user.id, (err, docs) => {
      res.render("history", {
        proname: capitalize(docs.firstname) + " " + capitalize(docs.lastname),
        Course: docs.courses,
      });
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/contact", (req, res) => {
  if (req.isAuthenticated()) {
    User.findById(req.user.id, (err, docs) => {
      res.render("contact", {
        proname: capitalize(docs.firstname) + " " + capitalize(docs.lastname),
      });
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/about", (req, res) => {
  if (req.isAuthenticated()) {
    User.findById(req.user.id, (err, docs) => {
      res.render("about", {
        proname: capitalize(docs.firstname) + " " + capitalize(docs.lastname),
      });
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/details", (req, res) => {
  if (req.isAuthenticated()) {
    User.findById(req.user.id, (err, docs) => {
      res.render("details", {
        proname: capitalize(docs.firstname) + " " + capitalize(docs.lastname),
      });
    });
  } else {
    res.redirect("/login");
  }
});

app.post("/signup", (req, res) => {
  User.register(
    {
      username: req.body.username,
      lastname: req.body.lastname,
      firstname: req.body.firstname,
      country: req.body.country,
      newsletter: req.body.newsletter,
    },
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        res.redirect("/signup");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/home");
        });
      }
    }
  );
});

app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, function (error) {
    if (error) {
      console.log(error);
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/home");
      });
    }
  });
});

app.post("/details", (req, res) => {
  const img = req.body.img;
  const title = req.body.title;
  const course = new Course({
    img: img,
    title: title,
  });

  console.log(req.user.id);
  var j = 0;
  User.findById(req.user.id, (error, docs) => {
    if (error) {
      console.log(error);
    } else {
      if (docs) {
        docs.courses.forEach((docs) => {
          if (docs.img == img) {
            j = 1;
          }
        });
        if (j == 0) docs.courses.push(course);
        docs.save((err) => {
          if (!err) {
            res.redirect("/history");
          }
        });
      }
    }
  });
});

app.post("/change", (req, res) => {
  User.findById(req.user.id, (error, docs) => {
    if (error) {
      console.log(error);
    } else {
      req.user.changePassword(req.body.password, req.body.newpassword, (err) => {
        if (!err) {
          res.redirect("/profile");
        }
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
