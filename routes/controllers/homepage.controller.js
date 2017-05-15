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
	var contribute_painting;
	var collect_painting;

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
        sql.getUserHeader
            , [userID, userID]
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
        }
        );
    });
}

function config(req, res, next) {
    res.render('data', { title: 'pm2.5 cloud platform' });
}


module.exports = router;