var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = require('../../dbconf/pool.js');
var sql = require('../../dbconf/sqlMapping.js');

router.get('/', search);
router.get('/user', searchUser);


function search(req, res, next) {
    res.render('search', { title: 'pm2.5 cloud platform' })
};

function searchUser(req,res,next) {
    var userID = req.session.userID;
    if (userID) {
        pool.getConnection(function (err, connection) {
            if (err) {
                // handle error
            }
            connection.query(
                sql.getUserName +
                sql.getUserHeader +
                sql.getBuyerFlag
                ,
                [userID, userID, userID]
                , function (err, result) {
                    if (err) {
                        // handle error
                    }
                    if (result) {
                        res.render('trade', {
                            username: result[0].username,
                            user_header: result[1].user_header,
                            buyerflag: result[2].buyerflag,
                            userID: userID
                        });
                    }
                    connection.release();
                }
            );
        });
    }
    else {
        //handle error
        res.redirect('/login');
    }
}
module.exports = router;