var express = require('express');
var router = express.Router();


router.get('/', search);

function search(req, res, next) {
    res.render('search', { title: 'pm2.5 cloud platform' })
};

module.exports = router;