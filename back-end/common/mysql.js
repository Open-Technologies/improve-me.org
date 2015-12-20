var mysql = require('mysql');
var config = require('../config/mysql');

var pool = mysql.createPool(config);

var mysqlWrapper = {
  query: function (query, cb) {
    var param = query.toParam();
    pool.query(param.text, param.values, cb);
  },
  escape: mysql.escape
};

module.exports = mysqlWrapper;
