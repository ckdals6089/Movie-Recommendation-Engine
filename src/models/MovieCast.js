var _ = require('lodash');

function MovieCast(x, m) {
  _.extend(this, {
    title: title,
    cast: cast.map(function (c) {
      return {
        name: c[0],
        job: c[1],
        role: c[2]
      }
    })
  });
}

module.exports = MovieCast;
