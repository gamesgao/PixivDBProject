var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = require('../../dbconf/pool.js');
var sql = require('../../dbconf/sqlMapping.js');

// 招标的主页
// 感觉画家接单也可以直接放在这个页面
router.get('/', trade);
// 招标的发起页
router.post('/initTrade',initialTradePost);
router.get('/initTrade',initialTradeGet);
router.get('/getTrade',getTrade);
router.get('/getTrade/selectpainter',selectPainter);
router.get('/getTrade/applyfortrade',applyForTrade);
router.get('/cancelTrade',cancelTrade);

router.get('/tradehomepage', tradeHomepage);


function trade(req, res, next) {
    var userID = req.session.userID;
    if (userID) {
        pool.getConnection(function (err, connection) {
            if (err) {
                // handle error
            }
            connection.query(
                sql.getUserName +
                sql.getUserHeader +
                sql.getBuyerFlag +
                sql.getAllBriefTrade
                ,
                [userID, userID, userID]
                , function (err, result) {
                    if (err) {
                        // handle error
                        res.render('error');
                    }
                    if (result) {
                        res.render('trade', {
                            username : result[0][0].username,
                            user_header : result[1][0].user_header,
                            userID : userID,
                            buyerflag : result[2][0].buyerflag,
                            trade : result[3]
                        });
                    }
                    connection.release();
                }
            );
        });
    }
    else
    {
        //handle error
        res.redirect('/login');
    }
}

function initialTradeGet(req, res, next) {
    var userID = req.session.userID;
    if (userID)
    {
        pool.getConnection(function (err, connection) {
            if (err) {
                // handle error
            }
            connection.query(
                sql.getUserName +
                sql.getUserHeader +
                sql.getBuyerFlag
                ,
                [userID, userID, userID]
                , function (err, result) {
                    if (err) {
                        // handle error
                    }
                    if (result) {
                        res.render('initTrade', {
                            username : result[0][0].username,
                            user_header : result[1][0].user_header,
                            buyerflag : result[2][0].buyerflag,
                            userID : userID
                        });
                    }
                    connection.release();
                }
            );
        });
    }
    else
    {
        //handle error
        res.redirect('/login');
    }
}

function initialTradePost(req, res, next) {
    var userID = req.session.userID;
    var body = req.body;
    var status = 1;
    var message = '';
    var trade = req.body;
    if (userID)
    {
        pool.getConnection(function (err, connection) {
            if (err) {
                // handle error
            }
            connection.query(
                sql.addTrade,
                [body.abstract, body.price, body.deadline, 'start', userID]
                , function (err, result) {
                    if (err) {
                        // handle error
                        status = 0;
                        message = '加入Trade失败';
                        res.json({status:status, msg:message});
                        connection.release();
                        return;
                    }
                    if (result) {
                        var trade_id = Number(result[1][0].tradeID);
                        var tags = req.body.tag;
                        var trade_tag_pair = new Array(tags.length);
                        for (var i = 0; i < tags.length; i++)
                        {
                            trade_tag_pair[i] = [trade_id,tags[i]];
                        }
                        connection.query(
                            sql.addTradeTags,
                            [trade_tag_pair]
                            , function (err, result) {
                                if (err) {
                                    //handle error
                                    status = 0;
                                    message = '加入Tags给Trade失败';
                                    res.json({status:status, msg:message});
                                    connection.release();
                                    return;
                                }
                                if (result)
                                {
                                    status = 1;
                                    message = '加入Tags给Trade成功';
                                    res.json({status:status, msg:message});
                                    connection.release();
                                    return;
                                }
                            }
                        );
                    }
                }
            );
        });
    }
    else
    {
        //handle error
        res.redirect('/login');
    }
}

function getTrade(req, res, next) {
    var userID = req.session.userID;
    var tradeID = req.query.tradeID;
    if (userID) {
        pool.getConnection(function (err, connection) {
            if (err) {
                // handle error
            }
            connection.query(
                sql.getFullTrade +
                sql.getApplier,
                [tradeID, tradeID]
                , function (err, result) {
                    if (err) {
                        // handle error
                        res.render('error');
                    }
                    if (result) {
                        result[1].user_header = 'public/img/header/'+String(result[1].userID)+'.png';
                        res.render('getTrade',{
                            trade : result[0],
                            applier : result[1]

                        });
                    }
                    connection.release();
                });
        });
    }
    else
    {
        //handle error
        res.redirect('/login');
    }
}

function selectPainter(req, res, next) {
    var userID = req.session.userID;
    var status = 1;
    var message = '';
    var tradeID = req.query.tradeID;
    var painterID = req.query.painterID;
    if (userID) {
        pool.getConnection(function (err, connection) {
            if (err) {
                // handle error
            }
            connection.query(
                sql.addResponderForTrade,
                [userID, tradeID, painterID]
                , function (err, result) {
                    if (err) {
                        // handle error
                        status = 0;
                        message = '选择画家失败';
                    }
                    if (result) {
                        status = 1;
                        message = '选择画家成功';
                    }
                    res.json({
                        status : status,
                        msg : message
                    });
                    connection.release();
                    return;
                });
        });
    }
    else
    {
        //handle error
        res.redirect('/login');
    }
}

function applyForTrade(req, res, next) {
    var userID = req.session.userID;
    var status = 1;
    var message = '';
    var tradeID = req.query.tradeID;
    if (userID) {
        pool.getConnection(function (err, connection) {
            if (err) {
                // handle error
            }
            connection.query(
                sql.addApplierForTrade,
                [userID, tradeID]
                , function (err, result) {
                    if (err) {
                        // handle error
                        status = 0;
                        message = '应聘交易失败';
                    }
                    if (result) {
                        status = 1;
                        message = '应聘交易成功';
                    }
                    res.json({
                        status : status,
                        msg : message
                    });
                    connection.release();
                    return;
                });
        });
    }
    else
    {
        //handle error
        res.redirect('/login');
    }
}

function tradeHomepage(req, res, next) {
    var userID = req.session.userID;
    var status = 1;
    var message = '';
    if (userID) {
        pool.getConnection(function (err, connection) {
            if (err) {
                // handle error
            }
            connection.query(
                sql.getRelatedTrades,
                [userID]
                , function (err, result) {
                    if (err) {
                        // handle error
                        status = 0;
                        message = '获取用户相关交易失败';
                    }
                    if (result) {
                        status = 1;
                        message = '获取用户相关交易成功';
                    }
                    res.json({
                        status : status,
                        msg : message
                    });
                    connection.release();
                    return;
                });
        });
    }
    else
    {
        //handle error
        res.redirect('/login');
    }
}

function cancelTrade(req, res, next) {
    var userID = req.session.userID;
    var status = 1;
    var message = '';
    var tradeID = req.query.tradeID;
    if (userID) {
        pool.getConnection(function (err, connection) {
            if (err) {
                // handle error
            }
            connection.query(
                sql.cancelTrade,
                [userID, tradeID]
                , function (err, result) {
                    if (err) {
                        // handle error
                        status = 0;
                        message = '取消交易失败';
                    }
                    if (result) {
                        status = 1;
                        message = '取消交易成功';
                    }
                    res.json({
                        status : status,
                        msg : message
                    });
                    connection.release();
                    return;
                });
        });
    }
    else
    {
        //handle error
        res.redirect('/login');
    }
}


function applyTrade(req, res, next) {
    return;
}

function transaction(req, res, next) {
    return;
}

module.exports = router;