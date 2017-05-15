var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = require('../../dbconf/pool.js');
var sql = require('../../dbconf/sqlMapping.js');
var jsonWrite = require('../../dbconf/jsonWrite.js');
var multer  = require('multer');
var fs = require('fs');
router.get('/', data);
router.get('/config', config);
router.get('/following', following);
router.get('/addfollowing', addFollowing);
router.get('/delfollowing', delFollowing);
router.get('/addcollect', addCollecting);
router.get('/delcollect', delCollecting);
router.post('/contributeupload', contributeUpload);
/*router.post('/upload', upload.single('logo'), function(req, res, next){
    var file = req.file;
    res.send({ret_code: '0'});
});*/

function data(req, res, next) {
	var data = req.query;
	var userID = data.userID;

	//try multiple queries
	pool.getConnection(function(err, connection) {
        if (err)
        {
            // handle error
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
        , function(err, result)
        {
            if (err)
            {
    	        // handle error
            }
            if (result)
            {
                res.render('homepage', { title: 'pm2.5 cloud platform' });
            }
            connection.release();
        }
        );
    });
}

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
                    }
                    if (result)
                    {
                        res.render('config', { title: 'pm2.5 cloud platform' });
                    }
                });

        });
    }
    else{
        //handle error
    }
}

function following(req, res, next) {
    var userID = req.session.userID;
    if (userID)
    {
        pool.getConnection(function(err, connection) {
            if (err) {
                // handle error
            }
            connection.query(
                sql.getFollowing,
                [userID],
                function (err, retult) {
                    if (err) {
                        //handle error
                    }
                    if (result) {
                        res.render('following', {})
                    }
                });
        });
    }
    else{
        //handle error
    }
}

function addFollowing(req, res, next) {
    var userID = req.session.userID;
    var followingID = req.query.userID;
    if (userID)
    {
        pool.getConnection(function(err, connection) {
            if (err) {
                // handle error
            }
            connection.query(
                sql.addFollowing,
                [userID, followingID],
                function (err, retult) {
                    var state = 0;
                    if (err) {
                        //handle error
                        state = 0;
                    }
                    if (result) {
                        //res.render('following', {})
                        state = 1;
                    }
                    res.json({
                        code: state.toString(),
                        msg: '操作失败'
                    });
                });
        });
    }
    else{
        //handle error
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
                function (err, retult) {
                    var state;
                    var message;
                    if (err) {
                        //handle error
                        state = 0;
                        message = '删除关注人失败';
                    }
                    if (result) {
                        //res.render('following', {})
                        state = 1;
                        message = '删除关注人成功';
                    }
                    res.json({
                        code:state.toString(),
                        msg: message
                    });
                    return;
                });
        });
    }
    else{
        //handle error
    }
}

function addCollecting(req, res, next) {
    var userID = req.session.userID;
    var paintingID = req.query.painting;
    if (userID)
    {
        pool.getConnection(function(err, connection) {
            if (err) {
                // handle error
            }
            connection.query(
                sql.addCollecting,
                [userID, paintingID],
                function (err, retult) {
                    var state = 0;
                    var message = '';
                    if (err) {
                        //handle error
                        state = 0;
                        message = '添加收藏画失败';
                    }
                    if (result) {
                        //res.render('following', {})
                        state = 1;
                        message = '添加收藏画成功';
                    }
                    res.json({
                        code: state.toString(),
                        msg: message
                    });
                });
        });
    }
    else{
        //handle error
    }
}

function delCollecting(req, res, next) {
    var userID = req.session.userID;
    var paintingID = req.query.painting;
    if (userID)
    {
        pool.getConnection(function(err, connection) {
            if (err) {
                // handle error
            }
            connection.query(
                sql.delCollecting,
                [userID, paintingID],
                function (err, retult) {
                    var state = 0;
                    var message = '';
                    if (err) {
                        //handle error
                        state = 0;
                        message = '删除收藏画失败';
                    }
                    if (result) {
                        //res.render('following', {})
                        state = 1;
                        message = '删除收藏画成功';
                    }
                    res.json({
                        code: state.toString(),
                        msg: message
                    });
                });
        });
    }
    else{
        //handle error
    }
}

var createFolder = function(folder){
    try{
        fs.accessSync(folder);
    }catch(e){
        fs.mkdirSync(folder);
    }
};

var uploadFolder = '/upload/';

createFolder(uploadFolder);

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        cb(null, file.fieldname + '-' + Date.now());
    }
});

// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({ storage: storage });



function contributeUpload(req, res, next) {
    var userID = req.session.userID;
    var paintingID = req.query.painting;
    if (userID)
    {
        pool.getConnection(function(err, connection) {
            if (err) {
                // handle error
            }
            connection.query(
                sql.addContribute,
                [userID, paintingID],
                function (err, retult) {
                    var state = 0;
                    var message = '';
                    if (err) {
                        //handle error
                        state = 0;
                        message = '用户添加画失败';
                    }
                    if (result) {
                        //res.render('following', {})
                        state = 1;
                        message = '用户添加画成功';
                    }
                    res.json({
                        code: state.toString(),
                        msg: message
                    });
                });
        });
    }
    else{
        //handle error
    }
}

module.exports = router;