const router = require('express').Router();
const { createUser, login } = require('../controlers/user');

router.patch('/signup', createUser);

router.get('/signin', login);

module.exports = router;
