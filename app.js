require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');

const { dataMovies, PORT } = require('./config/config');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes/index');

const serverError = require('./middlewares/serverError');

mongoose.connect(dataMovies);

const app = express();

app.use(express.json());

app.use(requestLogger);

app.use(helmet());

app.use(cors());

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(serverError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
