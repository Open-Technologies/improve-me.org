var path = require('path');
var appRootPath = require('app-root-path');
var express = require('express');
var MySQLSession = require('express-mysql-session');
var session = require('express-session');
var dotInclude = require('dot-include');
var bodyParser = require('body-parser');
var serverConfig = require('./config/server');
var mysqlConfig = require('./config/mysql');
var userModel = require('./models/user');
var postsModel = require('./models/posts');
var testsModel = require('./models/tests');

var __ROOT = appRootPath.toString();

var app = express();

// Template engine settings
app.engine('dot', dotInclude.__express);
app.set('views', path.join(__ROOT, 'back-end/views'));
app.set('view engine', 'dot');

app.use(session({
  secret: 'DWufhwofo32fPWJIfj31',
  name: 'user_sessions',
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: null
  },
  resave: true,
  saveUninitialized: true,
  store: new MySQLSession(mysqlConfig)
}));

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static(path.join(__ROOT, 'front-end')));

app.get('/', function (req, res, next) {
  var curPage = Number(req.query.page) || 1;
  postsModel.getPosts(null, curPage, function (err, posts, pages) {
    if (err) {
      return next(err);
    }

    res.render('posts', {
      authorized: Boolean(req.session.userId),
      posts: posts,
      pages: pages,
      currentPage: curPage,
      registeringStep: 'BASE_TESTS' // 'BASE_TESTS', 'COMPLETED'
    });
  });
});

app.get('/tests', function (req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/signin');
  }
  var filters = {
    status: req.query.status || 'NOT_FINISHED'
  };
  testsModel.getList(req.session.userId, filters, function (err, tests) {
    if (err) {
      return next(err);
    }
    res.render('tests', {
      authorized: Boolean(req.session.userId),
      filters: filters,
      tests: tests
    });
  });
});

app.get('/tests/:id', function (req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/signin');
  }
  testsModel.getTest(req.params.id, function (err, testData) {
    if (err) {
      return next(err);
    }
    res.render('test', testData);
  });
});

app.get('/test-result/:resultId', function (req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/signin');
  }
  testsModel.getResult(req.session.userId, req.params.resultId, function (err, result) {
    if (err) {
      return next(err);
    }
    res.render('test-result', result);
  });
});

app.get('/stats', function (req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/signin');
  }
  testsModel.getCompletedTests(req.session.userId, function (err, results) {
    if (err) {
      return next(err);
    }
    res.render('stats', {
      authorized: Boolean(req.session.userId),
      results: results
    });
  });
});

app.get('/profile', function (req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/signin');
  }
  userModel.getInfo(req.session.userId, function (err, info) {
    if (err) {
      return next(err);
    }
    res.render('profile', {
      authorized: Boolean(req.session.userId),
      errorMsg: req.query.errorMsg,
      ok: req.query.ok,
      user: info
    });
  });
});

app.get('/signup', function (req, res) {
  if (req.session.userId) {
    return res.redirect('/');
  }
  res.render('signup', {
    errorMsg: req.query.errorMsg
  });
});

app.get('/signin', function (req, res) {
  if (req.session.userId) {
    return res.redirect('/');
  }
  res.render('signin', {
    errorMsg: req.query.errorMsg
  });
});

app.get('/logout', function (req, res) {
  delete req.session.userId;
  res.redirect('/');
});

app.get('/category/:categoryId', function(req, res, next) {
  var curPage = Number(req.query.page) || 1;
  postsModel.getCategoryName(req.params.categoryId, function (err, categoryName) {
    if (err) {
      return next(err);
    }
    postsModel.getPosts(req.params.categoryId, curPage, function (err, posts, pages) {
      if (err) {
        return next(err);
      }

      res.render('posts', {
        authorized: Boolean(req.session.userId),
        categoryName: categoryName,
        posts: posts,
        pages: pages,
        currentPage: curPage
      });
    });
  });
});

app.get('/post/:postId', function (req, res, next) {
  postsModel.getPost(req.params.postId, function (err, postInfo) {
    if (err) {
      return next(err);
    }
    res.render('post', {
      authorized: Boolean(req.session.userId),
      post: postInfo
    });
  });
});

app.post('/api/signin', function (req, res) {
  userModel.login(req.body.login, req.body.password, function (err, userId) {
    if (err) {
      return res.redirect('/signin?errorMsg=' + encodeURIComponent(err.message));
    }
    req.session.userId = userId;
    res.redirect('/');
  });
});

app.post('/api/signup', function (req, res) {
  userModel.registration(req.body, function (err, userId) {
    if (err) {
      return res.redirect('/signup?errorMsg=' + encodeURIComponent(err.message));
    }
    req.session.userId = userId;
    res.redirect('/');
  });
});

app.post('/api/test/:testId', function (req, res, next) {
  if (!req.session.userId) {
    return next();
  }
  testsModel.completeTest(req.session.userId, req.params.testId, req.body, function (err, resultId) {
    if (err) {
      return next(err);
    }
    res.redirect('/test-result/' + resultId);
  });
});

app.post('/api/profile', function (req, res, next) {
  if (!req.session.userId) {
    return next();
  }
  userModel.changeInfo(req.session.userId, req.body, function (err) {
    if (err) {
      return res.redirect('/profile?errorMsg=' + encodeURIComponent(err.message));
    }
    res.redirect('/profile?ok=1');
  });
});

// Start server
var server = app.listen(serverConfig.port);
server.on('listening', function () {
  console.log('Lifted on http://localhost:' + serverConfig.port + '/\n');
});
