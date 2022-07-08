module.exports = ((error, _, response, next) => {
  const { statusCode = 500, message } = error;

  response.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
});
