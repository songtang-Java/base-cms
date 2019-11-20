/*用户集合*/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
    username: { // 用户名
        type: String,
        required: true
    },
    userId: { // 证件
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        default: null
    },
    avatar: { // 头像
        type: String,
        default: ""
    },
    homePlace: {
        type: String,
        default: ""
    },
    workPlace: {
        type: String,
        default: ""
    },
    minZu:{
        type:String,
        default:""
    },
    wx:{
        type:String,
        default:""
    },
    qq:{
        type:String,
        default:""
    },
    sex: {
        type: Number,
        default: 1
    },
    education: {
        type:String,
        default:""
    },
    jobName: {
        type:String,
        default:""
    },
    salary: {
        type: String,
        default:""
    },
    ruDangTime:{
        type:String,
        default:""
    },
    lastTime:{
        type:String,
        default:""
    },
    identity : { // 身份
        type:String,
        default:0  //1 积极分子 0 党员  2 预备
    },
    dzb: {
        type:String,
        default:0  //0 北京党支部， 1第一党支部  2第二党支部 3第三党支部
    },
    jfs:{ // 积分
        type:String,
        default:0
    },
    jfDetail:{ // 积分详情
        type:Array,
        default:[]
    },
},{versionKey: false, timestamps: {createdAt: 'create_time', updatedAt: 'update_time'}}); //设置取消上传数据库带有的版本号

module.exports = mongoose.model("User", User);
