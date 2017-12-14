// shareVedio
var express = require('express');
var router = express.Router();
let  fs = require('fs');
let  join = require('path').join;

router.get('/', function(req, res, next) {
      res.render('shareVedio');
});


router.get('/getDataList', function(req, res, next) {
    // 获得资源文件下的所有文件名 并返回数组
    let fileNames=findSync('./public/vedios');
    res.send(fileNames)
});

function findSync(startPath) {
    let result=[];
    function finder(path) {
        let files=fs.readdirSync(path);
        files.forEach((val,index) => {
            let fPath=join(path,val);
            let stats=fs.statSync(fPath);
            if(stats.isDirectory()) finder(fPath);
            if(stats.isFile()) result.push(fPath.replace(/public\\vedios\\/,""));
        });

    }
    finder(startPath);
    return result;
}


module.exports = router;
