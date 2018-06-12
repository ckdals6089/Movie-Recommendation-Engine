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
const clickWatch = express.Router();
clickWatch.use(bodyParser.json()); 
clickWatch.route('/')

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

clickWatch.post('/movies/clickWatch', (req, res) => {
    
    var usrID = require('../config/passport')
    var paramName2 = req.body.inputClickWatch;
    session
    
    .run('MATCH (n:User{id:{id}}), (m:Movie{title:{title}}) MERGE (n) - [r:WATCHED] -> \
    (m)',{id: usrID.userID , title : paramName2})

    .then(function(result){
        console.log("This is title : " + paramName2)
        console.log("This is User ID: "+ usrID.userID)
    })
    
    .catch(function(err){
        console.log(err)
      });
})
  
app.use('/', router);
module.exports = app;
module.exports = clickWatch;
