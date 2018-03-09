const express = require('express'),
      app = express(),
      morgan = require('morgan'),
      pg = require('pg'),
      bodyParser = require('body-parser'),
      nunjucks = require('nunjucks'),
      sequelize = require('sequelize');


nunjucks.configure('views', {noCache: true});
app.set('view engine', 'html');
app.engine('html', nunjucks.render);


app.get('/', function(req, res, next){
  console.log('root path requested', res.statusCode);
  res.send('hi');
});



app.listen(3000, function(req, res, next){
  console.log('server 3000 has started');
});
