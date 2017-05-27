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
    var status = 0;
    var message = '';
    if (userID) {
        pool.getConnection(function (err, connection) {
            if (err) {
                // handle error
                status = 0;
                message = '';
                res.json({
                    status: status,
                    msg: message,
                    data: {}
                });
                connection.release();
                return;
            }
            connection.query(
                sql.searchUserByName
                ,
                [namesnippet]
                , function (err, result) {
                    if (err) {
                        // handle error
                        status = 0;
                        message = '';
                        res.json({
                            status: status,
                            msg: message,
                            data: {}
                        });
                        connection.release();
                        return;
                    }
                    if (result) {
                        var data = new Array(result.length);
                        for (var i = 0; i < result.length; i++) {
                            data[i] = {};
                            data[i].header = result[i].icon;
                            data[i].username = result[i].username;
                            data[i].userID = result[i].id;
                        }
                        console.log(data);
                        res.json({
                            status: 1,
                            msg: '已找到',
                            data: data
                        });
                        connection.release();
                        return;
                    }
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
                        res.render('searchpainting', {
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
function searchPaintingPost(req,res,next) {
    var userID = req.session.userID;
    var userRequire = req.body;
    var statement = 'SELECT url, id AS paintingID, topic AS name, upvote, page_view AS pageView FROM painting WHERE ';
    var num = 0;
    var query = new Array(4);
    var status;
    var message = '';

    if (userRequire.byID) {
        if (num > 0) statement += 'and ';
        statement += 'id = ? ' ;
        query[num] = Number(userRequire.byID);
        num++;
    }
    if (userRequire.byTopic) {
        if (num > 0) statement += 'and ';
        statement += 'topic like ? ' ;
        query[num] = '%'+userRequire.byTopic+'%';
        num++
    }
    if (userRequire.byUpvote) {
        if (num > 0) statement += 'and ';
        statement += 'upvote >= ? ' ;
        query[num] = Number(userRequire.byUpvote);
        num++
    }
    if (userRequire.byPageView) {
        if (num > 0) statement += 'and ';
        statement += 'page_view >= ? ' ;
        query[num] = Number(userRequire.byPageView);
        num++
    }
    if (userRequire.OrderByID) {
        statement += 'order by id' ;
    }
    if (userRequire.OrderByPageView) {
        statement += 'order by page_view' ;
    }
    if (userRequire.OrderByUpvote) {
        statement += 'order by upvote' ;
    }
    statement += ';';

    if (userID) {
        pool.getConnection(function (err, connection) {
            if (err) {
                // handle error
                status = 0;
                message = '';
                res.json({
                    status: status,
                    msg: message
                });
                connection.release();
                return;
            }
            connection.query(
                statement,
                query, function (err, result) {
                    if (err) {
                        // handle error
                        status = 0;
                        message = '';
                        res.json({
                            status: status,
                            msg: message
                        });
                        connection.release();
                        return;
                    }
                    if (result) {
                        status = 1;
                        message = '查找画成功';
                        res.json({
                            status: status,
                            msg: message,
                            painting: result
                        });
                        connection.release();
                        return;
                    }
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
