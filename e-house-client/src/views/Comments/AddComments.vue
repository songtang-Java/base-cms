<template>
    <div class="addComments">
        <el-card v-loading="loading">
            <el-form :model="formData" ref='form' status-icon :rules="rules" size='mini' label-width="110px" label-position="right">
                <el-form-item label='描述：' prop='description' class="description">
                    <el-col :span="23">
                        <el-input v-model="formData.description"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label='内容：' prop='content' class="content">
                    <el-col :span="24">
                        <quill-editor
                                v-model="formData.content"
                                class="ql-editor"
                                ref="myQuillEditor"
                                :options="editorOption"
                                @change="handleChange">
                         </quill-editor>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button v-if="!isEdit" type="primary" @click="addForm('form')">添加</el-button>
                    <el-button v-else type="primary" @click="editForm('form')">修改</el-button>
                    <el-button v-if="!isEdit" @click="resetForm('form')">重置</el-button>
                    <el-button v-else @click="cancelForm">取消</el-button>
                </el-form-item>
             </el-form>
        </el-card>
    </div>
</template>

<script>
    import {mapState} from "vuex";
    export default {
        name: "AddComments",
        data() {
            return {
                formData: {
                    description: "",
                    content: ""
                },
                loading: false,
                isEdit: false,
                rules: {
                    description: [
                        {required: true, message: "请输入评议描述!", trigger: "blur"}
                    ],
                    content: [
                        {type: "string", message: "请输入内容！", trigger: "blur"}
                    ],
                },
                editorOption: {
                    modules: {
                        // ImageExtend: {
                        //     loading: true,
                        //     name: "file",
                        //     size: 2,
                        //     action: "https://upload-z1.qiniup.com",
                        //     headers: xhr => {},
                        //     change: (xhr, formData) => {
                        //         const headers = { "Content-Type": "multipart/form-data" };
                        //         xhr.setRequestHeader("headers", headers);
                        //         formData.append("token", this.token);
                        //     },
                        //     response: res => {
                        //         return res.url;
                        //     }
                        // },
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],
                            ['blockquote', 'code-block'],
                            [{ 'header': 1 }, { 'header': 2 }],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            [{ 'script': 'sub' }, { 'script': 'super' }],
                            [{ 'indent': '-1' }, { 'indent': '+1' }],
                            [{ 'direction': 'rtl' }],
                            [{ 'size': ['small', false, 'large', 'huge'] }],
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'font': [] }],
                            [{ 'align': [] }],
                            ['clean'],
                            ['link', 'image', 'video']
                        ],
                        // handlers: {
                        //     image: function() {
                        //         QuillWatch.emit(this.quill.id);
                        //     }
                        // }
                    }
                }
            }
        },
        methods: {
            /*处理富文本的变化*/
            // handleChange({ quill, html, text }) {
            //     // console.log(html);
            //     // console.log(quill);
            //     // console.log(text);
            //     this.formData.contentText = text;
            //     console.log(this.formData.contentText);
            //     console.log(this.formData.content);
            // },

            /* 获取编辑的数据 */
            getData() {
                this.loading = true;
                this.$axios.get(`comments/getTheComments/${this.userId}`)
                    .then(res => {
                        // console.log(res);
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

            /* 1. 添加 */
            addForm(form) {
                this.$refs[form].validate(valid => {
                    if(valid) {
                        this.$axios.post(`comments/addComments`, this.formData)
                            .then(res => {
                                if(res.code === 200) {
                                    this.$message({
                                        message: res.msg,
                                        type: "success",
                                        duration: 1000,
                                        center: true
                                    });
                                    setTimeout(() => {this.$router.push("/layout/commentsList")}, 500);
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

            /* 2. 编辑 */
            editForm(form) {
                this.$refs[form].validate(valid => {
                    if(valid) {
                        this.$axios.post(`comments/editComments`, this.formData)
                            .then(res => {
                                // console.log(res);
                                if(res.code === 200) {
                                    this.$message({
                                        message: res.msg,
                                        type: "success",
                                        duration: 1000,
                                        center: true
                                    });
                                    setTimeout(() => {this.$router.push("/layout/commentsList")}, 500);
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

            /* 3. 重置 */
            resetForm(form) {
                this.$refs[form].resetFields();
            },

            /* 4. 取消 */
            cancelForm(form) {
                this.$message({
                    message: "取消修改!",
                    type: "info",
                    duration: 1000,
                    center: true
                });
                setTimeout(() => this.$router.push("/layout/commentsList"), 1000);
            }
        },
        computed: {
            ...mapState(["userId"])
        },
        created() {
            if(this.$route.name === "addComments") {
                this.loading = false;
                this.isEdit = false;
            } else {
                this.isEdit = true;
                this.getData();
            }
        }
    }
</script>

<style scoped lang="scss">
    .addComments{
        height: 100%;
        overflow: hidden;
        width: 100%;
        .description{
            width: 100%;
            .input{
                width: 100%;
            }
        }
        .ql-editor {
            width: 100%;
            height: 500px;
            overflow: hidden;
            position: relative;
            left: -15px;
            top: -25px;
        }
    }
</style>
