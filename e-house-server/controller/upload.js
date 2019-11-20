const {Router} = require('express')
const router = Router()
const qiniu = require('qiniu')

// pxch8rbbf.bkt.clouddn.com
// 七牛云存储设置，
var accessKey = 'K9rPihqXs43V8pVCLNgnHbxyxO79EFUaj--9Zo5N';
var secretKey = 'g1A9jM47lf2nfi2gP8sEohF9xUCuq-3OurApf4AV';
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
var options = {
    scope: "hanking",
    returnBody:  '{"key": $(key), "hash": $(etag), "url": "http://static.songtang.xyz/$(key)"}',
    expires: 3600,
    deadline: Math.round(new Date().getTime()/1000)+3600,
};
var putPolicy = new qiniu.rs.PutPolicy(options);

router.get('/getToken',(req,res) => {
    var uploadToken=putPolicy.uploadToken(mac);
    res.json({
        code: 200,
        mag: 'success',
        token: uploadToken,
    })
});

module.exports = router;
