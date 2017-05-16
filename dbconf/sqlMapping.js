/*
    To 刘韵：
    基本思路是，带get的语句一般不需要写成过程
    但是add和del很多还是需要写成过程的，我这边有些语句从名字上看不出是是那个用户要进行删除添加，你有看不懂的赶紧问我
 */

var user = {
	insert:'INSERT INTO user(username,type,password,alipay_address) VALUES (?,?,?,?);',

    getUserName : 'SELECT username FROM user WHERE id = ?;',
    getUserContributePainting : 'SELECT p.url AS url, c.painting AS illustID FROM painting p, contribute c WHERE c.user = ? and c.painting = p.id;',
    getFollowing : 'SELECT follower AS userID, icon AS header FROM follow, user WHERE follower = id and followee = ?;',
    getFollowingNum : 'SELECT count(*) AS following_num FROM follow WHERE followee = ?;',
    getColletedPainting : 'SELECT p.url AS url, c.painting AS illustID FROM painting p, collection c WHERE c.user = ? and c.painting = p.id;',
    getMostTag :'SELECT count(c.painting) as count, pt.tag as tag FROM contribute c,painting p, painting_tag pt WHERE c.user = 5 and c.painting = p.id and p.id = pt.painting GROUP BY tag ORDER BY count DESC;',
    getUserHeader : 'SELECT icon AS user_header FROM user WHERE id = ?;',
    getUserAlipay : 'SELECT alipay_address AS alipay FROM user WHERE id = ?;',
    addFollowing : 'INSERT INTO follow(follower, followee) VALUES (?,?);',
    delFollowing : 'DELETE FROM follow WHERE follower = ? and followee = ?;',
    addCollecting : 'INSERT INTO collection(user, painting) VALUES(?,?);',
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
    getBuyerFlag :'',
    getBriefTrade :'',
    addTrade :'', //注意：这边的addTrade是一个procedure，返回值为新加入trade的id,变量名为tradeID
    addTradeTags : '',
    getFullTrade : '',
    getApplier : '',
    addResponderForTrade :'',
    addApplierForTrade : '',
    getRelatedTrades : '',
    addPainting :'', //注意:appPainting的时候 要把(userID, paintingID)加到 contribute表中，并返回新加入的paintingID

	update:'update user set name=?, age=? where id=?',
	delete: 'delete from user where id=?',
	queryById: 'select * from user where id=?',
	queryAll: 'select * from user'
};

module.exports = user;