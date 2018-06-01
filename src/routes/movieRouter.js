const express = require('express');
const bodyParser = require('body-parser');

const movieRouter = express.Router();

movieRouter.use(bodyParser.json()); 

movieRouter.route('/')
.all((req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  next();
})
.get((req, res, next) => {
  res.end('Will send all movies to client');
})
.post((req, res, next) => {
  res.end('Will add the movie: ' + req.body.name + 
    ' with details: ' + req.body.description);
})
.put((req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /movies');
})
.delete((req, res, next) => {
  res.end('Deleting all movies!');
});

movieRouter.route('/:movieId')
.get((req, res, next) => {
  res.end('Will send details of movie: ' +
    req.params.movieId + ' to you!');
})  
.post((req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /movies/' + 
    req.params.movieId);
})
.put((req, res, next) => {
  res.write('Update the movie: ' + req.params.movieId + '\n');
  res.end('Will update the movie: ' + req.body.name + 
    ' with details: ' +  req.body.description);
})
.delete((req, res, next) => {
  res.end('Deleting movie: ' + req.params.movieId);
});

module.exports = movieRouter;