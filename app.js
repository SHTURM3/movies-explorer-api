require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const auth = require('./middlewares/auth');
const { userRouter } = require('./routes/user');
const { movieRouter } = require('./routes/movie');
const { createUser, login } = require('./controlers/user');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFound = require('./errors/NotFound');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

const app = express();

app.use(express.json());

app.use(requestLogger);

app.post('/signup', createUser);

app.post('/signin', login);

app.use(auth);

app.use('/users', userRouter);

app.use('/movies', movieRouter);

app.use('*', (_, __, next) => next(new NotFound('Такой страницы не существует.')));

app.use(errorLogger);

app.use((error, _, response, next) => {
  const { statusCode = 500, message } = error;

  response.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
