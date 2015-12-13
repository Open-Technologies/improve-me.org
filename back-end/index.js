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
  postsModel.getFeed(curPage, function (err, posts, pages) {
    if (err) {
      return next(err);
    }

    res.render('posts', {
      authorized: Boolean(req.session.userId),
      feed: posts,
      pages: pages,
      currentPage: curPage,
      loginErr: Boolean(req.query.loginErr),
      registeringStep: 'BASE_TESTS' // 'BASE_TESTS', 'COMPLETED'
    });
  });
});

app.get('/tests', function (req, res, next) {
  if (!req.session.userId) {
    return next();
  }
  testsModel.getList(function (err, tests) {
    if (err) {
      return next(err);
    }
    res.render('tests', {
      tests: tests
    });
  });
});

app.get('/tests/:id', function (req, res, next) {
  if (!req.session.userId) {
    return next();
  }
  testsModel.getTest(req.params.id, function (err, testData) {
    if (err) {
      return next(err);
    }
    res.render('test', testData);
  });
});

app.get('/signup', function (req, res) {
  res.render('signup', {
    errorMsg: req.query.errorMsg
  });
});

app.get('/logout', function (req, res) {
  delete req.session.userId;
  res.redirect('/');
});

app.post('/api/signin', function (req, res) {
  userModel.login(req.body.login, req.body.password, function (err, userId) {
    if (err) {
      return res.redirect('/?loginErr=1');
    }
    req.session.userId = userId;
    res.redirect('/');
  });
});

app.post('/api/signup', function (req, res) {
  userModel.add(req.body.login, req.body.email, req.body.password, function (err, userId) {
    if (err) {
      return res.redirect('/signup?errorMsg=' + err.message);
    }
    req.session.userId = userId;
    res.redirect('/');
  });
});

// Start server
var server = app.listen(serverConfig.port);
server.on('listening', function () {
  console.log('Lifted on http://localhost:' + serverConfig.port + '/\n');
});
