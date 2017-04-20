var express = require('express');
var router = express.Router();

router.get('/', map);

function map(req, res, next) {
  	res.render('map', {
	  	title:'pm2.5 cloud platform',
  	})
}

module.exports = router;
