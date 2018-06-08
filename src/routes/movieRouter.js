var neo4j = require('neo4j-driver').v1;
var morgan = require('morgan');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var router = express.Router();
var _ = require('lodash');


const hostname = 'localhost';
var app = express();


const showRouter = express.Router();
showRouter.use(bodyParser.json()); 
showRouter.route('/')

//view Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Use app(express)
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ exteneded : false}));
app.use(express.static(path.join(__dirname, 'public')));

//connect Neo4j with node.js
var driver = neo4j.driver('bolt://127.0.0.1:7687', neo4j.auth.basic('neo4j', '12345'));
var session = driver.session();
// function Show Movies
showRouter.post('/movies', (req, res) =>{

    //open session
  session

  .run('MATCH(n:Movie) RETURN n ') 

  .then(function(result){
      var movieArr = [];
          result.records.forEach(function(record){
            movieArr.push({
            id: record._fields[0].identity.low,
            title: record._fields[0].properties.title,
            tagline: record._fields[0].properties.tagline
            });
         });     
        res.render('showMovie', {
         movies: movieArr
        });
    })
    console.log(movieArr)
    .catch(function(err){
        console.log(err)
    });
});

// function Show Movies
showRouter.get('/movies', (req, res) =>{

    //open session
  session

  .run('MATCH(n:Movie) RETURN n ') 

  .then(function(result){
      var movieArr = [];
          result.records.forEach(function(record){
            movieArr.push({
            id: record._fields[0].identity.low,
            title: record._fields[0].properties.title,
            tagline: record._fields[0].properties.tagline
            });
         });     
        res.render('showMovie', {
         movies: movieArr
        });
    })
    .catch(function(err){
        console.log(err)
    });
});

app.use('/', router);
module.exports = app;
module.exports = showRouter;