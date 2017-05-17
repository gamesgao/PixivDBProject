var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = require('../../dbconf/pool.js');
var sql = require('../../dbconf/sqlMapping.js');

router.get('/', search);
router.get('/user', searchUser);


function search(req, res, next) {
    res.render('search', { title: 'pm2.5 cloud platform' })
}

function searchUser(req,res,next) {
    var userID = req.session.userID;
    var namesnippet = req.query.namesnippet;
    if (userID) {
        pool.getConnection(function (err, connection) {
            if (err) {
                // handle error
            }
            connection.query(
                sql.searchUserByName
                ,
                [namesnippet]
                , function (err, result) {
                    if (err) {
                        // handle error
                        res.render('error');
                    }
                    if (result) {
                        res.render('user', {
                            user : result[0]
                        });
                    }
                    connection.release();
                }
            );
        });
    }
    else {
        //handle error
        res.redirect('/login');
    }
}
module.exports = router;
