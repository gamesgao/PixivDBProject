var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = require('../../dbconf/pool.js');
var sql = require('../../dbconf/sqlMapping.js');

// 招标的主页
// 感觉画家接单也可以直接放在这个页面
router.get('/', trade);
// 招标的发起页
router.get('/applytrade', applyTrade);
// 交易的界面，包括各种状态
router.get('transaction', transaction);


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
                sql.getBriefTrade
                ,
                [userID]
                , function (err, result) {
                    if (err) {
                        // handle error
                    }
                    if (result) {
                        res.render('illust', {title: 'pm2.5 cloud platform'});
                    }
                    connection.release();
                }
            );
        });
    }
    else
    {
        //handle error
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
                        res.render('illust', {title: 'pm2.5 cloud platform'});
                    }
                    connection.release();
                }
            );
        });
    }
    else
    {
        //handle error
    }
}

function initialTradePost(req, res, next) {
    var userID = req.session.userID;
    var status = 1;
    var message = '';
    if (userID)
    {
        pool.getConnection(function (err, connection) {
            if (err) {
                // handle error
            }
            connection.query(
                sql.addTrade,
                [userID, userID, userID]
                , function (err, result) {
                    if (err) {
                        // handle error
                        status = 0;
                        message = '加入Trade失败';
                        res.json({status:status, msg:message});
                        return;
                    }
                    if (result) {
                        var trade_id = result[0].tradeID;
                        var tags = req.body.tags;
                        var trade_tag_pair = new Array(tags.length);
                        for (var i = 0; i < tags.length, i++;)
                        {
                            trade_tag_pair[i] = [trade_id, tags[i]];
                        }
                        connection.query(
                            sql.addTradeTags,
                            [userID, userID, userID]
                            , function (err, result) {
                                if (err) {
                                    //handle error
                                    status = 0;
                                    message = '加入Tags给Trade失败';
                                    res.json({status:status, msg:message});
                                }
                                if (result)
                                {
                                    status = 1;
                                    message = '加入Tags成功';
                                    res.json({status:status, msg:message});
                                }
                                connection.release();
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
    }
}

function applyTrade(req, res, next) {
    return;
}

function transaction(req, res, next) {
    return;
}

module.exports = router;