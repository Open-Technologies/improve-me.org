var squel = require('squel');
var mysql = require('../common/mysql');

var RECORDS_PER_PAGE = 8;

var postsModel = {
  getFeed: function (page, cb) {
    var query = squel.select()
      .from('posts')
      .field('posts.id', 'id')
      .field('title')
      .field('categoryId')
      .field('categories.name', 'category')
      .field('shortcut')
      .field('imageUrl')
      .limit(RECORDS_PER_PAGE)
      .offset((page - 1) * RECORDS_PER_PAGE)
      .order('timestamp', false)
      .left_join('categories', null, 'posts.categoryId = categories.id');
    var queryCount = squel.select()
      .from('posts')
      .field('count(*)', 'count');
    mysql.query(query, function (err, posts) {
      if (err) {
        return cb(err);
      }
      mysql.query(queryCount, function (err, count) {
        if (err) {
          return cb(err);
        }
        var pages = Math.ceil(count[0].count / RECORDS_PER_PAGE);
        cb(null, posts, pages);
      });
    });
  }
};

module.exports = postsModel;
