var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = require('../../dbconf/pool.js');
var sql = require('../../dbconf/sqlMapping.js');

router.get('/', search);
router.get('/user', searchUserGet);
router.post('/user', searchUserPost);
router.get('/painting',searchPaintingGet);
router.post('/painting',searchPaintingPost);


function search(req, res, next) {
    res.render('search');
}


//get
function searchUserGet(req,res,next) {
    var userID = req.session.userID;
    if (userID) {
        pool.getConnection(function (err, connection) {
            if (err) {
                // handle error
            }
            connection.query(
                sql.getUserName +
                sql.getUserHeader,
                [userID, userID]
                , function (err, result) {
                    if (err) {
                        //handle error
                        res.render('error');
                    }
                    if (result) {
                        res.render('searchUser', {
                            username: result[0][0].username,
                            user_header: result[1][0].user_header,
                            userID: userID
                        });
                    }
                    connection.release();
                });

        });
    }
}

//post
function searchUserPost(req,res,next) {
    var userID = req.session.userID;
    var namesnippet = '%'.concat(req.body.username.concat('%'));

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

//get
function searchPaintingGet(req,res,next) {
    var userID = req.session.userID;
    if (userID)
    {
        res.render('/');
    }
    else
    {
        res.render('/');
    }
}


//post
function searchPaintingPost(req,res,next) {
    var userID = req.session.userID;
    var userRequire = req.body;
    var statement = 'SELECT * FROM painting WHERE ';
    var num = 0;
    if (userRequire.byID) {
        if (num > 0) statement += 'and ';
        statement += 'id = ';
    }
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
