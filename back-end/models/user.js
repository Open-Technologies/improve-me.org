var squel = require('squel');
var mysql = require('../common/mysql');

var userModel = {
  login: function (login, password, cb) {
    var query = squel.select()
      .from('users')
      .field('id')
      .where('login=?', login)
      .where('password=?', password);
    mysql.query(query, function (err, data) {
      if (err) {
        return cb(err);
      }
      if (!data.length) {
        return cb(Error('Неверный логин или пароль'));
      }
      cb(null, data[0].id);
    });
  },

  add: function (login, email, password, cb) {
    if (login.length < 3 || login.length > 64) {
      return cb(Error('Login is invalid'));
    }
    if (email.length < 3 || login.length > 64) {
      return cb(Error('Email is invalid'));
    }
    if (password.length < 3 || login.length > 64) {
      return cb(Error('Password is invalid'));
    }

    var query = squel.insert()
      .into('users')
      .setFields({
        login: login,
        email: email,
        password: password
      });
    mysql.query(query, function (err, data) {
      if (err) {
        return cb(err);
      }
      cb(null, data.insertId);
    });
  }
};

module.exports = userModel;
