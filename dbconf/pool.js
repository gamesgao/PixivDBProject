var dbparam = require('../dbconf/db.js');
var mysql = require('mysql');
var pool = mysql.createPool(dbparam);
module.exports = pool;