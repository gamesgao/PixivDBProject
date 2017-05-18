var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = require('../../dbconf/pool.js');
var sql = require('../../dbconf/sqlMapping.js');
var fs = require('fs');

var path = require('path');
var multer = require('multer');

var upload = multer({ dest: 'uploads/' });

router.get('/', uploads);
router.post('/header', upload.single('user_header'), headerUpload);
router.post('/addcontribute', upload.single('painting'), paintingUpload);

function uploads(req, res, next) {
    res.render('upload', { title: 'pm2.5 cloud platform' })
}


function headerUpload(req, res, next) {
    var userID = req.session.userID;
    if (userID)
    {
        fs.rename('uploads/' + req.file.filename,'uploads/img/header'+userID.toString()+'.png',function(err){
            if(err){
                throw err;
            }
            console.log('header transfer done!');
        });
    }
    else{
        //handle error
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
                    if (result) {
                        var paintingID = result[0].paintingID;
                        //res.render('following', {})
                        state = 1;
                        message = '用户添加画成功';
                    }
                    fs.rename('uploads/' + req.file.filename, 'uploads/img/painting/'+userID.toString()+path.extname(file.originalname),function(err){
                        if(err){
                            throw err;
                        }
                        console.log('painting transfer done!');
                    });
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