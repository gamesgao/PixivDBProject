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
router.post('/configUpload', configUpload);
router.post('/passwordUpload', passwordUpload);
router.post('/charge', charge);
router.get('/following', following);
router.get('/addfollowing', addFollowing);
router.get('/delfollowing', delFollowing);
router.get('/collect', collect);
router.get('/addcollect', addCollecting);
router.get('/delcollect', delCollecting);
router.get('/contribute', contribute);
router.get('/addcontribute', addContribute);
router.get('/delcontribute', delContribute);
router.get('/quit', quit);

function data(req, res, next) {
	var data = req.query;
	var userID = Number(data.userID);
	var sessionUserID = req.session.userID;
    if (!(userID)) userID = sessionUserID;
	//try multiple queries
    if (sessionUserID) {
        pool.getConnection(function (err, connection) {
            if (err) {
                // handle error
                res.render('error');
            }
            connection.query(
                sql.getContribute +
                sql.getUserName +
                sql.getFollowing +
                sql.getFollowingNum +
                sql.getCollectedPainting +
                sql.getMostTag +
                sql.getUserHeader +
                sql.getUserInfo +
                sql.getUserType,
                [userID, userID, userID, userID, userID, userID, userID, userID, userID]
                , function (err, result) {
                    if (err) {
                        // handle error
                        res.render('error');
                    }
                    if (result) {
                        pdata = {};
                        pdata.phomepage = result[7][0].phomepage;
                        pdata.abstract = result[7][0].abstract;
                        pdata.twitter = result[7][0].twitter;
                        res.render('homepage',
                            {
                                contribute_painting: result[0],
                                username: result[1][0].username,
                                following: result[2],
                                following_num: result[3][0].following_num,
                                collect_painting: result[4],
                                tag: result[5],
                                user_header: result[6][0].user_header,
                                userID: userID,
                                pdata: pdata,
                                type: result[8][0].type
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
                sql.getUserAlipay +
                sql.getUserMoney +
                sql.getUserInfo,
                [userID, userID, userID, userID, userID],
                function (err, result) {
                    if (err)
                    {
                        //error handler
                        res.render('error');
                    }
                    if (result)
                    {
                        res.render('config', {
                            username : result[0][0].username,
                            user_header : result[1][0].user_header,
                            alipay : result[2][0].alipay,
                            userID : req.session.userID,
                            frozen_money: result[4][0].frozen_money,
                            current_money: result[4][0].current_money,
                            twitter: result[5][0].twitter,
                            phomepage: result[5][0].phomepage,
                            abstract: result[5][0].abstract
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

//post
function configUpload(req, res, next) {
    var userID = req.session.userID;
    var newName = req.body.newname;
    var new_alipay = req.body.newAlipay;
    var twitter = req.body.twitter;
    var abstract = req.body.abstract;
    var phomepage = req.body.phomepage;
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
                return;
            }
            connection.query(
                sql.modifyUserBasicInfo +
                sql.modifyUserTwitter +
                sql.modifyUserAbstract +
                sql.modifyUserHomepage,
                [newName, new_alipay, userID, twitter,  userID, abstract,  userID, phomepage, userID],
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
                        connection.release();
                        return;
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
                        connection.release();
                        return;
                    }
                });

        });
    }
    else{
        //handle error
        res.redirect('/login');
    }
}

//post
function passwordUpload(req, res, next) {
    var userID = req.session.userID;
    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;
    var status = 0;
    var message = '';
    if (userID)
    {
        pool.getConnection(function(err, connection) {
            if (err)
            {
                // handle error
                status = 0;
                message = '上传密码失败';
                res.json(
                    {
                        status : status,
                        msg : message
                    });
                //connection.release();
                return;
            }
            connection.query(
                sql.modifyUserPassword,
                [oldPassword, newPassword, userID],
                function (err, result) {
                    if (err)
                    {
                        //error handler
                        status = 0;
                        message = '上传密码失败';
                        res.json(
                            {
                                status : status,
                                msg : message
                            });
                        connection.release();
                        return;
                    }
                    if (result)
                    {
                        status = 1;
                        message = '上传密码成功';
                        res.json(
                            {
                                status : status,
                                msg : message
                            });
                        connection.release();
                        return;
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
    var homepageID = req.query.userID;
    if (!(homepageID)) homepageID = userID;
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
                            username : result[0][0].username,
                            user_header : result[1][0].user_header,
                            userID : homepageID,
                            following : result[2],
                            following_num : result[3][0].following_num,
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

function delFollowing(req, res, next) {
    var userID = req.session.userID;
    var followingID = req.query.userID;
    var status;
    var message;
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
                        status:status,
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
    var homepageID = req.query.userID;
    if (!(homepageID)) homepageID = userID;
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
                        res.render('collect', {
                            username : result[0][0].username,
                            user_header : result[1][0].user_header,
                            userID : homepageID,
                            collect : result[2],
                            collect_num : result[3][0].collect_num,
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
    var homepageID = req.query.userID;
    if (!(homepageID)) homepageID = userID;
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
                            username : result[0][0].username,
                            user_header : result[1][0].user_header,
                            userID : homepageID,
                            contribute : result[2],
                            contribute_num : result[3][0].contribute_num,
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
    if (userID) {
        pool.getConnection(function (err, connection) {
            if (err) {
                // handle error
                res.render('error');
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
                        res.render('addcontribute',
                            {
                                username: result[0][0].username,
                                user_header: result[1][0].user_header,
                                userID: userID
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


function delContribute(req, res, next) {
    var userID = req.session.userID;
    var paintingID = Number(req.query.paintingID);
    var status = 0;
    var message = '';
    if (userID)
    {
        pool.getConnection(function(err, connection) {
            if (err) {
                // handle error
            }
            connection.query(
                sql.delContribute,
                [paintingID, userID],
                function (err, result) {
                    if (err) {
                        //handle error
                        status = 0;
                        message = '用户删除画失败';
                    }
                    if (result) {
                        //res.render('following', {})
                        try {
                            fs.unlinkSync(__dirname + '/../../public' + result[0].paintingurl);
                            status = 1;
                            message = '用户删除画成功';
                        } catch (err) {
                            if (err.code == 'ENOENT')
                            {
                                message = '用户删除画不存在';
                            }
                        }
                    }
                    res.json({
                        status: status,
                        msg: message
                    });
                    return;
                });
        });
    }
    else
    {
        res.redirect('/login');
    }
}

//post
function charge(req, res, next) {
    var userID = req.session.userID;
    var money = req.body.money;
    var status = 0;
    var message = '';
    if (userID)
    {
        pool.getConnection(function(err, connection) {
            if (err) {
                // handle error
                status = 0;
                message = '数据库连接失败';
                res.json(
                    {
                        status: status,
                        msg: message
                    });
                connection.release();
                return;
            }
            connection.query(
                sql.chargeMoney,
                [userID, money],
                function (err, result) {
                    if (err) {
                        status = 0;
                        message = '添加钱失败';
                    }
                    else {
                        status = 1;
                        message = '添加钱成功';
                    }
                    res.json(
                        {
                            status: status,
                            msg: message
                        });
                    connection.release();
                    return;
                }
            );
        });
    }
}

function quit(req, res, next) {
    if (req.session) {
        req.session.destroy(function(err) {
            if (err) {
                res.json({status: 0, msg: '退出失败'});
                return;
            }
            else {
                res.json({status: 1, msg: '退出成功'});
                return;
            }
        })
    }
}
module.exports = router;