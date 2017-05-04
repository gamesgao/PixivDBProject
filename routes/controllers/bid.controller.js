var express = require('express');
var router = express.Router();

// 招标的主页
// 感觉画家接单也可以直接放在这个页面
router.get('/', bid);
// 招标的发起页
router.get('/applyBid', applyBid);
// 交易的界面，包括各种状态
router.get('transaction', transaction);


function bid(req, res, next) {
    res.render('bid', {
        title: 'pm2.5 cloud platform',
    })
}

module.exports = router;