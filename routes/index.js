const router = require('express').Router();
const entry = require('./auth');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFound');

router.use(entry);

router.use(auth);

router.use(require('./user'));
router.use(require('./movie'));

router.use('*', (_, __, next) => next(new NotFoundError('Такой страницы не существует.')));

module.exports = router;
