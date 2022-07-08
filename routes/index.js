const router = require('express').Router();
const auth = require('../middlewares/auth');
const authRouter = require('./auth');
const NotFoundError = require('../errors/NotFound');

router.use(authRouter);

router.use(auth);

router.use(require('./user'));
router.use(require('./movie'));

router.use('*', (_, __, next) => next(new NotFoundError('Такой страницы не существует.')));

module.exports = router;
