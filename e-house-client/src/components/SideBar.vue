<template>
    <div class="sider-bar">
        <!-- :collapse='isCollapse' -->
        <el-menu
            class="el-menu-vertical-demo"
            :router="true"
            unique-opened
            :default-active='activeIndex'
            @open="handleOpen"
            @close="handleClose"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-menu-item index="/layout/home">
                <template slot="title">
                    <i class="iconfont icon-yemian-copy"></i>
                    <span>首页</span>
                </template>
            </el-menu-item>
            <el-submenu index="2">
                <template slot="title">
                    <i class="iconfont icon-yonghuguanli2"></i>
                    <span slot="title">用户管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/layout/admin">用户列表</el-menu-item>
                    <el-menu-item index="/layout/addAdmine">添加用户</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
                <template slot="title">
                    <i class="iconfont icon-hudong"></i>
                    <span slot="title">党员互动</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/layout/postList">帖子列表</el-menu-item>
                    <el-menu-item index="/layout/addPostList">增加帖子</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="4">
                <template slot="title">
                    <i class="iconfont icon-xiangji"></i>
                    <span slot="title">轮播图管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/layout/swiper">轮播图列表</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="5">
                <template slot="title">
                    <i class="iconfont icon-comment-copy"></i>
                    <span slot="title">民主评议</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/layout/addComments">发起评议</el-menu-item>
                    <el-menu-item index="/layout/commentsList">评议列表</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="6">
                <template slot="title">
                    <i class="iconfont icon-xinwenguanli"></i>
                    <span slot="title">新闻管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/layout/news">新闻列表</el-menu-item>
                    <el-menu-item index="/layout/addNews">添加新闻</el-menu-item>
                </el-menu-item-group>
            </el-submenu>

        </el-menu>
    </div>
</template>

<script>
export default {
  name: "sidebar",
  data(){
      return{
        //   isCollapse: true
        activeIndex: ""
      }
   },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    }
  },
  watch:{
      $route(to,from){
          // console.log("to");
          // console.log(to);
          // console.log("from");
          // console.log(from);
          this.activeIndex = to.path
      }
  }
};
</script>

<style scoped lang='scss'>
.sider-bar{
  min-height: 100vh;
  background-color: #545c64;
  .el-menu-vertical-demo{
    border-right: 1px solid #545c64;
    overflow: hidden;
  }
  .iconfont {
      font-size: 20px;
      margin-right: 5px;
  }
}
</style>
