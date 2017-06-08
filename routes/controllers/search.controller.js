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
router.get('/trade',searchTradeGet);
router.post('/trade',searchTradePost);


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
    else{
        res.redirect('/login');
    }
}

//post
function searchUserPost(req,res,next) {
    var userID = req.session.userID;
    var namesnippet = '%'.concat(req.body.username.concat('%'));
    var status = 0;
    var message = '';
    var offset = req.body.offset;
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
                [namesnippet,offset]
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
    else{
        res.redirect('/login');
    }
}



//post
function searchPaintingPost(req,res,next) {
    var userID = req.session.userID;
    var userRequire = req.body;
    var statement = '';
    if (userRequire.byTag) {
        statement = 'SELECT DISTINCT id AS paintingID, url, topic AS name, upvote, page_view AS pageView FROM painting, painting_tag WHERE painting = id ';
    }
    else
        statement = 'SELECT DISTINCT id AS paintingID, url, topic AS name, upvote, page_view AS pageView FROM painting WHERE 1=1 ';
    var num = 0;
    var query = new Array(4);
    var status;
    var message = '';

    if (userRequire.byID) {
        statement += 'and ';
        statement += 'id = ? ' ;
        query[num] = Number(userRequire.byID);
        num++;
    }
    if (userRequire.byTopic) {
        statement += 'and ';
        statement += 'topic like ? ' ;
        query[num] = '%'+userRequire.byTopic+'%';
        num++
    }
    if (userRequire.byUpvote) {
        statement += 'and ';
        statement += 'upvote >= ? ' ;
        query[num] = Number(userRequire.byUpvote);
        num++
    }
    if (userRequire.byPageView) {
        statement += 'and ';
        statement += 'page_view >= ? ' ;
        query[num] = Number(userRequire.byPageView);
        num++
    }
    if (userRequire.byTag) {
        statement += 'and ';
        statement += 'tag like ? ' ;
        query[num] = '%'+userRequire.byTag+'%';
        num++
    }
    if (userRequire.OrderByID) {
        statement += 'order by id ' ;
    }
    if (userRequire.OrderByPageView) {
        statement += 'order by page_view ' ;
    }
    if (userRequire.OrderByUpvote) {
        statement += 'order by upvote ' ;
    }
    statement += 'limit ?,18 ';
    query[num] = Number(userRequire.offset);
    num++;
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


//get
function searchTradeGet(req,res,next) {
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
                        res.render('searchtrade', {
                            username: result[0][0].username,
                            user_header: result[1][0].user_header,
                            userID: userID
                        });
                    }
                    connection.release();
                });

        });
    }
    else{
        res.redirect('/login');
    }
}



//post
function searchTradePost(req,res,next) {
    var userID = req.session.userID;
    var userRequire = req.body;
    var statement = '';
    if (userRequire.byTag)
        statement = 'SELECT DISTINCT t.id AS tradeID, t.buyer AS buyer, t.price AS price, t.deadline AS ddl, t.status AS state, u.username AS buyername FROM trade t,user u, trade_tag ttag WHERE t.buyer = u.id and ttag.trade = t.id ';
    else
        statement = 'SELECT DISTINCT t.id AS tradeID, t.buyer AS buyer, t.price AS price, t.deadline AS ddl, t.status AS state, u.username AS buyername FROM trade t,user u WHERE t.buyer = u.id ';
    var num = 0;
    var query = new Array(4);
    var status;
    var message = '';

    if (userRequire.byTag) {
        statement += 'and ';
        statement += 'ttag.tag LIKE ? ' ;
        query[num] = '%'+userRequire.byTag+'%';
        num++;
    }
    if (userRequire.byDesc) {
        statement += 'and ';
        statement += 't.description like ? ' ;
        query[num] = '%'+userRequire.byDesc+'%';
        num++
    }
    statement += 'limit ?,18 ';
    query[num] = Number(userRequire.offset);
    num++;
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
                        message = '查找交易成功';
                        res.json({
                            status: status,
                            msg: message,
                            trade: result
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
