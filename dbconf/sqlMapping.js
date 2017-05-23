/*
 本次修改的语句：
 [添加]
 modifyUserPassword 使用示例SELECT modifyUserPassword('19960430','200240',1);
 modifyUserBasicInfo
 [删除]
 modifyUserInfo
 [修改]
 addResponderForTrade 添加?符号
 getResolution 分辨率还是分两列给出，一列length 一列width
 */
/*
 本次对数据库的修改：
 添加function modifyUserPassword 正确执行返回1 错误执行数据库发生ERROR
 */

var user = {
    addUser : 'SELECT addUser(?,?,?,?) as userID;',//return userID
    checkUserPassword : 'SELECT checkUserPassword(?,?) AS userID;', //第一个参数是用户名,第二个参数是用户提供的密码，返回是否登陆成功，成功返回userID，失败返回-1，返回值名为userID [已修改]
    getUserName : 'SELECT username FROM user WHERE id = ?;',//返回username，输入用户ID
    getPaintingName : 'SELECT topic FROM painting WHERE id = ?;',
    getContribute : 'SELECT p.url AS url, c.painting AS paintingID, p.topic AS name FROM painting p, contribute c WHERE c.user = ? and c.painting = p.id;',//输入用户ID
    getContributeNum : 'SELECT count(*) AS contribute_num FROM contribute WHERE user = ?;',
    getFollowing : 'SELECT followee AS userID, icon AS header ,username FROM follow, user WHERE followee = id and follower = ?;',//已修改，返回当前用户关注的人
    getFollowingNum : 'SELECT count(*) AS following_num FROM follow WHERE follower = ?;',//已修改，返回当前用户关注的人数
    getCollectedPainting : 'SELECT p.url AS url, c.painting AS paintingID ,p.topic AS name FROM painting p, collection c WHERE c.user = ? and c.painting = p.id;',
    getCollectedNum : 'SELECT count(*) AS collect_num FROM collection WHERE user = ?;',
    getMostTag :'SELECT count(c.painting) as count, pt.tag as tag FROM contribute c,painting p, painting_tag pt WHERE c.user = ? and c.painting = p.id and p.id = pt.painting GROUP BY tag ORDER BY count DESC;',
    getUserHeader : 'SELECT icon AS user_header FROM user WHERE id = ?;',
    getUserAlipay : 'SELECT alipay_address AS alipay FROM user WHERE id = ?;',
    addFollowing : 'INSERT INTO follow(follower, followee) VALUES (?,?);',
    delFollowing : 'DELETE FROM follow WHERE follower = ? and followee = ?;',
    addCollecting : 'INSERT INTO collection(user, painting) VALUES(?,?);',
    delCollecting : 'DELETE FROM collection WHERE user = ? and painting = ?;',
    addContribute : 'SELECT addContribute(?,?,?,?,?) AS paintingID;',//第一个参数是主题，第二个参数是宽，第三个参数是长，第四个参数是画师ID，第五个参数是format。注意:appContribute的时候 要把(userID, paintingID)加到 contribute表中，并返回新加入的paintingID，返回值名为paintingID
    delContribute : 'SELECT delContribute(?,?) AS paintingurl;', //第一个参数是paintingID,第二个参数是userID,该函数会级联删除所有与当前画作有关的信息。注意：delContribute返回值为删除画的url，变量名为paintingurl
    modifyUserName : 'UPDATE user SET username = ? WHERE id = ?;',
    getUserNameByPaintingID : 'SELECT username FROM user u,contribute c WHERE u.id = c.user and c.painting = ?;',
    getUserHeaderByPaintingID : 'SELECT icon AS user_header FROM user u,contribute c WHERE u.id = c.user and c.painting = ?;',
    getUserIDByPaintingID : 'SELECT id AS userID FROM user u,contribute c WHERE u.id = c.user and c.painting = ?;',
    getUrl : 'SELECT url FROM painting WHERE id = ?;',//输入是paintingID,输出是painting的URL
    getTagByPaintingID : 'SELECT tag FROM painting_tag WHERE painting = ?;',
    getCreatedTime : 'SELECT upload_time AS time FROM painting WHERE id = ?;',
    getResolution : 'SELECT length, width FROM painting WHERE id = ?;',
    getRatedCount : 'SELECT upvote AS ratedCount FROM painting WHERE id = ?;',
    getViewCount : 'SELECT page_view AS viewCount FROM painting WHERE id = ?;',
    delPaintingTag : 'SELECT delPaintingTag(?,?,?) AS status;',//这个函数的第一个参数是paintingID,第二个参数是paintingTag,第三个参数是操作用户的id，只有画师可以删Tag @陈旭旸
    addPaintingTag : 'INSERT INTO painting_tag VALUES(?,?);',
    getBuyerFlag :'SELECT getBuyerFlag(?) AS buyerflag;',//返回0代表不是买家，返回1代表是买家
    getBriefTrade :'SELECT buyer, price, deadline AS ddl, status AS state FROM trade WHERE id = ?;',
    addTrade :'SELECT addTrade(?,?,?,?,?) AS tradeID;',//目前的使用范例为 SELECT addTrade('liuliuliuyun',20,'2017-05-21 16:44:44','start',1) as tradeID;
    addTradeTags : 'INSERT INTO trade_tag VALUES(?,?);',//第一个值是tradeID,第二个值是tag
    getFullTrade : 'SELECT * FROM trade WHERE id = tradeID;',//我看过所有的参数都对的上，要是需要改动请注明 @陈旭旸
    getApplier : 'SELECT painter AS applier FROM painter_apply_for_trade WHERE trade = ?;',
    addResponderForTrade :'CALL buyer_decide_painter(?,?);',//第一个参数是tradeID，第二个参数是painterID
    addApplierForTrade : 'INSERT INTO painter_apply_for_trade VALUES (?,?);',//INSERT INTO painter_apply_for_trade VALUES (6,3);第一个参数是painterID,第二个参数是tradeID
    getRelatedTrades : '',
    update:'update user set name=?, age=? where id=?;',
    delete: 'delete from user where id=?;',
    queryById: 'select * from user where id=?;',
    queryAll: 'select * from user;',
    cancelTrade :'', //这个比较麻烦，有时间讨论一下
    searchUserByName :'select * from user where username = ?;',
    modifyUserPassword :'SELECT modifyUserPassword(?,?,?);',//第一个参数是oldUserPassword，第二个参数是newUserPassword，第三个参数是userID
    modifyUserBasicInfo :'UPDATE user SET username = ?, alipay_address = ? WHERE id = ?;'
};

module.exports = user;