/*帖子集合*/
const mongoose = require("mongoose");
const postList = new mongoose.Schema({
    username: {
        type: String
    },
    userId: {
        type: String
    },
    content: {
        type: String
    },
    reply: { // 跟帖
        type: Array,
        default: []
    },
    type:{
        type:String,
        default:0 //0 个人总结， 1思想汇报  2心得总结
    },
    check:{
        type:String,
        default:false //默认待审核
    },
}, {versionKey: false, timestamps: {createdAt:  'create_time', updatedAt: 'update_time'}});

module.exports = mongoose.model("postLists", postList);
