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
const getGraph = express.Router();
getGraph.use(bodyParser.json()); 
getGraph.route('/')

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

getGraph.post('/movies/search/description', (req, res) =>{
    session
        .run(
        'MATCH (m:Movie)<-[:ACTED_IN]-(a:Person) \
        RETURN m.title AS movie, collect(a.name) AS cast \
        LIMIT {limit}', {limit: 100})
        .then(function(graph)  {
          var nodes = [], rels = [], i = 0;
          graph.records.forEach(function(record1){
            nodes.push({
                    title: record1._fields[0],
                    label: record1._fields[0] });
                var target = i;
                i++
            })
            console.log("nodes" + nodes)
        })
         
        .catch(function(err){
         console.log(err)

     });
         
})

module.exports= app;
module.exports = getGraph;