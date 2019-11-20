<template>
  <div class="layout-wrap">
    <el-container class="contetn">
      <el-header class="el-header">
        <Header></Header>
      </el-header>
      <el-container class="right-content">
        <el-aside width="200px" class="sider-ber">
          <SideBar></SideBar>
        </el-aside>
        <el-scrollbar>
          <el-main class="app-main">
            <AppMain></AppMain>
          </el-main>
        </el-scrollbar>
        <!-- <el-footer class="footer">
          <FooterBot></FooterBot>
        </el-footer> -->
      </el-container>
    </el-container>
  </div>
</template>

<script>
import SideBar from "@/components/SideBar.vue";
import FooterBot from "@/components/FooterBot.vue";
import Header from "@/components/Header.vue";
import AppMain from "./AppMain.vue";

export default {
  name: "index",
  components: {
    SideBar,
    AppMain,
    FooterBot,
    Header
  }
};
</script>

<style scoped lang='scss'>
.el-header {
  width: 100%;
  background: #20a0ff;
}
.app-main{
    overflow: hidden;
    width: 1400px;
}
.layout-wrap {
  /*overflow: hidden;*/
  height: 100%;
}
.sider-ber,
.right-content {
  height: 100vh;
}
.header {
  border-bottom: 1px solid #ccc;
}
.footer {
  background-color: #ddd;
}
</style>
