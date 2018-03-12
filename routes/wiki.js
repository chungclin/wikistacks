const express = require('express');
const router = express.Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;

router.get('/', (req,res,next)=>{ //dont need /wiki because of middleware above
  // res.send('homepage');
  res.redirect('/');
});

router.post('/', (req,res,next)=>{
  console.log(req.body);
  // res.json(req.body);

  const page = Page.build({
    title: req.body.title,
    content: req.body.content
  })

  page.save()
  .then(()=>{
    res.redirect('/');
  })
  .catch((err)=>{
    console.log(err);
  })

});

router.get('/add', (req,res,next)=>{
  res.render('addpage');
  // res.redirect('/');
});


module.exports = router;
