var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = require('../../dbconf/pool.js');
var sql = require('../../dbconf/sqlMapping.js');

router.get('/', comm);
router.post('/addTag', addTag);
router.post('/delTag', delTag);
router.post('/upvote', upvote);

function comm(req, res, next) {
    var illustID = Number(req.query.paintingID);
    if (illustID) {
        pool.getConnection(function (err, connection) {
            if (err) {
                // handle error
                res.render('error');
                return;
            }
            connection.query(
                sql.getUserNameByPaintingID +
                sql.getUserHeaderByPaintingID +
                sql.getUserIDByPaintingID +
                sql.getUrl +
                sql.getPaintingName +
                sql.getTagByPaintingID +
                sql.getCreatedTime +
                sql.getResolution +
                sql.getRatedCount +
                sql.getViewCount +
                sql.addView,
                [illustID, illustID, illustID, illustID, illustID,
                    illustID, illustID, illustID, illustID, illustID, illustID]
                , function (err, result) {
                    connection.release();
                    if (err) {
                        // handle error
                        res.render('error');
                    }
                    if (result) {
                        res.render('illust', {
                            username : result[0][0].username,
                            user_header : result[1][0].user_header,
                            userID : result[2][0].userID,
                            url : result[3][0].url,
                            painting_name : result[4][0].topic,
                            tag : JSON.stringify(result[5]),
                            time : result[6][0].time,
                            resolution : String(result[7][0].width)+'×'+String(result[7][0].length),
                            ratedCount : result[8][0].ratedCount,
                            viewCount : result[9][0].viewCount,
                            paintingID : illustID
                            });
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

function delTag(req, res, next) {
    var userID = req.session.userID;
    var tag = req.body.tag;
    var paintingID = Number(req.body.paintingID);
    var status = 0;
    var message = '';
    if (userID && paintingID)
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
                return;
            }
            connection.query(
                sql.delPaintingTag,
                [paintingID, tag, userID]
                , function (err, result) {
                    connection.release();
                    if (err) {
                        // handle error
                        status = 0;
                        message = '删除画tag失败';
                    }
                    if (result) {
                        status = 1;
                        message = '删除画tag成功';
                    }
                    res.json({
                        status:status,
                        msg:message
                    });
                    return;
                }
            );
        });
    }
    else
    {
        //handle error
        res.redirect('/login')
    }
}

function addTag(req, res, next) {
    var tag = req.body.tag;
    var paintingID = Number(req.body.paintingID);
    var status = 0;
    var message = '';
    var userID = req.session.userID;
    if (userID && paintingID)
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
                return;
            }
            connection.query(
                sql.addPaintingTag,
                [paintingID,tag]
                , function (err, result) {
                    connection.release();
                    if (err) {
                        status = 0;
                        message = '添加画tag失败';
                        // handle error
                    }
                    if (result) {
                        status = 1;
                        message = '添加画tag成功';
                    }
                    res.json({
                        status:status,
                        msg:message
                    });
                    return;
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

function upvote(req, res, next) {
    var userID = req.session.userID;
    var paintingID = Number(req.body.paintingID);
    var status = 0;
    var message = '';
    if (userID && paintingID)
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
                return;
            }
            connection.query(
                sql.upvote,
                [userID, paintingID, paintingID]
                , function (err, result) {
                    connection.release();
                    if (err) {
                        // handle error
                        status = 0;
                        message = '点赞失败';
                    }
                    else if (result) {
                        status = 1;
                        message = '点赞成功';
                    }
                    res.json({
                        status:status,
                        msg:message
                    });
                    return;
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

module.exports = router;