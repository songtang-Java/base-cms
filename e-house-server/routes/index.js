var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/test', function(req, res, next) {
  res.json({

  })
});

const adminUser = require('../controller/adminUser');
const upload = require('../controller/upload');
const news = require('../controller/news');
const swiper = require('../controller/swiper');
const jwt = require('../controller/config/jwt');
const users = require('../controller/users');
const comments = require('../controller/comments');
const categories = require('../controller/categories');
const captcha = require('../controller/config/captcha');

router.use('/admine',adminUser);
router.use(upload);
router.use('/news',news);
router.use('/swiper',swiper);
router.use('/jwt',jwt);
router.use('/users', users);
router.use('/comments', comments);
router.use('/categories', categories);
router.use(captcha);

module.exports = router;
