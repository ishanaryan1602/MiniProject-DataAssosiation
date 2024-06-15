const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const userModel = require("./models/user");
const postModel = require("./models/post");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

mongoose
  .connect("mongodb://127.0.0.1:27017/miniProj")
  .then(() => console.log("connection established to MongoDB"))
  .catch((err) => console.log("error occurred connecting", err));

const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/register", async (req, res) => {
  const { username, name, email, password, age } = req.body;
  const newuser = await userModel.findOne({ email });
  if (newuser) return res.send("acoount already exists");

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let user = await userModel.create({
        username,
        email,
        name,
        password: hash,
        age,
      });

      const token = jwt.sign(
        { email: user.email, userid: user._id },
        "secret_key"
      );
      res.cookie("token", token);
      res.redirect("/login");
    });
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) return res.redirect("/login");
  bcrypt.compare(password, user.password, (err, result) => {
    if (!result) return res.redirect("/login");
    res.send("success");
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

// function isLoggedIn(req, res, next) {
//   if (req.cookies.token === "") res.send("nope");
//   next();
// }

app.listen(3000, () => {
  console.log("listening on port 3000!");
});
