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
                sql.painting_name +
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

function delTag(req, res, next) {
    var userID = req.session.userID;
    var tag = req.body.tag;
    var paintingID = req.body.paintingID;
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

function addTag(req, res, next) {
    var tag = req.body.tag;
    var paintingID = req.body.paintingID;
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

module.exports = router;