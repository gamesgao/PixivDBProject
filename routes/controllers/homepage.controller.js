var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = require('../../dbconf/pool.js');
var sql = require('../../dbconf/sqlMapping.js');
var jsonWrite = require('../../dbconf/jsonWrite.js');

router.get('/', data);
router.get('/config', config);

function data(req, res, next) {
	var data = req.query;
	var userID = data.userID;
	var username;

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
    res.render('data', { title: 'pm2.5 cloud platform' });
}

function config(req, res, next) {
    res.render('data', { title: 'pm2.5 cloud platform' });
}


module.exports = router;