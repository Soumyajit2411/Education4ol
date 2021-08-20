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
    res.render("home");
  } else {
    res.redirect("/login");
  }
});

app.get("/profile", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("profile", { name: "Soumyajit Roy" });
  } else {
    res.redirect("/login");
  }
});

app.get("/history", (req, res) => {
  User.findById(req.user.id, (err, docs) => {
    res.render("history", { Course: docs.courses });
  });
});

app.get("/contact", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("contact");
  } else {
    res.redirect("/login");
  }
});

app.get("/about", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("about");
  } else {
    res.redirect("/login");
  }
});

app.get("/details", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("details");
  } else {
    res.redirect("/login");
  }
});

app.post("/signup", (req, res) => {
  // const newUser = new Task({
  //   lastname: req.body.lastname,
  //   firstname: req.body.firstname,
  //   email: req.body.username,
  //   password: req.body.password,
  //   country: req.body.country,
  //   newsletter: req.body.newsletter,
  // });
  // newUser.save((err) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     res.render("home");
  //   }
  // });
  User.register(
    { username: req.body.username },
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
  // const username = req.body.username;
  // const password = req.body.password;
  // Task.findOne({ email: username }, (err, docs) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     if (docs) {
  //       if (docs.password === password) {
  //         res.render("home");
  //       } else {
  //         res.render("login");
  //       }
  //     }
  //   }
  // });
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

  // Course.findOne({ img: img }, (err, docs) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     if (docs) {
  //       res.redirect("/details");
  //     } else {
  //       course.save((err) => {
  //         if (!err) {
  //           res.redirect("/history");
  //         }
  //       });
  //     }
  //   }
  // });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
