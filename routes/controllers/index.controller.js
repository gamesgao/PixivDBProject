var express = require('express');
var router = express.Router();

router.get('/', index);

function index(req, res, next) {
    var sessionUserID = req.session.userID;
    if (sessionUserID) {
        res.redirect('/homepage');
    } else {
        res.redirect('/login');
    }
}



module.exports = router;