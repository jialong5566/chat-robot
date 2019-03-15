var http = require("http");
var url = require("url");
var fs = require("fs");
var req  = require("request");
http.createServer(function (request,response) {

    var pathname = url.parse(request.url).pathname;
    var params = url.parse(request.url,true).query;
    var is = isStatic(pathname);
    if(is){
        try{
            var data = fs.readFileSync("./page/" + pathname);
            response.writeHead(200);
            response.write(data);
            response.end();
        }catch (e) {

        }
    }else{
        if(pathname=="/chat"){
            var data = {
                "reqType":0,
                "perception": {
                    "inputText": {
                        "text": params.text
                    }
                },
                "userInfo": {
                    "apiKey": "70696c9531a2413d8123f69310b46ebf",
                    "userId": "375345"
                }
            }
            var content = JSON.stringify(data);
            req({
                url:"http://openapi.tuling123.com/openapi/api/v2",
                method:"POST",
                headers:{
                    "content-type":"application/json"
                },
                body:content
            },function (err,resp,body) {
                if(!err && resp.statusCode==200){

                    var obj = JSON.parse(body);
                    // console.log(body)
                    if(obj && obj.results && obj.results.length>0 && obj.results[0].values){
                        var head ={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET","Access-Control-Allow-Headers":"x-requested-with,content-type"};
                        response.writeHead(200,head);
                        response.write(JSON.stringify(obj.results[0].values));
                        response.end();
                    }
                }else{
                    response.write("{\"text\":\"什么？\"}");
                    response.end();
                }
            })

        }
    }


}).listen(12306)
function isStatic(pathname) {
    var arr = [".html",".js",".css",".jpg",".png",".ico"];
    return arr.some(function (ele) {
        return pathname.endsWith(ele)
    })
}