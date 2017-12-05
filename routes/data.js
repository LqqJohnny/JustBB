var express = require('express');
var router = express.Router();

const cheerio = require('cheerio');
const phantom = require('phantom');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

router.get('/search', function(req, res, next) {
      var word = req.query.word;
      var urlList =[];
      console.log("搜索图片："+word);
      let url = 'https://www.doutula.com/search?type=photo&more=1&keyword='+word+'&page=1';
      (async function() {
          const instance = await phantom.create();
          const page = await instance.createPage();
          await page.on('onResourceRequested', function(requestData) {

          });

          const status = await page.open(url);

          //延时
          await sleep(2000);

          const content = await page.property('content');
          let $ = cheerio.load(content);
          let imgsEle = $(".random_picture>a>img");
          if(imgsEle.length>0){
              imgsEle.each(function(i){
                  urlList.push($(this).attr("data-backup") || $(this).attr("data-original"));
              })
          }else{
              console.log("未找到图片");
          }
          console.log("图片搜索完毕！！");
          await instance.exit();
          res.send(urlList);
        })();
});
module.exports = router;
