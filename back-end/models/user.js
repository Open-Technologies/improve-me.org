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

  registration: function (formData, cb) {
    if (formData.login.length < 3 || formData.login.length > 64) {
      return cb(Error('Login is invalid'));
    }
    if (formData.password.length < 3 || formData.login.length > 64) {
      return cb(Error('Password is invalid'));
    }
    if (['MALE', 'FEMALE'].indexOf(formData.sex) === -1) {
      return cb(Error('Поле "Пол" не должно быть пустым'));
    }
    if (formData.year < 1900 || formData.year > new Date().getFullYear() - 4) {
      return cb(Error('Поле "Дата рождения" не соответствует формату'));
    }

    var query = squel.insert()
      .into('users')
      .setFields({
        login: formData.login,
        password: formData.password,
        sex: formData.sex,
        year: formData.year
      });
    mysql.query(query, function (err, data) {
      if (err) {
        return cb(err);
      }
      cb(null, data.insertId);
    });
  },

  getInfo: function (userId, cb) {
    var query = squel.select()
      .from('users')
      .field('login')
      .field('sex')
      .field('year')
      .where('id=?', userId);
    mysql.query(query, function (err, response) {
      if (err) {
        return cb(err);
      }
      cb(null, response[0]);
    });
  },

  changeInfo: function (userId, changes, cb) {
    if (changes.newPassword) {
      if (changes.password.length < 3 || changes.password.length > 64) {
        return cb(Error('Password is invalid'));
      }
      if (changes.newPassword.length < 3 || changes.newPassword.length > 64) {
        return cb(Error('New password is invalid'));
      }
    }
    if (['MALE', 'FEMALE'].indexOf(changes.sex) === -1) {
      return cb(Error('Поле "Пол" не должно быть пустым'));
    }
    if (changes.year < 1900 || changes.year > new Date().getFullYear() - 4) {
      return cb(Error('Поле "Дата рождения" не соответствует формату'));
    }

    var query = squel.update()
      .table('users')
      .set('sex', changes.sex)
      .set('year', changes.year)
      .where('id=?', userId);

    if (changes.newPassword) {
      query.set('password', changes.newPassword)
        .where('password=?', changes.password);
    }

    mysql.query(query, function (err, response) {
      if (err) {
        return cb(err);
      }
      if (!response.affectedRows) {
        return cb(Error('Неверный пароль'));
      }
      cb(null);
    });
  }
};

module.exports = userModel;
