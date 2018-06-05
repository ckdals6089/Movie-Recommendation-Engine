var Movie = require('../models/Movie');
var MovieCast = require('../models/MovieCast');
var neo4j = require('neo4j-driver').v1;
var morgan = require('morgan');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var router = express.Router();
var _ = require('lodash');


const hostname = 'localhost';
var app = express();

//construct Decription Router 
const descriptionRouter = express.Router();
descriptionRouter.use(bodyParser.json()); 
descriptionRouter.route('/')



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

descriptionRouter.post('/movies/search/description', (req, res) =>{
   
  

    var paramName2 = req.body.descriptionMovie;
  
    session
    
    .run("MATCH (m:Movie {title:{title}})\
    OPTIONAL MATCH (m)<-[r]-(p:Person)\
    RETURN m.title AS title, collect([p.name, \
    head(split(lower(type(r)), '_')), r.roles]) AS cast\
    LIMIT 1", {title:  paramName2 })
   
    .then(function(result){
        
        if (_.isEmpty(result.records))
            return null;
        
            var record = result.records[0];
        return new MovieCast(record.get('title'), record.get('cast'))
        var movieArr = [];
        record.forEach(function(param){
            movieArr.push({
                title:param._fields[0].properties.title,
                name:param._fields[0].properties.name,
                job:param._fields[0].properties.job,
                role:param._fields[0].properties.role
                
            })
        })
        // result.records.forEach(function(record){ 
        //     movieArr.push({
        //         title: record._fields[0].properties.title,
        //         name: record._fields[1].properties.name,
        //         job: record._fields[1].properties.job,
        //         role: record._fields[1].properties.role
        //     })
        // });    
        res.render('index3', {
          movieDescription: movieArr
   });   
      console.log()
    })
  .catch(function(err){
      console.log(err)
      });
  }) 
  
  
  

app.use('/', router);
module.exports = app;
module.exports = descriptionRouter;