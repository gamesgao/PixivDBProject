var express = require('express');
var router = express.Router();

router.get('/', index);
router.post('/', userlogin);

//get
function index(req, res, next) {
    res.render('login');
}

//post
function userlogin(req, res, next) {
    var user = req.body;
    var status = 0;
    var message = '';
    pool.getConnection(function(err, connection) {
        if (err) {
            // handle error
            status = 0;
            message = 'connection failed';
            req.json({status:status, msg:message});
            return;
        }
        connection.query(
            sql.checkUserPassword, [user.name, user.password],
            function(err, result) {
                if (err) {
                    // handle error
                    status = 0;
                    message = '用户登录失败';
                }
                if (result) {
                    if (result[0].userID < 0)
                    {
                        status = 0;
                        message = '用户登录失败';
                    }
                    else {
                        req.session.userID = result[0].userID;
                        status = 1;
                        message = '用户注册成功';
                    }
                }
                req.json({status:status, msg:message});
                connection.release();
                return;
            }
        );
    });
}

module.exports = router;