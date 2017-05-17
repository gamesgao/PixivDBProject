var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = require('../../dbconf/pool.js');
var sql = require('../../dbconf/sqlMapping.js');
var jsonWrite = require('../../dbconf/jsonWrite.js');
var multer  = require('multer');
var fs = require('fs');
var upload = multer({ dest: 'uploads/' });
router.get('/', data);
router.get('/config', config);
router.get('/config/upload', configUpload);
router.get('/following', following);
router.get('/addfollowing', addFollowing);
router.get('/delfollowing', delFollowing);
router.get('/collect', collect);
router.get('/addcollect', addCollecting);
router.get('/delcollect', delCollecting);
router.post('/contributeupload', upload.single('painting'), contributeUpload);
router.get('/addcontribute', addContribute);
router.get('/delcontribute', delContribute);

function data(req, res, next) {
	var data = req.query;
	var userID = data.userID;
	//try multiple queries
    if (userID) {
        pool.getConnection(function (err, connection) {
            if (err) {
                // handle error
                res.render('error');
            }
            connection.query(
                sql.getUserContributePainting +
                sql.getUserName +
                sql.getFollowing +
                sql.getFollowingNum +
                sql.getColletedPainting +
                sql.getMostTag +
                sql.getUserHeader,
                [userID, userID, userID, userID, userID, userID, userID]
                , function (err, result) {
                    if (err) {
                        // handle error
                        res.render('error');
                    }
                    if (result) {
                        res.render('homepage',
                            {
                                contribute_painting: result[0],
                                username: result[1].username,
                                following: result[2],
                                following_num: result[3].following_num,
                                collect_painting: result[4],
                                tag: result[5],
                                user_header: result[6].user_header,
                                userID: req.query.userID
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

//get
function config(req, res, next) {
    var userID = req.session.userID;
    if (userID)
    {
        pool.getConnection(function(err, connection) {
            if (err)
            {
                // handle error
            }
            connection.query(
                sql.getUserName +
                sql.getUserHeader +
                sql.getUserAlipay,
                [userID, userID, userID],
                function (err, result) {
                    if (err)
                    {
                        //error handler
                        res.render('error');
                    }
                    if (result)
                    {
                        res.render('config', {
                            username : result[0].username,
                            user_header : result[1].user_header,
                            alipay : result[2].alipay,
                            userID : req.session.userID
                        });
                    }
                });

        });
    }
    else{
        //handle error
        res.redirect('/login');
    }
}

function configUpload(req, res, next) {
    var userID = req.session.userID;
    var newName = req.body.newname;
    var new_alipay = req.body.newAlipay;
    var status = 0;
    var message = '';
    if (userID)
    {
        pool.getConnection(function(err, connection) {
            if (err)
            {
                // handle error
                status = 0;
                message = '上传设置失败';
                res.json(
                    {
                       status : status,
                        msg : message
                    });
            }
            connection.query(
                sql.modifyUserInfo,
                [userID, newName, new_alipay],
                function (err, result) {
                    if (err)
                    {
                        //error handler
                        status = 0;
                        message = '上传设置失败';
                        res.json(
                            {
                                status : status,
                                msg : message
                            });
                    }
                    if (result)
                    {
                        status = 1;
                        message = '上传设置成功';
                        res.json(
                            {
                                status : status,
                                msg : message
                            });
                    }
                });

        });
    }
    else{
        //handle error
        res.redirect('/login');
    }
}

function following(req, res, next) {
    var userID = req.session.userID;
    var homepageID = req.require.userID;
    if (userID)
    {
        pool.getConnection(function(err, connection) {
            if (err) {
                // handle error
                res.render('error');
            }
            connection.query(
                sql.getUserName +
                sql.getUserHeader +
                sql.getFollowing +
                sql.getFollowingNum,
                [homepageID, homepageID, homepageID, homepageID],
                function (err, result) {
                    if (err) {
                        //handle error
                        res.render('error');
                    }
                    if (result) {
                        res.render('following', {
                            username : result[0].username,
                            user_header : result[1].user_header,
                            userID : homepageID,
                            following : result[2],
                            following_num : result[3].following_num,
                            isSelf : (userID == homepageID)
                        })
                    }
                });
        });
    }
    else{
        //handle error
        res.redirect('/login');
    }
}

function addFollowing(req, res, next) {
    var userID = req.session.userID;
    var followingID = req.query.userID;
    var status = 0;
    var message = '';
    if (userID)
    {
        pool.getConnection(function(err, connection) {
            if (err) {
                // handle error
            }
            connection.query(
                sql.addFollowing,
                [userID, followingID],
                function (err, result) {
                    var status = 0;
                    if (err) {
                        //handle error
                        status = 0;
                        message = '添加关注人失败';
                    }
                    if (result) {
                        //res.render('following', {})
                        status = 1;
                        message = '添加关注人成功';
                    }
                    res.json({
                        code: status,
                        msg: message
                    });
                    connection.release();
                    return;
                });
        });
    }
    else{
        //handle error
        res.redirect('/login');
    }
}

function delFollowing(req, res, next) {
    var userID = req.session.userID;
    var followingID = req.query.userID;
    if (userID)
    {
        pool.getConnection(function(err, connection) {
            if (err) {
                // handle error
            }
            connection.query(
                sql.delFollowing,
                [userID, followingID],
                function (err, result) {
                    var status;
                    var message;
                    if (err) {
                        //handle error
                        status = 0;
                        message = '删除关注人失败';
                    }
                    if (result) {
                        //res.render('following', {})
                        status = 1;
                        message = '删除关注人成功';
                    }
                    res.json({
                        code:status,
                        msg: message
                    });
                    connection.release();
                    return;
                });
        });
    }
    else{
        //handle error
        res.redirect('/login');
    }
}

function collect(req, res, next) {
    var userID = req.session.userID;
    var homepageID = req.require.userID;
    if (userID)
    {
        pool.getConnection(function(err, connection) {
            if (err) {
                // handle error
                res.render('error');
            }
            connection.query(
                sql.getUserName +
                sql.getUserHeader +
                sql.getCollectedPainting +
                sql.getCollectedNum,
                [homepageID, homepageID, homepageID, homepageID],
                function (err, result) {
                    if (err) {
                        //handle error
                        res.render('error');
                    }
                    if (result) {
                        res.render('following', {
                            username : result[0].username,
                            user_header : result[1].user_header,
                            userID : homepageID,
                            collect : result[2],
                            collect_num : result[3].collect_num,
                            isSelf : (userID == homepageID)
                        })
                    }
                });
        });
    }
    else{
        //handle error
        res.redirect('/login');
    }
}

function addCollecting(req, res, next) {
    var userID = req.session.userID;
    var paintingID = req.query.paintingID;
    var status = 0;
    var message = '';
    if (userID)
    {
        pool.getConnection(function(err, connection) {
            if (err) {
                // handle error
            }
            connection.query(
                sql.addCollecting,
                [userID, paintingID],
                function (err, result) {
                    if (err) {
                        //handle error
                        status = 0;
                        message = '添加收藏画失败';
                    }
                    if (result) {
                        //res.render('following', {})
                        status = 1;
                        message = '添加收藏画成功';
                    }
                    res.json({
                        status : status,
                        msg: message
                    });
                    connection.release();
                    return;
                });
        });
    }
    else{
        //handle error
        res.redirect('/login');
    }
}

function delCollecting(req, res, next) {
    var userID = req.session.userID;
    var paintingID = req.query.paintingID;
    var status = 0;
    var message = '';
    if (userID)
    {
        pool.getConnection(function(err, connection) {
            if (err) {
                // handle error
            }
            connection.query(
                sql.delCollecting,
                [userID, paintingID],
                function (err, result) {
                    if (err) {
                        //handle error
                        status = 0;
                        message = '删除收藏画失败';
                    }
                    if (result) {
                        //res.render('following', {})
                        status = 1;
                        message = '删除收藏画成功';
                    }
                    res.json({
                        status : status,
                        msg: message
                    });
                    connection.release();
                    return;
                });
        });
    }
    else{
        //handle error
        res.redirect('/login');
    }
}

function contribute(req, res, next) {
    var userID = req.session.userID;
    var homepageID = req.require.userID;
    if (userID)
    {
        pool.getConnection(function(err, connection) {
            if (err) {
                // handle error
                res.render('error');
            }
            connection.query(
                sql.getUserName +
                sql.getUserHeader +
                sql.getContribute +
                sql.getContributeNum,
                [homepageID, homepageID, homepageID, homepageID],
                function (err, result) {
                    if (err) {
                        //handle error
                        res.render('error');
                    }
                    if (result) {
                        res.render('contribute', {
                            username : result[0].username,
                            user_header : result[1].user_header,
                            userID : homepageID,
                            contribute : result[2],
                            contribute_num : result[3].contribute_num,
                            isSelf : (userID == homepageID)
                        })
                    }
                });
        });
    }
    else{
        //handle error
        res.redirect('/login');
    }
}

function addContribute(req, res, next) {
    var userID = req.session.userID;
    if (userID)
    {
        res.render('addcontribute');
    }
    else
    {
        redirect('/login');
    }
}


function delContribute(req, res, next) {
    var userID = req.session.userID;
    if (userID)
    {
        pool.getConnection(function(err, connection) {
            if (err) {
                // handle error
            }
            connection.query(
                sql.delContribute,
                [userID, paintingID],
                function (err, result) {
                    var state = 0;
                    var message = '';
                    if (err) {
                        //handle error
                        state = 0;
                        message = '用户删除画失败';
                    }
                    if (result) {
                        //res.render('following', {})
                        state = 1;
                        message = '用户删除画成功';
                    }
                    fs.rename(req.file.filename, '/upload/' + result[0]);
                    res.json({
                        code: state,
                        msg: message
                    });
                });
        });
    }
}


module.exports = router;