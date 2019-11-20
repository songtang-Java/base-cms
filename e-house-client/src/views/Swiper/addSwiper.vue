<template>
    <div class="swiper-wrap">
        <el-card v-loading="loading">
            <div slot="header">添加轮播图</div>
            <el-form :model="formData" ref='form' status-icon :rules="rules" size='mini' label-width="110px" label-position="right">
                <el-form-item label='轮播图标题：' prop='title'>
                    <el-input v-model="formData.title"></el-input>
                </el-form-item>
                <el-form-item label='缩略图：' prop='pic'>
                    <uploadImg class="uploadImg" v-model="formData.pic"></uploadImg> <!--注意自定义组件中的v-model-->
                </el-form-item>
                <el-form-item label='排序：' prop='sort'>
                        <el-input-number v-model.number="formData.sort" :min="1" :max="999"></el-input-number>
                </el-form-item>
                <el-form-item label='轮播图状态：' prop='status'>
                    <el-switch v-model.number="formData.status" :active-value='1' :inactive-value='0' active-text="启用" inactive-text="禁止">
                    </el-switch>
                </el-form-item>
                <el-form-item>
                    <el-button v-if="!isEdit" type="primary" @click="addForm('form')">添加</el-button>
                    <el-button v-else type="primary" @click="editForm('form')">编辑</el-button>
                    <el-button v-if="!isEdit" @click="resetForm('form')">重置</el-button>
                    <el-button v-else @click="cancelForm">取消</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import uploadImg from "@/components/UploadImg";
import {mapState} from "vuex";
export default {
    name: "addSwiper",
    components: {uploadImg},
    data() {
        return {
            formData: {
                title: "",
                pic: "",
                sort: 1,
                status: 1,
            },
            loading: true,
            isEdit: false,
            rules: {
                title: [
                    {required: true, message: "请输入轮播图标题!", trigger: "blur"}
                ],
                pic: [
                    {type: "string", message: "请上传轮播图！", trigger: "blur"}
                ],
                sort: [
                    {required: true, message: "请设置排序值!", trigger: "blur"}
                ],
                status: [
                    {required: true, message: "状态判断是数字!", trigger: "blur"}
                ],
            }
        }
    },
    methods: {
        // 1. 提交添加
        addForm(form) {
            this.$refs[form].validate(valid => {
                if(valid) {
                    this.$axios.post(`/swiper/addSwiper`, this.formData)
                        .then(res => {
                            if(res.code === 200) {
                                this.$message({
                                    message: res.msg,
                                    type: "success",
                                    duration: 1000,
                                    center: true
                                });
                                setTimeout(() => {this.$router.push("/layout/swiper")}, 500);
                            } else {
                                this.$message({
                                    message: res.msg,
                                    type: "error",
                                    duration: 1000,
                                    center: true
                                });
                            }
                        })
                        .catch(err => {
                            this.$message({
                                message: "网络链接错误!" + err,
                                type: "error",
                                duration: 1000,
                                center: true
                            });
                        })
                } else {
                    this.$message({
                        message: "数据格式不正确!",
                        type: "error",
                        duration: 1000,
                        center: true
                    });
                    return false;
                }
            })
        },

        // 2. 提交编辑
        editForm(form) {
            this.$refs[form].validate(valid => {
                if(valid) {
                    this.$axios.post(`/swiper/editSwiper`, this.formData)
                        .then(res => {
                            if(res.code === 200) {
                                this.$message({
                                    message: res.msg,
                                    type: "success",
                                    duration: 1000,
                                    center: true
                                });
                                setTimeout(() => this.$router.push("/layout/swiper"), 500);
                            } else {
                                this.$message({
                                    message: res.msg,
                                    type: "error",
                                    duration: 1000,
                                    center: true
                                });
                            }
                        })
                        .catch(err => {
                            this.$message({
                                message: "网络链接错误!" + err,
                                type: "error",
                                duration: 1000,
                                center: true
                            });
                        })
                } else {
                    this.$message({
                        message: "请完善数据内容!",
                        type: "error",
                        duration: 1000,
                        center: true
                    });
                    return false;
                }
            })
        },

        // 3. 获得单个编辑的数据--> 这时候就体现出来了vuex的好处啊
        getData() {
            this.loading = true;
            this.$axios.get(`/swiper/getOneSwiper/?id=${this.userId}`)
                .then(res => {
                    if(res.code === 200) {
                        this.loading = false;
                        this.formData = res.data;
                    } else {
                        this.loading = false;
                        this.$message({
                            message: res.msg,
                            type: "error",
                            duration: 1000,
                            center: true
                        });
                    }
                })
                .catch(err => {
                    this.loading = false;
                    this.$message({
                        message: "网络链接错误!" + err,
                        type: "error",
                        duration: 1000,
                        center: true
                    });
                })
        },

        // 4. 取消
        cancelForm() {
            this.$message({
                message: "取消修改!",
                type: "info",
                duration: 1000,
                center: true
            });
            setTimeout(() => this.$router.push("/layout/swiper"), 1000);
        },

        // 5. 重置
        resetForm(form) {
            this.$refs[form].resetFields();
        }
    },
    computed: {
        ...mapState(["userId"]),
    },
    created() {
        if(this.$route.name === "addSwiper") {
            this.loading = false;
            this.isEdit = false;
        } else {
            this.isEdit = true;
            this.getData();
        }
    },
    watch: {
        $route(to) {
            if(to.name === "addSwiper") {
                this.loading = false;
                this.isEdit = false;
                this.formData = {}; // 清空编辑页面的数据
            } else {
                this.isEdit = true;
            }
        }
    }
}
</script>

<style scoped lang='scss'>
.newsDetail-wrap {
  display: flex;
  // justify-content: space-between;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
  width: 330px;
  height: 105px;
  padding: 5px;
  .newsDetail-img {
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 5px;
    img {
      border-radius: 5px;
    }
  }
  .newsDetail-content {
    // border: 1px solid #000;
    box-sizing: border-box;
    height: 95px;
    width: 225px;
    padding: 10px;
    .conent-title {
      font-size: 14px;
      font-weight: 500;
      width: 200px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      margin-bottom: 5px;
      span {
        font-weight: 600;
      }
    }
    .content {
      font-size: 12px;
      font-weight: 500;
      line-height: 1.5;
      width: 205px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
  }
}
.el-input {
  width: 400px;
}
.el-card {
  width: 700px;
  height: calc(100vh - 105px);
}
/deep/ img {
  width: 80px;
  height: 80px;
}
/deep/ .el-upload {
  display: block;
  width: 80px;
}
/deep/ .avatar-uploader-icon {
  font-size: 14px;
  width: 80px;
  height: 80px;
  line-height: 80px;
}
/deep/ .avatar {
  width: 80px;
  height: 80px;
}
.el-dialog {
  img {
    width: 60px;
    height: 60px;
  }
}
</style>
