var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = require('../../dbconf/pool.js');
var sql = require('../../dbconf/sqlMapping.js');

router.get('/', comm);
router.get('/addTag', addTag);
router.get('/delTag', delTag);

function comm(req, res, next) {
    var illustID = req.require.illustId;
    if (illustID) {
        pool.getConnection(function (err, connection) {
            if (err) {
                // handle error
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
                sql.getViewCount,
                [illustID, illustID, illustID, illustID, illustID,
                    illustID, illustID, illustID, illustID, illustID]
                , function (err, result) {
                    if (err) {
                        // handle error
                        res.render('error');
                    }
                    if (result) {
                        res.render('illust', {
                            username : result[0].username,
                            user_header : result[1].user_header,
                            userID : result[2].userID,
                            url : result[3].url,
                            painting_name : result[4].painting_name,
                            tag : result[5],
                            time : result[6].time,
                            resolution : result[7].resolution,
                            ratedCount : result[8].ratedCount,
                            viewCount : result[9].viewCount
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

function delTag(req, res, next) {
    var userID = req.session.userID;
    var tag = req.body.tag;
    var paintingID = req.require.paintingID;
    var status = 0;
    var message = '';
    if (userID && paintingID)
    {
        pool.getConnection(function (err, connection) {
            if (err) {
                // handle error
            }
            connection.query(
                sql.delPaintingTag,
                [userID, tag, paintingID]
                , function (err, result) {
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
                    connection.release();
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
    var paintingID = req.require.paintingID;
    var status = 0;
    var message = '';
    if (userID && paintingID)
    {
        pool.getConnection(function (err, connection) {
            if (err) {
                // handle error
            }
            connection.query(
                sql.addPaintingTag,
                [tag, paintingID]
                , function (err, result) {
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

module.exports = router;