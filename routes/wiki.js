const express = require("express");
const router = express.Router();
const { Page, User } = require("../models");

// GET /wiki
router.get("/", (req, res, next) => {
  // res.render("wikipage");
  Page.findAll()
    .then(thePages => {
      res.render("index", {
        pages: thePages
      });
    })
    .catch(next);
});

// POST /wiki
router.post("/", (req, res, next) => {
  console.log(req.body);
  User.findOrCreate({
    where: {
      name: req.body.name,
      email: req.body.email
    }
  }).spread((user, wasCreatedBool) => {
    return Page.create({
      title: req.body.title,
      content: req.body.content,
      status: req.body.status
    }).then(createdPage => {
      return createdPage.setAuthor(user); //this is a method given created as a result of belongsTo
    });
  });
});

// get /wiki/add
router.get("/add", (req, res, next) => {
  res.render("addpage");
});

router.get("/:urlTitle", (req, res, next) => {
  Page.findOne({
    where: {
      urlTitle: req.params.urlTitle
    }
  })
    // .then(res => res.data)
    .then(foundPage => {
      console.log("found page", foundPage);
      if (foundPage === null) {
        return next(new Error("THAT PAGE WAS NOT FOUND"));
      }
      foundPage
        .getAuthor() //method created b/c of association belongsTo
        .then(author => {
          foundPage.author = author; //assigning it!
          return res.render("wikipage", {
            page: foundPage
          });
        });
      // res.json(foundPage);
    })
    .catch(next);
});

module.exports = router;
