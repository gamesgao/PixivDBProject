var express = require('express');
var router = express.Router();


router.get('/', comm);

function comm(req, res, next) {
    res.render('comm', { title: 'pm2.5 cloud platform' })
};

module.exports = router;