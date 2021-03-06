var config = require('./config');
var crypto = require('crypto');
var https = require('https');
var querystring = require('querystring');
var headers = {
      'X-LC-Id': config.applicationId,
      'X-LC-Sign': sign(config.applicationKey),
      'X-LC-UA': 'AV/js1.5.0',
      'Origin': 'https://juejin.im',
      'Content-type':'application/json',
    //   'Referer': 'https://gold.xitu.io'
  };
var baseOptions = {
  hostname: 'api.leancloud.cn',
  port: 443,
  path: '/1.1/classes/Entry',
  method: 'GET',
  headers
};
function sign(key) {
    var timestamp = Date.now()
    var md5 = crypto.createHash('md5');
    md5.update(timestamp + key);
    var signature = md5.digest('hex')+ ',' + timestamp
    return signature
}
function basePath(path){
    return `/${config.version}${path}`;
}
function get(path, params){
    path = basePath(path) + '?' + querystring.stringify(params)
    var opt = Object.assign({}, baseOptions, {method:'GET',path:path});
    var promise = new Promise((resolve, reject)=>{
        var sendPromise = sendData(opt);
        sendPromise.then(data =>{
            resolve(data);
        },error =>{
            reject(error);
        })
    });
    return promise;
}

function post(path, params){
    // path = basePath(path) + '?' + querystring.stringify(params)
    path = basePath(path);
    var opt = Object.assign({}, baseOptions, {method:'POST',path:path});
    var promise = new Promise((resolve, reject)=>{
        var sendPromise = sendData(opt,params);
        sendPromise.then(data =>{
            resolve(data);
        },error =>{
            reject(error);
        })
    });
    return promise;
}

function sendData(opt, postParams){
    var promise = new Promise((resolve,reject)=>{
        var req = https.request(opt, res => {
            // console.log('statusCode:', res.statusCode);
            // console.log('headers:', res.headers);
            var data = '';
            res.on('data', (d) => {
                data += d;
            });
            res.on('end',()=>{
                resolve(JSON.parse(data));
            })
        });
        if(opt.method == 'POST'){
             req.write(JSON.stringify(postParams));
        }
        req.on('error', (e) => {
            reject(e);
        });
        req.end();
    })
    return promise;
}
function refreshHeader(){
    headers['X-LC-Sign'] = sign(config.applicationKey);
}
function addHeaderItem(header){
    headers = Object.assign(headers, header);
}
module.exports = {
    get: get,
    post: post,
    refreshHeader: refreshHeader,
    addHeaderItem
}