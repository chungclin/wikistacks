const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const nunjucks = require("nunjucks");
const { db, Page, User } = require("./models");
const wikiRouter = require("./routes/wiki");
// const userRouter = require("./routes/user");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// point nunjucks to the directory containing templates and turn off caching; configure returns an Environment
// instance, which we'll want to use to add Markdown support later.
const env = nunjucks.configure("views", { noCache: true });
// have res.render work with html files
app.set("view engine", "html");
// when res.render works with html files, have it use nunjucks to do so
app.engine("html", nunjucks.render);

app.use(express.static(path.join(__dirname + "/public")));

app.use("/wiki", wikiRouter);
// app.use("/user", userRouter);

app.get("/", (req, res, next) => {
  res.render("index");
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send(err.message);
});

Page.sync()
  .then(() => {
    console.log("Page model synced");
    return User.sync();
  })
  .then(() => {
    console.log("User model synced");
    app.listen(5000, () => console.log("server 5000 is connected"));
  })
  .catch(err => {
    console.error(err);
  });
