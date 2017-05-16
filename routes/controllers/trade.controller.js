var express = require('express');
var router = express.Router();

// 招标的主页
// 感觉画家接单也可以直接放在这个页面
router.get('/', trade);
// 招标的发起页
router.get('/applyTrade', applyTrade);
// 交易的界面，包括各种状态
router.get('transaction', transaction);


function trade(req, res, next) {
    res.render('trade', {
        title: 'pm2.5 cloud platform',
    })
}

function applyTrade(req, res, next) {
    return;
}

function transaction(req, res, next) {
    return;
}

module.exports = router;