const express = require("express");
const router = express.Router();
const { User, Page } = require("../models");
const Promise = require("bluebird");

module.exports = router;

router.get("/", (req, res, next) => {
  User.findAll()
    .then(users => {
      res.render("users", {
        users: users
      });
    })
    .catch(next);
});

router.get("/:userId", (req, res, next) => {
  //there's two queries here for different info
  let findingUserPages = Page.findAll({
    where: {
      authorId: req.params.userId
    }
  });
  let findingUser = User.findById(req.params.userId);

  Promise.all([findingUserPages, findingUser])
    .spread((pages, user) => {
      user.pages = pages;
      res.render("userpage", {
        user: user
      });
    })
    .catch(next);
});
