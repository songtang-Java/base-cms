const express = require("express");
const router = express.Router();
const passport = require("passport");
const categoriesDB = require("../database/model/categories");

/* 1. 添加新闻类型*/
router.post("/addCategories",passport.authenticate("jwt", {session: false}), async (req, res) => {
    const {newsType} = req.body;
    const finalData = await categoriesDB.create({newsType});
    if(finalData) {
        res.json({
            code: 200,
            msg: "添加新闻类型成功！",
            data: finalData
        })
    } else {
        res.json({
            code: 400,
            msg: "添加新闻类型失败！"
        })
    }
});

/* 2. 删除新闻类型*/
router.get("/deleteCategories/:id", passport.authenticate("jwt", {session: false}), async (req, res) => {
    const {id} = req.params;
    const finalData = await categoriesDB.findOneAndDelete({_id: id});
    if(finalData) {
        res.json({
            code: 200,
            msg: "删除新闻类型成功！",
            data: finalData
        })
    } else {
        res.json({
            code: 400,
            msg: "删除新闻类型失败！"
        })
    }
});

/* 3. 编辑新闻类型*/
router.post("/editCategories", passport.authenticate("jwt", {session: false}), async (req, res) => {
    const {id, newsType} = req.body;
    const finalData = await categoriesDB.findOneAndUpdate({_id: id}, {newsType}, {new: true});
    if(finalData) {
        res.json({
            code: 200,
            msg: "编辑新闻类型成功！",
            data: finalData
        })
    } else {
        res.json({
            code: 400,
            msg: "编辑新闻类型失败！"
        })
    }
});

/* 4. 查询新闻类型*/
router.get("/getCategories",  passport.authenticate("jwt", {session: false}), async (req, res) => {
    const finalData = await categoriesDB.find({});
    if(finalData) {
        res.json({
            code: 200,
            msg: "查询新闻类型成功！",
            data: finalData
        })
    } else {
        res.json({
            code: 400,
            msg: "查询新闻类型失败！"
        })
    }
});

module.exports = router;
