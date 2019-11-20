const express = require("express");
const router = express.Router();
const swiperDB = require("../database/model/swiper");
const passport = require("passport");

/* 1. 增加轮播图*/
router.post("/addSwiper", passport.authenticate("jwt", {session: false}), async (req, res) => {
    let {pic, sort, status, title} = req.body;
    let resultData = await swiperDB.create({pic, sort, status, title});
    if(resultData) {
        res.json({
            code: 200,
            msg: '轮播图添加成功！',
            data: resultData
        })
    } else {
        res.json({
            code: 400,
            msg: "轮播图添加失败"
        })
    }
});

/* 2. 删除轮播图*/
router.get("/deleteSwiper", passport.authenticate("jwt", {session: false}), async (req, res) => {
    const {id} = req.query;
    await swiperDB.deleteOne({_id: id}, function(err, resultData){
        if(err) {
            res.json({
                code: 400,
                msg: "轮播图删除失败",
            })
        } else {
            res.json({
                code: 200,
                msg: "轮播图删除成功",
                data: resultData
            })
        }
    },);
});

/* 3. 编辑轮播图*/
router.post("/editSwiper", passport.authenticate("jwt", {session: false}), async (req, res) => {
    console.log(req.body);
    const {_id, pic, sort, status, title} = req.body;
    // console.log(id);
    const resultData = await swiperDB.findOneAndUpdate({_id: _id}, {pic, sort, status, title}, {new: true});
    console.log(resultData);
    if(resultData) {
        res.json({
            code: 200,
            msg: "轮播图修改成功！",
            data: resultData
        })
    } else {
        res.json({
            code: 400,
            msg: "轮播图修改失败！"
        })
    }
});

/* 4. 查询所有的轮播图*/
router.get("/getSwiper",passport.authenticate("jwt", {session: false}),  async (req, res) => {
    let {pn , size} = req.query;
    pn = parseInt(pn);
    size = parseInt(size);
    const count = await swiperDB.countDocuments();
    const resultData = await swiperDB.find({}).sort({create_time: 1}).limit(size).skip((pn - 1) * size);
    if(resultData) {
        res.json({
            code: 200,
            msg: "success!",
            data: resultData,
            count

        })
    } else {
        res.json({
            code: 400,
            msg: "Failed to get data!",
        })
    }
});

/* 5. 查询某哟个的轮播图*/
router.get("/getOneSwiper", passport.authenticate("jwt", {session: false}), async(req, res) => {
    const {id} = req.query;
    const resultData = await swiperDB.findOne({_id: id});
    if(resultData) {
        res.json({
            code: 200,
            msg: "查询轮播图成功！",
            data: resultData
        })
    } else {
        res.json({
            code: 400,
            msg: "查询轮播图失败！",
        })
    }
});

/* 6. 批量删除轮播图*/
router.get("/deleteAllSelected/:idArr", passport.authenticate("jwt", {session: false}), async(req, res) => {
    const {idArr} = req.params; // type: string
    const newIdArr =idArr.split(",");
    // console.log(idArr);
    // console.log(typeof idArr);
    // console.log(newIdArr);
    // console.log(typeof newIdArr);
    await swiperDB.deleteMany({_id: {$in: newIdArr}}, function (err, resultData) {
        if(err) {
            res.json({
                code: 400,
                msg: "删除失败！",
                data: err
            })
        } else {
            res.json({
                code: 200,
                msg: "删除成功！",
                data: resultData
            })
        }
    })
});

module.exports = router;
