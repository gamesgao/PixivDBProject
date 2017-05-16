var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = require('../../dbconf/pool.js');
var sql = require('../../dbconf/sqlMapping.js');

router.get('/', search);
router.get('/user', searchUser);


function search(req, res, next) {
    res.render('search', { title: 'pm2.5 cloud platform' })
};

function searchUser(req,res,next)
{
    
}
module.exports = router;