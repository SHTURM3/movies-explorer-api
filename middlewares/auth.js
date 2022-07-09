const jwt = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET } = require('../config/config');

const Unauthorized = require('../errors/Unauthorized');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (request, _, next) => {
  const { authorization } = request.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized('Необходима авторизация.');
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'yandex-practicum-thebest');
  } catch (err) {
    return next(new Unauthorized('Необходима авторизация.'));
  }

  request.user = payload;

  return next();
};
