var express = require('express');
var router = express.Router();
var userdata = require('../usersData.js')
/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.cookies.user == null) {
      res.redirect('/signin');
    } else {
      res.render('index');
    }
});

router.post('/getUserList', function(req, res, next) {
    console.log(userdata.getAllUser());
    res.send(userdata.getAllUser())
});

module.exports = router;
