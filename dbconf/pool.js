var mysql = require('mysql');

//创建连接池
var pool  = mysql.createPool({
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    database : 'dbproject'
});
module.exports = pool;