const express = require("express");
const router = express.Router();
const { Page } = require("../models");

// GET /wiki
router.get("/", (req, res, next) => {
  res.render("wikipage");
});

// POST /wiki
router.post("/", (req, res, next) => {
  console.log(req.body);
  let newPage = Page.build(req.body);

  newPage
    .save()
    .then(savedPage => {
      console.log("page saved");
      res.json(savedPage);
    })
    .catch(err => {
      next(err);
    });
});

// get /wiki/add
router.get("/add", (req, res, next) => {
  res.render("addpage");
});

module.exports = router;
