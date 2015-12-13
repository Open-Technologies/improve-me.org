var squel = require('squel');
var mysql = require('../common/mysql');

var testsModel = {
  getList: function (cb) {
    var query = squel.select()
      .from('test')
      .field('id')
      .field('name')
      .field('image')
      .field('description');
    mysql.query(query, cb);
  },

  getTest: function (id, cb) {
    const testInfoQuery = squel.select()
      .from('test')
      .field('id')
      .field('name')
      .where('id=?', id);
    mysql.query(testInfoQuery, function (err, testInfo) {
      if (err) {
        return cb(err);
      }

      testInfo = testInfo[0];
      if (!testInfo) {
        return cb(Error('Test not found'));
      }

      const questionsQuery = squel.select()
        .from('test_question')
        .field('body')
        .field('is_simple_variants', 'isSimpleVariants')
        .where('test_id=?', id);

      mysql.query(questionsQuery, function (err, questionsInfo) {
        if (err) {
          return cb(err);
        }

        testInfo.questions = questionsInfo.map(function (question) {
          if (question.isSimpleVariants) {
            question.variants = [
              {id: 1, text: 'Да'},
              {id: 0, text: 'Нет'}
            ];
          }
          return question;
        });

        cb(null, testInfo);
      });
    });
  }
};

module.exports = testsModel;
