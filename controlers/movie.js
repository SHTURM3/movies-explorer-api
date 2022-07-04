const Movie = require('../models/movie');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');

const getMovie = (_, response, next) => {
  Movie.find({})
    .then((movie) => {
      response.status(200).send(movie);
    })
    .catch((next));
};

const deleteMovie = (request, response, next) => {
  Movie.findById(request.params.movieID)
    .then((movie) => {
      if (!movie) {
        throw new NotFound('Данный фильм не существует или удалён ранее.');
      }
      if (!movie.owner.equals(request.user._id)) {
        throw new Forbidden('Вы не можете удалить фильм другого пользователя.');
      }
      return movie.remove()
        .then(() => response.send(movie));
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return next(new BadRequest('Данный фильм не найден.'));
      }
      return next(err);
    });
};

const createMovie = (request, response, next) => {
  console.log('request.body: ', request.body);
  console.log('Id пользователя создавшего пост: ', request.user._id);

  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner = request.user._id,
    movieId,
    nameRU,
    nameEN,
  } = request.body;

  if (
    !country
    || !director
    || !duration
    || !year
    || !description
    || !image
    || !trailerLink
    || !thumbnail
    || !owner
    || !movieId
    || !nameRU
    || !nameEN
  ) {
    throw new BadRequest('Ошибка валидации. Данные не введены или введены неверно.');
  }

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => {
      response.status(201).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Проверьте правильность введенных данных.'));
      }
      return next(err);
    });
};

module.exports = {
  getMovie,
  deleteMovie,
  createMovie,
};
