var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = require('../../dbconf/pool.js');
var sql = require('../../dbconf/sqlMapping.js');
var fs = require('fs');

var path = require('path');
var multer = require('multer');

var upload = multer({ dest: 'public/img/' });

router.get('/', uploads);
router.post('/header', upload.single('user_header'), headerUpload);
router.post('/painting', upload.single('painting'), paintingUpload);

function uploads(req, res, next) {
    res.render('upload', { title: 'pm2.5 cloud platform' })
}


function headerUpload(req, res, next) {
    var userID = req.session.userID;
    var status = 0;
    var message = '';
    if (userID)
    {
        fs.rename(__dirname + '/../../public/img/' + req.file.filename,__dirname + '/../../public/img/header/'+userID.toString()+'.png',function(err){
            if(err){
                status = 0;
                message = '上传头像失败';
            }
            status = 1;
            message = '上传头像成功';
            console.log('header transfer done!');
        });
    }
    else{
        //handle error
        res.redirect('/login');
    }
}

function paintingUpload(req, res, next) {
    var userID = req.session.userID;
    if (userID)
    {
        pool.getConnection(function(err, connection) {
            if (err) {
                // handle error
            }
            var datetime = new Date();
            console.log(datetime);
            connection.query(
                sql.addContribute,
                [userID, paintingID],
                function (err, result) {
                    var state = 0;
                    var message = '';
                    if (err) {
                        //handle error
                        state = 0;
                        message = '用户添加画失败';
                    }
                    var paintingID = 0;
                    if (result) {
                        paintingID = result[0].paintingID;
                        //res.render('following', {})
                        state = 1;
                        message = '用户添加画成功';
                        fs.rename(__dirname + '/../../public/img/' + req.file.filename, __dirname + '/../../public/img/header/' + paintingID.toString() + path.extname(file.originalname), function (err) {
                            if (err) {
                                throw err;
                            }
                            console.log('painting transfer done!');
                        });
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