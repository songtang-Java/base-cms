<template>
    <div class="news-wrap">
        <el-card>
            <el-form :model="formData" ref='form' :rules="rules" size='mini' label-width="100px" label-position="left">
                <el-form-item label='新闻标题：' prop='title'>
                    <el-input v-model="formData.title"></el-input>
                </el-form-item>
                <el-form-item label='新闻作者：' prop='author'>
                    <el-input  v-model="formData.author"></el-input>
                </el-form-item>
                <el-form-item label='新闻描述：' prop='newsDesc'>
                    <el-input type="textarea"  :rows="2"   placeholder="请输入内容"   v-model="formData.newsDesc">
                    </el-input>
                </el-form-item>
                <el-form-item label='新闻类型：' prop='author'>
                    <el-select v-model="formData.newsType">
                        <el-option v-for="(item, index) in categories" :key="index" :label="item"
                                   :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label='新闻图片：' prop = 'img'>
                    <uploadImg class="uploadImg" v-model="formData.img"></uploadImg> <!--注意自定义组件中的v-model-->
                </el-form-item>
                <el-form-item label='新闻内容：' prop='contentText' class="contentText">
                    <el-col :span="24">
                        <quill-editor
                                v-model="formData.contentText"
                                class="ql-editor"
                                ref="myQuillEditor"
                                :options="editorOption"
                                @change="handleChange">
                        </quill-editor>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button v-if="!isEdit" type="primary" @click="submitForm('form')">发布</el-button>
                    <el-button v-else type="primary" @click="editForm('form')">修改</el-button>
                    <el-button v-if="!isEdit" @click="resetForm('form')">重置</el-button>
                    <el-button v-else @click="cancelForm">取消</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import UploadImg from "../../components/UploadImg";
    import {mapState} from "vuex";
    export default {
        name: "addNews",
        data() {
            return {
                loading: true, // 是否加载
                isEdit:false, // 是否是编辑转台
                formData: {
                    title: "",
                    newsDesc: "",
                    contentText: "",
                    img: "",
                    author: "",
                    newsType: ""
                },
                rules: {
                    title:[{ required: true, message: '请输入新闻标题！', trigger: 'blur'}],
                    author:[{ required: true, message: '请选择新闻作者！', trigger: 'blur'}],
                    newsDesc:[{ required: true, message: '请编写新闻描述！', trigger: 'blur'}],
                    img:[{ required: true, message: '请上传新闻头图！', trigger: 'blur'}],
                    newsType:[{ required: true, message: '请选择新闻类型！', trigger: 'blur'}],
                    contentText:[{ required: true, message: '请选输入新闻内容！', trigger: 'blur'}],
                },
                users: [], // 可供选择的作者的数组集合
                categories: [],  // 可供选择的新闻类型的集合
                editorOption: {
                    modules: {
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
                    }
                },
            }
        },
        computed: {
            ...mapState(["userId"]), // 切记userId是数据库中的_id，点谁就是谁的_id,不仅仅是用户的呢
        },
        components: {
            UploadImg
        },
        methods: {
            handleChange({ quill, html, text }) {
                // this.formData.content = text;
            },
            // 1. 获取所有的可能作者
            getUsers() {
                this.$axios.get(`/users/getUsers`).then(res => {
                    if(res.code === 200) {
                        res.data.forEach(item => {
                            this.users.push(item.username)
                        });
                    } else {
                        this.$message({
                            message: "获取用户列表失败！",
                            type: "error",
                            duration: 1000,
                            center: true
                        })
                    }
                }).catch(err => {
                    this.$message({
                        message: "捕捉信息失败！",
                        type: "error",
                        duration: 1000,
                        center: true
                    })
                })
            },

            // 2. 获取所有的可能新闻类型
            getCategories() {
                this.$axios.get(`/categories/getCategories`).then(res => {
                    if(res.code === 200) {
                        res.data.forEach(item => {
                            this.categories.push(item.newsType)
                        });
                    } else {
                        this.$message({
                            message: "获取新闻类型列表失败！",
                            type: "error",
                            duration: 1000,
                            center: true
                        })
                    }
                }).catch(err => {
                    this.$message({
                        message: "捕捉信息失败！",
                        type: "error",
                        duration: 1000,
                        center: true
                    })
                })
            },

            // 3. 添加业务处理
            submitForm(form) {
                this.$refs[form].validate(valid => {
                    if(valid) {
                        this.$axios.post(`/news/addNews`, this.formData).then(res => {
                            if(res.code === 200) {
                                this.$message({
                                    message: res.msg,
                                    type: "success",
                                    duration: 1000,
                                    center: true
                                });
                                setTimeout(() => {this.$router.push("/layout/news")}, 500);
                            } else {
                                this.$message({
                                    message: res.msg,
                                    type: "error",
                                    duration: 1000,
                                    center: true
                                });
                            }
                        }).catch(err => {
                            this.$message({
                                message: "网络链接错误!" + err,
                                type: "error",
                                duration: 1000,
                                center: true
                            });
                        })
                    }
                })
            },

            // 4. 修改业务逻辑
            editForm(form) {

            },

            // 5.重置业务逻辑
            resetForm(form) {
                this.$refs[form].resetFields();
            },

            // 6.取消
            cancelForm() {
                this.$message({
                    message: "取消修改!",
                    type: "info",
                    duration: 1000,
                    center: true
                });
                setTimeout(() => this.$router.push("/layout/news"), 1000);
            },

            // 7. 获取某一个新闻的全部信息
            getTheNews() {
                this.loading = true;
                this.$axios.get(`/news/getTheNews/${this.userId}`).then(res => {
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
                }).catch(err => {
                    this.loading = false;
                    this.$message({
                        message: "网络链接错误!" + err,
                        type: "error",
                        duration: 1000,
                        center: true
                    });
                })
            }
        },
        created() {
            // this.getUsers();
            this.getCategories();
            if(this.$route.name === "addNews") {
                this.loading = false;
                this.isEdit = false;
            } else {
                this.isEdit = true;
                this.getTheNews();
            }
        }
    }
</script>

<style scoped lang="scss">
    .ql-editor {
        width: 100%;
        height: 500px;
        overflow: hidden;
        position: relative;
        left: -15px;
        top: -25px;
    }
    .el-input{
        /*width: 900px;*/
    }
</style>
