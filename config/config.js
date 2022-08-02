const {
  dataMovies = 'mongodb://localhost:27017/moviesdb',
  PORT = 3001,
  NODE_ENV,
  JWT_SECRET,
} = process.env;

module.exports = {
  dataMovies,
  PORT,
  NODE_ENV,
  JWT_SECRET,
};
