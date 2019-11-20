var express = require('express');
var router = express.Router();
const userDB = require("../database/model/users");
const md5 = require("md5");
// 导入自定义的中间件，对于session的判断
const auth = require('./config/auth');
const jwt = require('jsonwebtoken');
const cert = require('./config/jwtAuth');
const passport = require("passport");

// 1.添加用户，注册
router.post("/registerUser", async (req, res) => {
    let {username, userId, password, phone, avatar, homePlace, workPlace, minZu, wx, qq, sex, education, jobName,
        salary, ruDangTime, identity, dzb, lastTime} = req.body;
    await userDB.findOne({userId}, (err, data) => {
        let resultData;
        if(err) {
            resultData = {
                data: err,
                code: 500,
                msg: false,
            };
            res.json(resultData);
        } else if(data) { // 找到了data
            resultData = {
                data:"该用户已存在",
                code:400,
                msg:"该用户已存在",
            };
            res.json(resultData);
        } else {
            userDB.create({username, userId, password: md5(password), phone, avatar, homePlace, workPlace, minZu, wx, qq, sex, education, jobName,
                salary, ruDangTime, identity, dzb, lastTime}, (err, data) => {
                if(err) {
                    resultData = {
                        data: err,
                        code: 500,
                        msg: false,
                    };
                    res.json(resultData);
                } else {
                    resultData = {
                        data: {username, userId,},
                        code: 200,
                        msg: "注册用户成功!",
                    };
                    res.json(resultData);
                }
            })
        }
    })
});

// 2.登录
router.post("/login", async (req, res) => {
    let resultData;
    const {userId, password} = req.body;
    if(userId && password) {
        let pwd = md5(password);
        // console.log(pwd);
        const user =  await userDB.findOne({userId});
        // console.log(user.password);
        if(user) {
            if(pwd === user.password) {
                const token = await jwt.sign({id: user._id}, cert.secretOrKey, {expiresIn: 3600});
                // req.session.user = user;
                resultData = {
                    code: 200,
                    msg: "登录成功！",
                    data: "Success!",
                    token: "Bearer " + token
                };
                res.json(resultData);
            } else {
                resultData = {
                    code: 400,
                    msg: '密码错误！'
                };
                res.json(resultData);
            }
        } else {
            resultData = {
                code: 400,
                msg: '账号不存在！'
            };
            res.json(resultData);
        }
    } else {
        resultData = {
            code: 400,
            msg: '缺少必要参数！'
        };
        res.json(resultData);
    }
});

// 3.获取所有的用户
router.get("/getUsers", async (req, res) => {
    let {pn , size} = req.query;
    if(pn && size) {
        pn = parseInt(pn);
        size = parseInt(size);
        var count = await userDB.countDocuments();
        var userData = await userDB.find({}).sort({create_time: 1}).limit(size).skip((pn - 1) * size);
    } else {
        var userData = await userDB.find({});
    }
    if(userData) {
        res.json({
            code: 200,
            msg: "success!",
            data: userData,
            count: count || null,
        })
    } else {
        res.json({
            code: 400,
            msg: '查找失败',
        })
    }
});

// 4.修改密码   PATCH方法是新引入的，是对PUT方法的补充，用来对已知资源进行局部更新
router.post("/editPassword",passport.authenticate("jwt", {session: false}), async (req, res) => {
    const {id, password, newPassword, rNewPassword} = req.body;
    const pwd = md5(password);
    const newPwd = md5(newPassword);
    const rNewPwd = md5(rNewPassword);
    const resultData = await userDB.findOne({_id: id});
    // console.log(resultData.password);
    if(resultData) { // 找到了数据
        // console.log(pwd);
        if(pwd === resultData.password) { // 初始密码输入正确
            if(pwd === newPwd) { // 新密码与旧密码一样，改什么？
                res.json({
                    code: 400,
                    msg: "新密码与旧密码相同？换一下试试"
                })
            } else {
                if(newPwd !== rNewPwd) { // 两次输入的新密码不一样
                    res.json({
                        code: 400,
                        msg: "两次输入的新密码不一样！"
                    })
                } else {
                    const data = await userDB.updateOne({_id: id}, {password: newPwd});
                    const newData = await userDB.find({_id: id});
                    if(newData) {
                        res.json({
                            code: 200,
                            msg:'密码修改成功！',
                            data: newData
                        })
                    }
                }
            }
        } else {
            res.json({
                code: 400,
                msg: '密码不正确！'
            })
        }
    } else {
        res.json({
            code: 400,
            msg: '密码修改失败！'
        })
    }
});

// 5. 编辑用户信息
router.post("/editUser",passport.authenticate("jwt", {session: false}), async (req, res) => {
    let {username, userId, phone, avatar, homePlace, workPlace, minZu, wx, qq, sex, education, jobName,
        salary, ruDangTime} = req.body;
    let newData = {username, phone, avatar, homePlace, workPlace, minZu, wx, qq, sex, education, jobName,
        salary, ruDangTime};
    let resultData = await userDB.updateOne({userId}, newData, {new: true});
    if(resultData) {
        res.json({
            code: 200,
            msg: '修改成功！',
            data: resultData
        })
    } else {
        res.json({
            code: 400,
            msg: 'error'
        })
    }
});

// 6. 获取单个用户信息 目的是为了在添加和编辑的共享页面中得到 编辑的详细信息
router.get("/getOneUser/:id",passport.authenticate("jwt", {session: false}), async (req, res) => {
    const id = req.params.id;
    const resultData = await userDB.findById(id);
    if(resultData) {
        res.json({
            code: 200,
            msg: 'success',
            data: resultData,
        })
    } else {
        res.json({
            code: 400,
            msg: 'error'
        })
    }
});

// 7. 删除用户信息
router.get("/deleteUser",passport.authenticate("jwt", {session: false}), async (req, res) => {
    const {id, password} = req.query;
    let pwd = md5(password);
    let resultData = await userDB.findOne({_id: id});
    if(resultData) {
        if(pwd === resultData.password) { // 密码正确，授予权限
            const result = await userDB.deleteOne({_id: id});
            res.json({
                code: 200,
                msg: '删除成功！！！',
                data: result,
            })
        } else { // 密码错误
            res.json({
                code: 400,
                msg: "你不是该账号用户，无法删除！"
            })
        }
    } else {
        res.json({
            code: "400",
            msg: "用户不存在！"
        });
    }
});

// 8. 获取所有用户名
// router.get("/getUsersName", passport.authenticate("jwt", {session: false}), async (req, res) => {
//     const finalData = await userDB.find({});
//     let usernames = [];
//     if(finalData) {
//         finalData.forEach(item => {
//             usernames.push(item.username);
//         });
//         res.json({
//             code:
//         })
//         console.log(usernames);
//     }
// })
module.exports = router;
