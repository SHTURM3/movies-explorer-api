const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');
const NotFound = require('../errors/NotFound');
const Unauthorized = require('../errors/Unauthorized');

const login = (request, response, next) => {
  console.log('request.body: (login) ', request.body);
  const { email, password } = request.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      console.log('function - login ==>', user);
      if (!user) {
        throw new BadRequest('Пользователь не найден.');
      }
      response.send({
        token: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'yandex-practicum-thebest', { expiresIn: '7d' }),
      });
    })
    .catch(() => {
      next(new Unauthorized('Логин или пароль неверны.'));
    });
};

const createUser = (request, response, next) => {
  console.log('request.body ==> (registarion) ', request.body);

  const {
    email,
    password,
    name,
  } = request.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => {
      console.log(user);
      response.status(201).send({
        email: user.email,
        name: user.name,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Проверьте правильность введенных данных.'));
      }

      if (err.code === 11000) {
        return next(new Conflict('Такой пользователь уже существует.'));
      }
      return next(err);
    });
};

const getCurrentUser = (request, response, next) => {
  console.log(request.matched);
  User.findById(request.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Запрашиваемый пользователь не найден.');
      }

      return response.send(user);
    })
    .catch((err) => next(err));
};

const changeProfile = (request, response, next) => {
  const { name, email } = request.body;
  User.findByIdAndUpdate(request.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFound('Такого пользователя не существует.');
      }
      return response.status(200).send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Имя или описание пользователя не должно быть менее 2-х и более 30-ти символов.'));
      }
      if (err.kind === 'ObjectId') {
        return next(new BadRequest('ID пользователя передано некорретно.'));
      }
      return next(err);
    });
};

module.exports = {
  getCurrentUser,
  changeProfile,
  createUser,
  login,
};
