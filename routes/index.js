var express = require('express');
var router = express.Router();
var userdata = require("../usersData.js");
var draw_guess_data = require("../draw_guess_data.js")  ;
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
//  你画我猜  draw&guess
router.get('/draw&guess', function(req, res, next) {
      if (req.cookies.user == null) {
        res.redirect('/signin');
      } else {
            var creator = req.query.creator;
            var guest = req.cookies.user;
            draw_guess_data.addGuest(creator);
            // 如果是 房间创建者 本人
            if(creator==guest){
                res.render('draw&guess');
            }else if(draw_guess_data.getGuest(creator)==""){
                draw_guess_data.addGuest(creator,guest);
                res.render('draw&guess');
            }
            else if(draw_guess_data.getGuest(creator) == guest){res.render('draw&guess');}
            else{res.redirect('/full');}
      }
});

// 房间人满 提示
router.get('/full', function (req, res) {
 res.render('roomFull');
});

module.exports = router;
