const express = require("express");
const router = express.Router();
const passport = require("passport");
const newsDB = require("../database/model/news");

// 1. 添加新闻
router.post("/addNews", passport.authenticate("jwt", {session: false}), async (req, res) => {
    const {title, newsDesc, contentText, img, author, newsType} = req.body;
    const finalData = await newsDB.create({title, newsDesc, contentText, img, author, newsType});
    if(finalData) {
        res.json({
            code: 200,
            msg: "添加新闻成功!",
            data: finalData
        })
    } else {
        res.json({
            code: 400,
            msg: "添加新闻失败!",
        })
    }
});

// 2. 编辑新闻
router.post("/editNews", passport.authenticate("jwt", {session: false}), async (req, res) => {
    const {id, title, newsDesc, contentText, img, author, newsType} = req.body;
    const finalData = await newsDB.findOneAndUpdate({_id: id}, {title, newsDesc, contentText, img, author, newsType}, {new: true});
    if(finalData) {
        res.json({
            code: 200,
            msg: "新闻修改成功！",
            data: finalData
        })
    } else {
        res.json({
            code: 400,
            msg: "新闻修改失败！"
        })
    }
});

// 3. 删除新闻
router.get("/deleteNews/:id", passport.authenticate("jwt", {session: false}), async (req, res) => {
    const {id} = req.params;
    const finalData = await newsDB.deleteOne({_id: id});
    if(finalData) {
        res.json({
            code: 200,
            msg: "新闻删除成功！",
            data: finalData
        })
    } else {
        res.json({
            code: 400,
            msg: "新闻删除失败！"
        })
    }
});

// 4. 分页获取新闻
router.get("/getNews/:pn/:size", passport.authenticate("jwt", {session: false}), async (req, res) => {
    let {pn, size} = req.params;
    pn = parseInt(pn);
    size = parseInt(size);
    const count = await newsDB.countDocuments();
    const finalData = await newsDB.find({}).sort({create_time: 1}).limit(size).skip((pn - 1) * size);
    if(finalData) {
        res.json({
            code: 200,
            msg: "success!",
            data: finalData,
            count
        })
    } else {
        res.json({
            code: 400,
            msg: "Failed to get data!",
        })
    }
});

// 5. 获取某哟个特定新闻
router.get("/getTheNews/:id", passport.authenticate("jwt", {session: false}), async (req, res) => {
    const {id} = req.params;
    const finalData = await newsDB.findOne({_id: id});
    if(finalData) {
        res.json({
            code: 200,
            msg: "success!",
            data: finalData,
        })
    } else {
        res.json({
            code: 400,
            msg: "Failed to get data!",
        })
    }
})

module.exports = router;
