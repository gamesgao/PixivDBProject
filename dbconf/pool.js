var mysql = require('mysql');

//创建连接池
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'f1403018409',
    database: 'dbproject',
    port: 3306,
    multipleStatements: true
});
module.exports = pool;