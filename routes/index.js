var express = require('express');
var router = express.Router();
var userdata = require("../usersData.js")
/* GET home page. */
router.get('/', function(req, res, next) {
      if (req.cookies.user == null) {
        res.redirect('/signin');
      } else {
        res.render('index');
      }
});
router.get('/signin', function (req, res) {
  res.sendfile('views/signin.html');
});

router.post('/login', function (req, res) {
    if (!userdata.addUser(req.body.name)) {
    //存在，则不允许登陆
    res.redirect('/signin');
  } else {
    //不存在，把用户名存入 cookie 并跳转到主页
    res.cookie("user", req.body.name, {maxAge: 1000*60*60*24});
    res.redirect('/users/');
  }
});
module.exports = router;
