/*
    To 刘韵：
    基本思路是，带get的语句一般不需要写成过程
    但是add和del很多还是需要写成过程的，我这边有些语句从名字上看不出是是那个用户要进行删除添加，你有看不懂的赶紧问我
 */

var user = {
    addUser : 'INSERT INTO user(username,type,password,alipay_address,icon) VALUES(?,?,?,?,?);',
    checkUserPassword : 'SELECT checkUserPassword(?,?) AS userID;', //第一个参数是用户id,第二个参数是用户提供的密码，返回是否登陆成功，成功返回userID，失败返回-1，返回值名为userID
    getUserName : 'SELECT username FROM user WHERE id = ?;',//返回username，输入用户ID
    getContribute : 'SELECT p.url AS url, c.painting AS paintingID FROM painting p, contribute c WHERE c.user = ? and c.painting = p.id;',//输入用户ID
    getContributeNum : 'SELECT count(*) AS contribute_num FROM contribute WHERE user = ?',
    getFollowing : 'SELECT follower AS userID, icon AS header ,username FROM follow, user WHERE follower = id and followee = ?;',
    getFollowingNum : 'SELECT count(*) AS following_num FROM follow WHERE followee = ?;',
    getCollectedPainting : 'SELECT p.url AS url, c.painting AS paintingID ,p.topic AS name FROM painting p, collection c WHERE c.user = ? and c.painting = p.id;',
    getCollectedNum : 'SELECT count(*) AS collect_num FROM collection WHERE user = ?',
    getMostTag :'SELECT count(c.painting) as count, pt.tag as tag FROM contribute c,painting p, painting_tag pt WHERE c.user = 5 and c.painting = p.id and p.id = pt.painting GROUP BY tag ORDER BY count DESC;',
    getUserHeader : 'SELECT icon AS user_header FROM user WHERE id = ?;',
    getUserAlipay : 'SELECT alipay_address AS alipay FROM user WHERE id = ?;',
    addFollowing : 'INSERT INTO follow(follower, followee) VALUES (?,?);',
    delFollowing : 'DELETE FROM follow WHERE follower = ? and followee = ?;',
    addCollecting : 'INSERT INTO collection(user, painting) VALUES(?,?);',
    delCollecting : 'DELETE FROM collection WHERE user = ? and painting = ?;',
    addContribute : '',//这个函数的功能是不是和下面addPainting重合了？@陈旭旸
    delContribute : 'SELECT delContribute(?,?) AS paintingurl', //第一个参数是paintingID,第二个参数是userID,该函数会级联删除所有与当前画作有关的信息。注意：delContribute返回值为删除画的url，变量名为paintingurl
    modifyUserName : 'UPDATE user SET username = ? WHERE id = ?;',
    modifyUserInfo : 'UPDATE user SET id = ?, username = ?, alipay_address = ? WHERE id = ?;',//TO BE MODIFIED
    getUserNameByPaintingID : 'SELECT username FROM user u,contribute c WHERE u.id = c.user and c.painting = ?;',
    getUserHeaderByPaintingID : 'SELECT icon AS user_header FROM user u,contribute c WHERE u.id = c.user and c.painting = ?;',
    getUserIDByPaintingID : 'SELECT id AS userID FROM user u,contribute c WHERE u.id = c.user and c.painting = ?;',
    getUrl : 'SELECT url FROM painting WHERE id = ?;',//输入是paintingID,输出是painting的URL
    getTagByPaintingID : 'SELECT tag FROM painting_tag WHERE painting = ?;',
    getCreatedTime : 'SELECT upload_time AS time FROM painting WHERE id = ?;',
    getResolution : 'SELECT width*length AS resolution FROM painting WHERE id = ?;',
    getRatedCount : 'SELECT upvote AS ratedCount FROM painting WHERE id = ?;',
    getViewCount : 'SELECT page_view AS viewCount FROM painting WHERE id = ?;',
    delPaintingTag : 'SELECT delPaintingTag(?,?,?) AS status;',//这个函数的第一个参数是paintingID,第二个参数是paintingTag,第三个参数是操作用户的id，只有画师可以删Tag @陈旭旸
    addPaintingTag : 'INSERT INTO painting_tag WHERE painting = ? AND tag = ?;',
    getBuyerFlag :'SELECT getBuyerFlag(?) AS buyerflag;',//返回0代表不是买家，返回1代表是买家
    getBriefTrade :'SELECT buyer, price, deadline AS ddl, status AS state FROM trade WHERE id = ?;',
    addTrade :'SELECT addTrade(?,?,?,?,?,?,?) AS tradeID;', 
    //addTrade参数如下：描述，价格，结束时间（这个创建的时候可能还不知道，就随便给一个），DDL，状态（数字字母都行），买家，卖家
    //示例：SELECT addTrade('no description',50,'2027:05:09 23:59:59','2027:05:09 23:59:59',4,1,5);
    //创建时间由插入数据库的时间自动产生
    //返回值是当前trade的ID，这个值是线程安全的，但是线程内部如果调用其他insert的话就会得到新insert的id，结果没法测试，先按这个来
    //我网上看到JDBC有一个函数可以取得当前table的自增值，而且线程内部也安全，可以看看JS有没有这样的函数 @陈旭旸
    //不过这个写在函数里面应该没有其他insert可以影响，所以先这样
    //注意：这边的addTrade是一个procedure，返回值为新加入trade的id,返回值名为tradeID
    addTradeTags : 'INSERT INTO trade_tag VALUES(?,?);',//第一个值是tradeID,第二个值是tag
    getFullTrade : 'SELECT * FROM trade WHERE id = tradeID;',//我看过所有的参数都对的上，要是需要改动请注明 @陈旭旸
    getApplier : 'SELECT painter AS applier FROM trade WHERE id = tradeID;',
    addResponderForTrade :'',
    addApplierForTrade : '',
    getRelatedTrades : '',
    addPainting :'', //注意:appPainting的时候 要把(userID, paintingID)加到 contribute表中，并返回新加入的paintingID，返回值名为paintingID
    //addParinting的返回值同样存在和addTrade一样的问题
	update:'update user set name=?, age=? where id=?',
	delete: 'delete from user where id=?',
	queryById: 'select * from user where id=?',
	queryAll: 'select * from user',
    cancelTrade :'', //这个比较麻烦，有时间讨论一下
    searchUserByName :'select * from user where username = ?',
};

module.exports = user;