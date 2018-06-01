require('file?name=[name].[ext]!../node_modules/neo4j-driver/lib/browser/neo4j-web.min.js');

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

//login page
app.get('', function(req, res){
    session
    .run('MATCH (n) RETURN n ')
     .then(function(result){  
})
.catch(function(err){
    console.log(err)
    });
    res.render('login');
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
      session.close();

      if (_.isEmpty(result.records))
        return null;

      var record = result.records[0];
      return new MovieCast(record.get('title'), record.get('cast'));

      if(!result) return;

      $("#title").text(movie.title);
      $("#poster").attr("src", "http://neo4j-contrib.github.io/developer-resources/language-guides/assets/posters/" + movie.title + ".jpg");
      var $list = $("#crew").empty();
      movie.cast.forEach(cast => {
        $list.append($("<li>" + cast.name + " " + cast.job + (cast.job == "acted" ? " as " + cast.role : "") + "</li>"));
      });
      res.render('index3', {
        movieDescription: movieArr
    }); 
    console.log(movieArr)
    })
  .catch(function(err){
      console.log(err)
      });
}) 
  
function search() {
    var query = $("#search").find("input[name=search]").val();
    api
      .searchMovies(query)
      .then(movies => {
        var t = $("table#results tbody").empty();
  
        if (movies) {
          movies.forEach(movie => {
            $("<tr><td class='movie'>" + movie.title + "</td><td>" + movie.released + "</td><td>" + movie.tagline + "</td></tr>").appendTo(t)
              .click(function() {
                showMovie($(this).find("td.movie").text());
              })
          });
  
          var first = movies[0];
          if (first) {
            showMovie(first.title);
          }
        }
      });
  }
  
  function renderGraph() {
    var width = 800, height = 800;
    var force = d3.layout.force()
      .charge(-200).linkDistance(30).size([width, height]);
  
    var svg = d3.select("#graph").append("svg")
      .attr("width", "100%").attr("height", "100%")
      .attr("pointer-events", "all");
  
    api
      .getGraph()
      .then(graph => {
        force.nodes(graph.nodes).links(graph.links).start();
  
        var link = svg.selectAll(".link")
          .data(graph.links).enter()
          .append("line").attr("class", "link");
  
        var node = svg.selectAll(".node")
          .data(graph.nodes).enter()
          .append("circle")
          .attr("class", d => {
            return "node " + d.label
          })
          .attr("r", 10)
          .call(force.drag);
  
        // html title attribute
        node.append("title")
          .text(d => {
            return d.title;
          });
  
        // force feed algo ticks
        force.on("tick", () => {
          link.attr("x1", d => {
            return d.source.x;
          }).attr("y1", d => {
            return d.source.y;
          }).attr("x2", d => {
            return d.target.x;
          }).attr("y2", d => {
            return d.target.y;
          });
  
          node.attr("cx", d => {
            return d.x;
          }).attr("cy", d => {
            return d.y;
          });
        });
      });
  }

//   $(function () {
//     renderGraph();
//     search();
  
//     $("#search").submit(e => {
//       e.preventDefault();
//       search();
//     });
//   });

  function searchMovies(queryString) {
    var session = driver.session();
    return session
      .run(
        'MATCH (movie:Movie) \
        WHERE movie.title =~ {title} \
        RETURN movie',
        {title: '(?i).*' + queryString + '.*'}
      )
      .then(result => {
        session.close();
        return result.records.map(record => {
          return new Movie(record.get('movie'));
        });
      })
      .catch(error => {
        session.close();
        throw error;
      });
  }
  
  function getMovie(paramName2) {
    var session = driver.session();
    return session
      .run(
        "MATCH (movie:Movie {title:{title}}) \
        OPTIONAL MATCH (movie)<-[r]-(person:Person) \
        RETURN movie.title AS title, \
        collect([person.name, \
             head(split(lower(type(r)), '_')), r.roles]) AS cast \
        LIMIT 1", {paramName2})
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
  
  function getGraph() {
    var session = driver.session();
    return session.run(
      'MATCH (m:Movie)<-[:ACTED_IN]-(a:Person) \
      RETURN m.title AS movie, collect(a.name) AS cast \
      LIMIT {limit}', {limit: 100})
      .then(results => {
        session.close();
        var nodes = [], rels = [], i = 0;
        results.records.forEach(res => {
          nodes.push({title: res.get('movie'), label: 'movie'});
          var target = i;
          i++;
  
          res.get('cast').forEach(name => {
            var actor = {title: name, label: 'actor'};
            var source = _.findIndex(nodes, actor);
            if (source == -1) {
              nodes.push(actor);
              source = i;
              i++;
            }
            rels.push({source, target})
          })
        });
  
        return {nodes, links: rels};
      });
  }
  
  exports.searchMovies = searchMovies;
  exports.getMovie = getMovie;
  exports.getGraph = getGraph;

app.listen(3000);
app.use('/', router);
module.exports = app;
