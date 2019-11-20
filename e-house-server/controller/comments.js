const express = require("express");
const router = express.Router();
const commentsDB = require("../database/model/comments");
const passport = require("passport");

/* 1. 发起评议 */
router.post("/addComments", passport.authenticate("jwt", {session: false}), async (req, res) => {
    const {description, content, status} = req.body;
    let finalData = await commentsDB.create({description, content, status});
    if(finalData) {
        res.json({
            code: 200,
            msg: "发起评议成功！",
            data: finalData
        })
    } else {
        res.json({
            code: 400,
            msg: "发起评议失败！"
        })
    }
});

/* 2. 修改评议 */
router.post("/editComments", passport.authenticate("jwt", {session: false}), async (req, res) => {
    const {_id, description, content, status} = req.body;
    const finalData = await commentsDB.findOneAndUpdate({_id: _id}, {description, content, status}, {new: true});
    if(finalData) {
        res.json({
            code: 200,
            msg: "修改评议成功！",
            data: finalData
        })
    } else {
        res.json({
            code: 400,
            msg: "修改评议失败！"
        })
    }
});

/* 3. 分页查询所有评议 */
router.get("/getComments/:pn/:size", passport.authenticate("jwt", {session: false}), async (req, res) => {
    let {pn , size} = req.params;
    pn = parseInt(pn);
    size = parseInt(size);
    const count = await commentsDB.countDocuments();
    const finalData = await commentsDB.find({}).sort({create_time: 1}).limit(size).skip((pn - 1) * size);
    if(finalData) {
        res.json({
            code: 200,
            msg: "查询评议成功！",
            data: finalData,
            count
        })
    } else {
        res.json({
            code: 400,
            msg: "查询评议失败！"
        })
    }
})

/* 4. 查询某个评议 */
router.get("/getTheComments/:id", passport.authenticate("jwt", {session: false}), async (req, res) => {
    const {id} = req.params;
    const finalData = await commentsDB.findOne({_id: id});
    if(finalData) {
        res.json({
            code: 200,
            msg: "查询特定评议成功！",
            data: finalData
        })
    } else {
        res.json({
            code: 400,
            msg: "查询特定评议失败！"
        })
    }
});

/* 5. 更新某个评议状态 */
router.post("/updateStatus/:id/:status", passport.authenticate("jwt", {session: false}), async (req, res) => {
    const {id, status} = req.params;
    // let status;
    // if(to === 1) { // 让status变成1  开启
    //     status = 1;
    // }else if (to === -1) { // 让status变成-1  结束
    //     status = -1;
    // }
    const finalData = await commentsDB.findOneAndUpdate({_id: id}, {status}, {new :true});
    if(finalData) {
        res.json({
            code: 200,
            msg: "更新状态成功！",
            data: finalData
        })
    } else {
        res.json({
            code: 200,
            msg: "更新状态失败！",
        })
    }
});

module.exports = router;
