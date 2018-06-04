
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
          tagline: record._fields[0].properties.tagline,
          released: record._fields[0].properties.released,
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
  
  .run("MATCh (m:Movie) WHERE m.title =~ {title}\
  OPTIONAL MATCH (x:Person)- [:ACTED_IN] -> (m) return x,m limit 4",
 {title: '(?i).*' + paramName2 + '.*'})
 
  .then(result => {  
  //  if (_.isEmpty(result.records))
  //  return null;

  //  var record = result.records[0];
  //  return new MovieCast(record.get('title'), record.get('cast'));
  //  $("#title").text(paramName2);
  //  $("#poster").attr("src", "http://neo4j-contrib.github.io/developer-resources/language-guides/assets/posters/" + paramName2 + ".jpg");
  //  var $list = $("#crew").empty();
  //  result.m.forEach(m => {
  //    $list.append($("<li>" + m.name + " " + m.job + (m.job == "acted" ? " as " + m.role : "") + "</li>"));
  //  });    

   var movieArr2 = [];
   result.records.forEach(function(record){
      movieArr2.push({
          id:record._fields[0].identity.low,
          title: record._fields[1].properties.title,
          name: record._fields[0].properties.name,
          born: record._fields[0].properties.born,
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

app.listen(3000);
app.use('/', router);
module.exports = app;
