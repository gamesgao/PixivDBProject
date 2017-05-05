var express = require('express');
var router = express.Router();

router.get('/', index);
router.post('/reg', register);

function index(req, res, next) {

    // ?a = 1
    // a = req.query.a;
    var data = req.query;
    res.render('index', {
            title: 'pm2.5 cloud platform',
        }
    )
}

function register(req, res, next) {
    // object.a = 1;
    // var a = req.body.a;
    var data = req.body;

    //session
    // userID = req.session.userID;
    var session  = req.session;

    // res.send
    // res.render
    // res.json


    
}

module.exports = router;