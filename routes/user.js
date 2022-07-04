const router = require('express').Router();
const {
  getCurrentUser,
  changeProfile,
} = require('../controlers/user');

router.patch('/me', changeProfile);

router.get('/me', getCurrentUser);

module.exports.userRouter = router;
