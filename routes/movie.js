const router = require('express').Router();
const {
  getMovie,
  deleteMovie,
  createMovie,
} = require('../controlers/movie');

router.get('/', getMovie);

router.post('/', createMovie);

router.delete('/:movieID', deleteMovie);

module.exports.movieRouter = router;
