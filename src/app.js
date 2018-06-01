
// var api = require('./neo4jApi');

var Movie = require('./models/Movie');
var MovieCast = require('./models/MovieCast');
var neo4j = require('neo4j-driver').v1;
var morgan = require('morgan');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var router = express.Router();
var _ = require('lodash');

const movieRouter = require('./routes/movieRouter');
const hostname = 'localhost';
var app = express();


//view Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ exteneded : false}));
app.use(express.static(path.join(__dirname, 'public')));

//connect Neo4j with node.js
var driver = neo4j.driver('bolt://127.0.0.1:7687', neo4j.auth.basic('neo4j', '12345'));
var session = driver.session();

//login page
app.get('', function(req, res){
  session
  .run(res.render('login'))
   .then(function(result){  
    
})
.catch(function(err){
  console.log(err)
  });

});
// function Search Movies
router.route('/movies').get(function(req, res){
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
  res.render('index', {
      movies: movieArr
  });
})
.catch(function(err){
  console.log(err)
  });
});



// Search specific Movie
router.route('/movies/search').post(function(req,res){
  var paramName = req.body.searchMovie;
  session
  
  .run(' MATCH (n:Movie) \
  WHERE n.title =~ {title} \
  RETURN n',
  {title: '(?i).*' + paramName + '.*'})
  
  .then(function(result){
  
  var movieArr = [];
   result.records.forEach(function(record){
      movieArr.push({
          id:record._fields[0].identity.low,
          title: record._fields[0].properties.title,
          tagline: record._fields[0].properties.tagline
      });
  });     
  res.render('index2', {
      moviesearch: movieArr
  }); 
  console.log(movieArr)
})
.catch(function(err){
  console.log(err)
  });
}) 

// Descript specific Movie
router.route('/movies/search/description').post(function(req,res){
  var paramName2 = req.body.descriptionMovie;
  
  session
  
  .run("MATCH (n:Person)-[:ACTED_IN]->(movie{title:{title}})<-[:DIRECTED]-(director)\
  RETURN movie.title, director.name limit 200",{title: '(?i).*' + paramName2 + '.*'})
 
  .then(result => {

   var movieArr2 = [];
    result.records.forEach(function(record){
     movieArr2.push({
         id:record._fields[0].identity.low,
         title: record._fields[0].properties.title,
         tagline: record._fields[0].properties.tagline
     });
 });     
      res.render('index3', {
        movieDescription: movieArr2
 });   
    console.log(movieArr2)
  })
.catch(function(err){
    console.log(err)
    });
}) 

function getMovie(title) {
  var session = driver.session();
  return session
    .run(
      "MATCH (movie:Movie {title:{title}}) \
      OPTIONAL MATCH (movie)<-[r]-(person:Person) \
      RETURN movie.title AS title, \
      collect([person.name, \
           head(split(lower(type(r)), '_')), r.roles]) AS cast \
      LIMIT 1", {title})
    .then(result => {
      session.close();

      if (_.isEmpty(result.records))
        return null;

      var record = result.records[0];
      return new MovieCast(record.get('title'), record.get('cast'));
    })
    .catch(error => {
      session.close();
      throw error;
    });
}
app.listen(3000);
app.use('/', router);
module.exports = app;
