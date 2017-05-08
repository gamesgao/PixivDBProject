var user = {
	insert:'INSERT INTO user(username,type,password,alipay_address) VALUES (?,?,?,?);',
	getUserName : 'SELECT username FROM user WHERE id = ?;',
	update:'update user set name=?, age=? where id=?',
	delete: 'delete from user where id=?',
	queryById: 'select * from user where id=?',
	queryAll: 'select * from user'
};

module.exports = user;