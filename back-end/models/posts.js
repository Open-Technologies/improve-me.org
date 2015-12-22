var squel = require('squel');
var mysql = require('../common/mysql');

var RECORDS_PER_PAGE = 8;

var postsModel = {
  getPosts: function (categoryId, page, cb) {
    var query = squel.select()
      .from('posts')
      .field('posts.id', 'id')
      .field('title')
      .field('categoryId')
      .field('category.name', 'category')
      .field('shortcut')
      .field('imageUrl')
      .limit(RECORDS_PER_PAGE)
      .offset((page - 1) * RECORDS_PER_PAGE)
      .order('timestamp', false)
      .left_join('category', null, 'posts.categoryId = category.id');
    if (categoryId) {
      query.where('categoryId=?', categoryId);
    }

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
  },

  getCategoryName: function (categoryId, cb) {
    var query = squel.select()
      .from('category')
      .field('name')
      .where('id=?', categoryId);
    mysql.query(query, function (err, response) {
      if (err) {
        return cb(err);
      }
      if (!response.length) {
        return cb(Error('Invalid category id'));
      }
      cb(null, response[0].name);
    });
  },

  getPost: function (postId, cb) {
    var query = squel.select()
      .from('posts')
      .field('title')
      .field('body')
      .field('imageUrl')
      .where('id=?', postId)
      .where('is_active=1');
    console.log('smt', query.toString());
    mysql.query(query, function (err, response) {
      if (err) {
        return cb(err);
      }
      if (!response.length) {
        return cb(Error('Post not found'));
      }
      cb(null, response[0]);
    });
  }
};

module.exports = postsModel;
