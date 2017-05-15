var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = require('../../dbconf/pool.js');
var sql = require('../../dbconf/sqlMapping.js');
var jsonWrite = require('../../dbconf/jsonWrite.js');

router.get('/', index);
router.post('/reg', register);

function index(req, res, next) {

    // ?a = 1
    // a = req.query.a;
    var data = req.query;
    if (!(req.session.userID))
    {
        res.json({
            code: '0',
            msg: '用户未登录'
        });
        return;
    }

    res.render('Wrong', {
            title: 'pm2.5 cloud platform',
        }
    );
    return;
}

// assume the front-end sends the following when the user registers:
// username,type,password,alipay_address
// alipay_address can be null
// the attribute in the req.body should be the same as the on in database

function register(req, res, next) {
    // object.a = 1;
    // var a = req.body.a;
    //var user = req.body;    
    /*var user = {
        username : 'gaoyu',
        type : 'painter',
        password : '123',   
        alipay_address : 'mail'             
    };*/    
    //var userID = req.session.userID;
    var user = req.body;

    pool.getConnection(function(err, connection) {
        if (err)
        {
            // handle error  
        }
        connection.query(
        sql.insert, [user.username, user.type, user.password, user.alipay_address]
        , function(err, result) 
        {
            if (err)
            {
            // handle error  
            }
            if (result)
            {
                result = {
                    code: 1,
                    msg: '用户注册成功'
                }
            }
            jsonWrite(res,result);
            connection.release();
            return;
        }                
        );
    });
}
    //session
    // userID = req.session.userID;
    

    // res.send
    // res.render
    // res.json


    

module.exports = router;