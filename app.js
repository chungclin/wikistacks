const express = require('express');
const app = express();
const morgan = require('morgan'); //logging
const pg = require('pg'); //postgres driver client
const bodyParser = require('body-parser'); //parsing form data
const nunjucks = require('nunjucks');
const sequelize = require('sequelize');
const models = require('./models');
const routes = require('./routes'); //table of contents, available routes and how to get them

nunjucks.configure('views', {noCache: true});
app.set('view engine', 'html');
app.engine('html', nunjucks.render);
app.use(morgan('dev'));

//HTTP request get submitted over internet in strings
//You'll need convert those strings into objects
//You'll need both these lines a) for react jsx and b) for normal form html sent back
app.use(bodyParser.json()) // a)
app.use(bodyParser.urlencoded( {extended : true} )) // b)
//now, req.body's content is available to this application

app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));

app.use('/', routes); //sends all income requests to our routes folder

models.db.sync({force: true})
.then(function () {
  console.log('All tables created!');
  // console.log(models.db);
  app.listen(3000, function () {
    console.log('Server is listening on port 3000!');
  });
})
.catch(console.error.bind(console));


// app.listen(3000, function(req, res, next){
  //   console.log('server 3000 has started');
  // });
