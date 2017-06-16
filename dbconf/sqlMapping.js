/*
 本次修改的语句：
 [添加]
 [删除]
 [修改]
 getBriefTrade
 getRelatedTrades
 getTradeUrl
 getUserMoney
 */
/*
 本次对数据库的修改：
 [添加]
 */

var user = {
    addUser : 'CALL addUser(?,?,?,?,@output);SELECT @output AS userID;',//return userID 第一个参数是用户名，第二个参数是用户类型，第三个参数是密码，第四个参数是alipay_address
    checkUserPassword : 'SELECT checkUserPassword(?,?) AS userID;', //检查用户密码是否符合，第一个参数是用户名,第二个参数是用户提供的密码，返回是否登陆成功，成功返回userID，失败返回-1，返回值名为userID [已修改]
    getUserName : 'SELECT username FROM user WHERE id = ?;',//返回username，输入用户ID
    getPaintingName : 'SELECT topic FROM painting WHERE id = ?;', //返回画作名字，输入为画ID
    getContribute : 'SELECT p.url AS url, c.painting AS paintingID, p.topic AS name FROM painting p, contribute c WHERE c.user = ? and c.painting = p.id;',//得到用户投稿的所有作品，输入为用户ID
    getContributeNum : 'SELECT count(*) AS contribute_num FROM contribute WHERE user = ?;',//得到用户所有投稿作品名，输入为用户ID
    getFollowing : 'SELECT followee AS userID, icon AS header ,username FROM follow, user WHERE followee = id and follower = ?;',//返回当前用户关注的人
    getFollowingNum : 'SELECT count(*) AS following_num FROM follow WHERE follower = ?;',//返回当前用户关注的人数
    getCollectedPainting : 'SELECT p.url AS url, c.painting AS paintingID ,p.topic AS name FROM painting p, collection c WHERE c.user = ? and c.painting = p.id;',//返回用户收藏的画，输入为用户ID
    getCollectedNum : 'SELECT count(*) AS collect_num FROM collection WHERE user = ?;',//得到用户收藏画总数
    getMostTag :'SELECT count(c.painting) as count, pt.tag as tag FROM contribute c,painting p, painting_tag pt WHERE c.user = ? and c.painting = p.id and p.id = pt.painting GROUP BY tag ORDER BY count DESC;',//得到用户的所有作品的tag，以及每个tag总共出现次数，按次数从大到小排序
    getUserHeader : 'SELECT icon AS user_header FROM user WHERE id = ?;',//得到用户头像
    getUserAlipay : 'SELECT alipay_address AS alipay FROM user WHERE id = ?;',//得到用户邮箱地址
    addFollowing : 'INSERT INTO follow(follower, followee) VALUES (?,?);',//为用户添加关注人，输入为用户ID和他想关注的人的ID
    delFollowing : 'DELETE FROM follow WHERE follower = ? and followee = ?;',//为用户删除关注人
    addCollecting : 'INSERT INTO collection(user, painting) VALUES(?,?);',//为用户添加收藏的画，输入为用户ID和画ID
    delCollecting : 'DELETE FROM collection WHERE user = ? and painting = ?;',//为用户删除收藏画
    addContribute : 'CALL addContribute(?,?,?,@output); SELECT @output AS paintingID;',//添加用户投稿，第一个参数是主题，第二个参数是画师ID，第三个参数是format。注意:appContribute的时候 要把(userID, paintingID)加到 contribute表中，并返回新加入的paintingID，返回值名为paintingID
    delContribute : 'SELECT delContribute(?,?) AS paintingurl;', //删除用户投稿，第一个参数是paintingID,第二个参数是userID,该函数会级联删除所有与当前画作有关的信息。注意：delContribute返回值为删除画的url，变量名为paintingurl
    modifyUserName : 'UPDATE user SET username = ? WHERE id = ?;',//更改用户名
    addView: 'UPDATE painting SET page_view = page_view + 1 WHERE id = ?;', //增加画的浏览量(+1)
    getUserNameByPaintingID : 'SELECT username FROM user u,contribute c WHERE u.id = c.user and c.painting = ?;',//得到某幅画的作者名
    getUserHeaderByPaintingID : 'SELECT icon AS user_header FROM user u,contribute c WHERE u.id = c.user and c.painting = ?;',//得到某幅画的作者头像URL
    getUserIDByPaintingID : 'SELECT id AS userID FROM user u,contribute c WHERE u.id = c.user and c.painting = ?;',//得到某幅画的作者ID
    getUrl : 'SELECT url FROM painting WHERE id = ?;',//得到画的URL,输入是paintingID,输出是painting的URL
    getTagByPaintingID : 'SELECT tag FROM painting_tag WHERE painting = ?;',//得到某幅画的所有tag
    getCreatedTime : 'SELECT upload_time AS time FROM painting WHERE id = ?;',//得到某幅画的创建时间
    getResolution : 'SELECT length, width FROM painting WHERE id = ?;',//得到某幅画的分辨率
    modifyResolution: 'CALL modifyResolution(?,?,?,?);',//更改某幅画的分辨率，输入参数 长 宽 userID paintingID
    getRatedCount : 'SELECT upvote AS ratedCount FROM painting WHERE id = ?;',//得到某幅画的赞数
    getViewCount : 'SELECT page_view AS viewCount FROM painting WHERE id = ?;',//得到某幅画的浏览量
    delPaintingTag : 'SELECT delPaintingTag(?,?,?) AS status;',//删除某幅画的tag，这个函数的第一个参数是paintingID,第二个参数是paintingTag,第三个参数是操作用户的id，只有画师可以删Tag
    addPaintingTag : 'INSERT INTO painting_tag VALUES(?,?);',//添加某幅画的tag，第一个变量是paintingID，第二个变量是tag
    getBuyerFlag :'SELECT getBuyerFlag(?) AS buyerflag;',//返回0代表不是买家，返回1代表是买家，输入为用户ID
    getBriefTrade :'SELECT t.buyer AS buyer, t.price AS price, t.deadline AS ddl, t.status AS state, u.username AS buyername,t.id AS tradeID FROM trade t,user u WHERE t.buyer = u.id and u.id = ?;',//得到一个交易的简要信息，输入为交易ID
    getAllBriefTrade :'SELECT t.buyer AS buyer, t.price AS price, t.deadline AS ddl, t.status AS state, u.username AS buyername,t.id AS tradeID FROM trade t,user u WHERE t.buyer = u.id;',//得到所有交易的简要消息
    addTrade :'CALL addTrade(?,?,?,?,?,@output); SELECT @output AS tradeID;',//添加一项交易，目前的使用范例为 CALL addTrade('test_for_contri',20,'2017-08-08 22:22','start',1,@output); SELECT @output AS tradeID;
    addTradeTags : 'INSERT INTO trade_tag VALUES ?;',//为一个交易添加tag，第一个值是tradeID,第二个值是tag
    getFullTrade : 'SELECT * FROM trade WHERE id = ?;',//得到一个交易的所有信息
    getApplier : 'SELECT painter AS userID,username AS username,icon AS user_header FROM painter_apply_for_trade, user WHERE trade = ? AND id = painter;',//得到一个交易的所有应聘者
    addResponderForTrade :'CALL buyer_decide_painter(?,?,?);',//得到一个交易的应答者，第一个参数是tradeID，第二个参数是painterID，第三个参数是buyerID
    addApplierForTrade : 'CALL painter_apply_for_trade(?,?);',//得到一个交易的应聘者，第一个参数是painterID,第二个参数是tradeID
    getRelatedTrades : 'SET @inuserid = ?; CALL getRelatedTrades(); ',//得到与用户相关的交易，若用户是画家，返回他接单或应聘的交易，如果是买家，返回他发起的所有交易
    getUserType : 'SELECT type FROM user WHERE id = ?;',//得到用户类型
    update:'update user set name=?, age=? where id=?;',
    upvote:'INSERT INTO upvote VALUES (?,?); UPDATE painting SET upvote = upvote + 1 WHERE id = ?;',//用户为一幅画点赞，userID paintingID
    delete: 'delete from user where id=?;',
    queryById: 'select * from user where id=?;',
    queryAll: 'select * from user;',
    cancelTrade :'CALL cancelTrade(?,?);',//用户取消交易，userID tradeID
    completeTrade :'CALL completeTrade(?,?);',//用户完成交易，userID tradeID
    searchUserByName :'SELECT * FROM user WHERE username like ? LIMIT ?,18; ',//用用户名搜索用户
    modifyUserPassword :'SELECT modifyUserPassword(?,?,?);',//更改用户密码，第一个参数是oldUserPassword，第二个参数是newUserPassword，第三个参数是userID
    modifyUserBasicInfo :'UPDATE user SET username = ?, alipay_address = ? WHERE id = ?;',//更改用户基本信息（用户名，邮箱）
    chargeMoney :'CALL buyer_add_money(?,?)',//为用户充钱，第一个参数是userID,第二个参数是money
    addTradeWork :'CALL addTradeWork(?,?,?)',//用户为一项交易提供作品（商稿），第一个参数是painterID,第二个参数是tradeID,第三个参数是paintingURL格式 就是trade中的upload_file_route
    getTradeUrl :'CALL getTradeUrl(?,?,@url); SELECT @url AS url;',//得到画师对这一交易上传的作品，第一个参数是buyerID,第二个参数是tradeID,第三个参数是paintingURL 就是trade中的upload_file_route
    getUserInfo: 'SELECT phomepage, twitter, abstract FROM user WHERE id = ?; ',//得到用户信息
    getUserMoney :'CALL getUserMoney(?,@frozen_money,@current_money);SELECT @frozen_money AS frozen_money,@current_money AS current_money;',//得到用户拥有的钱，第一个参数是userID,第二个是frozenMoney,第三个参数是currentMoney
    modifyUserTwitter :'UPDATE user SET twitter = ? WHERE id = ?;',//修改用户推特信息
    modifyUserAbstract : 'UPDATE user SET abstract = ? WHERE id = ?;',//修改用户简介
    modifyUserHomepage : 'UPDATE user SET phomepage = ? WHERE id = ?;'//修改用户主页网址
};

module.exports = user;