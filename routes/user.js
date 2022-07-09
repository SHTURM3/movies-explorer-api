const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCurrentUser,
  changeProfile,
} = require('../controlers/user');

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), changeProfile);

router.get('/users/me', getCurrentUser);

module.exports = router;
