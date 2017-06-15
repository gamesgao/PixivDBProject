var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = require('../../dbconf/pool.js');
var sql = require('../../dbconf/sqlMapping.js');
var multer = require('multer');
var upload = multer({ dest: 'public/img/' });

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
router.get('/completeTrade',completeTrade);
router.get('/tradehomepage', tradeHomepage);
router.get('/getTrade/uploadwork', uploadwork);



function trade(req, res, next) {
    var userID = req.session.userID;
    if (userID) {
        pool.getConnection(function (err, connection) {
            if (err) {
                // handle error
                res.render('error');
                connection.release();
                return;
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
                res.render('error');
                connection.release();
                return;
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
                        res.render('error');
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
                status = 0;
                message = '连接数据库失败';
                res.json({
                    status : status,
                    msg: message
                });
                connection.release();
                return;
            }
            connection.query(
                sql.addTrade,
                [body.abstract, body.price, body.deadline, 'Calling', userID]
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
    var tradeID = Number(req.query.tradeID);
    if (userID) {
        pool.getConnection(function (err, connection) {
            if (err) {
                // handle error
                res.render('error');
                connection.release();
                return;
            }
            connection.query(
                sql.getFullTrade +
                sql.getApplier +
                sql.getUserType +
                sql.getTradeUrl,
                [tradeID, tradeID, userID, userID, tradeID]
                , function (err, result) {
                    if (err) {
                        // handle error
                        res.render('error');
                        connection.release();
                    }
                    if (result) {
                        var isApplied = false;
                        var isBuyer = false;
                        var isResponded = false;
                        var type;
                        var url;
                        //if (result[4][0] != null)
                        url = result[4][0].url;
                        var responderID = result[0][0].responder;
                        var buyerID = result[0][0].buyer;
                        if (result[2][0].type == 'o') type = 0;
                        else if(result[2][0].type == 'p') type = 1;
                        else if (result[2][0].type == 'b') type = 2;
                        for (var i = 0; i < result[1].length; i++) {

                            if (userID == result[1][i].id) {
                                isApplied = true;
                            }
                        }
                        if (result[0][0].responder == userID)
                        {
                            isResponded = true;
                        }
                        if (result[0][0].buyer == userID)
                        {
                            isBuyer = true;
                        }
                        //result[1].user_header = 'public/img/header/'+String(result[1].userID)+'.png';
                        sendJSON = {
                            trade: result[0][0],
                            applier: result[1],
                            isApplied: isApplied,
                            isResponded: isResponded,
                            isBuyer: isBuyer,
                            type: type,
                            url: url
                        };
                        connection.query(
                            sql.getUserName +
                            sql.getUserName,
                            [responderID, buyerID]
                            , function (err, result) {
                                if (result[0][0])
                                    sendJSON.respondername = result[0][0].username;
                                else sendJSON.respondername = null;
                                if (result[1][0])
                                    sendJSON.buyername = result[1][0].username;
                                else sendJSON.buyername = null;
                                res.render('getTrade', sendJSON);
                                //connection.release();
                            }
                        );
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
    var painterID = Number(req.query.painterID);
    if (userID) {
        pool.getConnection(function (err, connection) {
            if (err) {
                // handle error
                status = 0;
                message = '连接数据库失败';
                res.json({
                    status : status,
                    msg: message
                });
                connection.release();
                return;
            }
            connection.query(
                    sql.addResponderForTrade,
                [tradeID, painterID,userID]
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
    var tradeID = Number(req.query.tradeID);
    if (userID) {
        pool.getConnection(function (err, connection) {
            if (err) {
                // handle error
                status = 0;
                message = '连接数据库失败';
                res.json({
                    status : status,
                    msg: message
                });
                connection.release();
                return;
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
    var getID = req.query.userID;
    if (!getID) getID = userID;
    if (userID) {
        pool.getConnection(function (err, connection) {
            if (err) {
                // handle error
                res.render('error');
                connection.release();
                return;
            }
            connection.query(
                sql.getRelatedTrades +
                sql.getUserName +
                sql.getUserHeader,
                [getID,getID,getID]
                , function (err, result) {
                    if (err) {
                        // handle error
                        res.render('error');
                    }
                    if (result) {
                        //if (result[1][0] == null)
                          //  result[1] = [];
                        res.render('tradeHomepage',{
                            trade:result[1],
                            username: result[3][0].username,
                            user_header:result[4][0].user_header,
                            userID: getID
                        });
                    }
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
                status = 0;
                message = '连接数据库失败';
                res.json({
                    status : status,
                    msg: message
                });
                connection.release();
                return;
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

function completeTrade(req, res, next) {
    var userID = req.session.userID;
    var status = 1;
    var message = '';
    var tradeID = req.query.tradeID;

    if (userID) {
        pool.getConnection(function (err, connection) {
            if (err) {
                // handle error
                status = 0;
                message = '连接数据库失败';
                res.json({
                    status : status,
                    msg: message
                });
                connection.release();
                return;
            }
            connection.query(
                sql.completeTrade,
                [userID, tradeID]
                , function (err, result) {
                    if (err) {
                        // handle error
                        status = 0;
                        message = '完成交易失败';
                    }
                    if (result) {
                        status = 1;
                        message = '完成交易成功';
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

function uploadwork(req, res, next) {
    var userID = req.session.userID;
    var tradeID = req.query.tradeID;
    if (userID) {
        pool.getConnection(function (err, connection) {
            if (err) {
                // handle error
                res.render('error');
                connection.release();
                return;
            }
            connection.query(
                sql.getUserName +
                sql.getUserHeader,
                [userID, userID]
                , function (err, result) {
                    if (err) {
                        // handle error
                        res.render('error');
                    }
                    if (result) {
                        res.render('uploadwork',
                            {
                                username: result[0][0].username,
                                user_header: result[1][0].user_header,
                                userID: req.query.userID,
                                tradeID: tradeID
                            });
                    }
                    connection.release();
                }
            );
        });
    }
    else
    {
        res.redirect('/login');
    }
}

module.exports = router;