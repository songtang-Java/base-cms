<template>
    <div class="header">
        <div class="logo">
            <img src="../../public/images/HanKing2.svg" alt="">
        </div>
            <el-dropdown size="medium" class="header-wrap">
                <el-button>
                    <img class="img-top" :src='userInfo.avatar' onerror='this.src="http://oowantxlb.bkt.clouddn.com/upload/front/4470566e228087f9f66ef039be58cbe9.png"'>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="editclick(userInfo._id)">修改个人信息</el-dropdown-item>
                    <el-dropdown-item @click.native="quit">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
    </div>
</template>

<script>
    import Cookie from 'cookie.js'
    import { mapState } from 'vuex'
    export default {
        name: "Header",
        methods: {
            quit(){
                this.$store.commit('DELETE_USERINFO')
                this.$axios.del('/admine/layout').then(res => {
                    if(res.code === 200 ){
                        this.$message({
                            type: "success",
                            message: res.msg,
                            center: true,
                        });
                        setTimeout(()=>{this.$router.push('/login')},1000);
                        Cookie.remove("mytoken");
                    }else{
                        this.$message({
                            type: "error",
                            message: res.msg,
                            center: true,
                        });
                    }
                }).catch((err) => {
                    this.$message({
                        type: "error",
                        message: 'err:'+ err,
                        center: true,
                    });
                })
            },
            editclick(id){
                this.$router.push({ name: "editAdmine", params: { id } });
            },
        },
        computed:{
            ...mapState(["userInfo"]),
        },
    }
</script>

<style scoped lang='scss'>
    .header {
        .logo {
            img {
                height: 60px;
            }
        }
        .header-wrap {
            position: relative;
            .img-top {
                width: 50px;
                height: 50px;
                border-radius: 50%;
            }
        }
        .el-dropdown {
            vertical-align: top;
            position: absolute;
            right: 20px;
            top: 5px;
        }
        .el-dropdown > button {
            width: 50px;
            height: 50px;
            border: none;
            margin: 0;
            padding: 0;
            border-radius: 50%;
        }
    }

</style>
