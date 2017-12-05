const cheerio = require('cheerio');
const phantom = require('phantom');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
    // 根据url地址获取资源的url数组
    async function getUrlList(word) {
       let url = 'https://www.doutula.com/search?type=photo&more=1&keyword='+word+'&page=1';
       let  urlList = [];
       const instance = await phantom.create();
       const page = await instance.createPage();
       try {
           await page.on("onResourceRequested", function (requestData) {
           });

           await page.on('onResourceReceived', function(response) {
           });
           //打开页面
           const status = await page.open(url);

           //延时
           await sleep(1000);
           //获取页面内容
           const content = await page.property('content');
           let $ = cheerio.load(content);
           let imgsEle = $(".random_picture>a>img");
           console.log(imgsEle.length);
           imgsEle.each(function(i){
               urlList.push($(this).attr("data-backup"));
           })
           console.log(urlList);
           await instance.exit();
           return urlList;
       } catch (err) {
           console.log(err);
           return;
       }
     }
module.exports = getUrlList();
