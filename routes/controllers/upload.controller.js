var express = require('express');
var router = express.Router();


router.get('/', upload);

function upload(req, res, next) {
    res.render('upload', { title: 'pm2.5 cloud platform' })
};

module.exports = router;