/*
    To 刘韵：
    基本思路是，带get的语句一般不需要写成过程
    但是add和del很多还是需要写成过程的，我这边有些语句从名字上看不出是是那个用户要进行删除添加，你有看不懂的赶紧问我
 */

var user = {
	insert:'INSERT INTO user(username,type,password,alipay_address) VALUES (?,?,?,?);',
	getUserName : 'SELECT username FROM user WHERE id = ?;',
	getUserContributePainting : '',
    getFollowing : '',
    getFollowingNum : '',
    getColletedPainting : '',
    getMostTag : '',
    getUserHeader : '',
    getUserAlipay : '',
    addFollowing : '',
	delFollowing : '',
    addCollecting : '',
    delCollecting : '',
    addContribute : '',
    delContribute : '',
    modifyUserName : '',
    modifyUserInfo : '',
    getUserNameByPaintingID : '',
    getUserHeaderByPaintingID : '',
    getUserIDByPaintingID : '',
    getUrl : '',
    getTagByPaintingID : '',
    getCreatedTime : '',
    getResolution : '',
    getRatedCount : '',
    getViewCount : '',
    delPaintingTag : '',
    addPaintingTag : '',
    painting_name : '',
    getBuyerFlag :'',
    getBriefTrade :'',
    addTrade :'', //注意：这边的addTrade是一个procedure，返回值为新加入trade的id,变量名为tradeID
    addTradeTags :'',
	update:'update user set name=?, age=? where id=?',
	delete: 'delete from user where id=?',
	queryById: 'select * from user where id=?',
	queryAll: 'select * from user'
};

module.exports = user;