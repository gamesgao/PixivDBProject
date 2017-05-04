var express = require('express');

var router = express.Router();

router.get('/', data);
router.get('/config', config);

function data(req, res, next) {
    res.render('data', { title: 'pm2.5 cloud platform' });
}

function config(req, res, next) {
    res.render('data', { title: 'pm2.5 cloud platform' });
}


module.exports = router;