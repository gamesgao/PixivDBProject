var express = require('express');
var router = express.Router();

router.get('/', index);

function index(req, res, next) {
  res.render('index', {
  	title:'pm2.5 cloud platform',
  }

  )
}

module.exports = router;
