var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = require('../../dbconf/pool.js');
var sql = require('../../dbconf/sqlMapping.js');

router.get('/', index);
router.get('/reg', register);

// 向前台返回JSON方法的简单封装
var jsonWrite = function (res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code:'1',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
};

function index(req, res, next) {

    // ?a = 1
    // a = req.query.a;
    var data = req.query;
    if (!(req.session.userID))
    {
        res.json({
            code: '233',
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
    var user = {
        username : 'gaoyu',
        type : 'painter',
        password : '123',   
        alipay_address : 'mail'             
    };    
    //var userID = req.session.userID;
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
                    code: 200,
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