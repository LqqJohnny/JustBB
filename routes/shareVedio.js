// shareVedio
var express = require('express');
var router = express.Router();
let  fs = require('fs');
let  join = require('path').join;

router.get('/shareVedio', function(req, res, next) {
    res.redirect('/shareVedio/');
});
router.get('/search', function(req, res, next) {
    console.log(req.query.word);
    let fileNames=searchSync(req.query.word);
    res.render('shareVedio',{list:fileNames});
});

router.get('/*', function(req, res, next) {
        var path = decodeURI(req.url);
        // console.log("搜索的文件夹是："+path);
        var list = findSync(path);

        res.render('shareVedio',{list:list});
});


function findSync(startPath) {
    let result=[];
    var path = './public/vedios'+startPath;
    let files=fs.readdirSync(path);
    files.forEach((val,index) => {
        let fPath=join(path,val); // 用于分析是否是 文件夹 返回的数据用的是 val

        let stats=fs.statSync(fPath);
        var pa = fPath.replace(/public\\vedios\\/,"");
        if(stats.isDirectory()) {result.unshift({type:"directory",name:val,path:pa})};
        if(stats.isFile()){
            result.push({type:"file", name:val, path:pa});
        }
    });
    return result;
}

function searchSync(word) {
    let result=[];
    function finder(path) {
        let files=fs.readdirSync(path);
        files.forEach((val,index) => {
            let fPath=join(path,val);
            let stats=fs.statSync(fPath);
            if(val.indexOf(word)>-1){  //  含有搜索词
                var pa = fPath.replace(/public\\vedios\\/,"");
                if(stats.isDirectory()) {result.unshift({type:"directory",name:val,path:pa})};
                if(stats.isFile()){
                    result.push({type:"file", name:val, path:pa});
                }
            }else{  // 不包含搜索词
                if(stats.isDirectory()) {
                    finder(fPath);
                };
            }

        });

    }
    finder('./public/vedios/');
    return result;
}


module.exports = router;
