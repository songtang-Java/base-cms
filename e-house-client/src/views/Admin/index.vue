<template>
  <div class="admin-wrap" v-loading="loading">
      <el-table :data="userInfo" highlight-current-row :header-cell-style="{background:'#eef1f6',color:'#606266'}">
        <!-- <el-table-column prop="username" label="姓名"></el-table-column> -->
        <el-table-column type="selection" style="color: #000;"  width="55"></el-table-column>
        <el-table-column type="index"  width="50"></el-table-column>
        <el-table-column prop="avatar" width='150' label="头像" align='left'>
          <template slot-scope="scope">
            <img class="table-item-img" :src="scope.row.avatar" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="username" width='150' label="用户名" align='left' show-overflow-tooltip></el-table-column>
        <el-table-column prop="userId" width='200' label="证件" align='left' show-overflow-tooltip></el-table-column>
<!--        <el-table-column prop="create_time" width='180' label="创建时间" align='center'></el-table-column>-->
        <el-table-column prop="phone" width='200' label="电话" align='left' show-overflow-tooltip></el-table-column>
<!--        <el-table-column prop="sex" width='80' label="性别" align='center'>-->
<!--          <template slot-scope="scope">-->
<!--            <div>{{scope.row.sex == 1 ? '男': '女' }}</div>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column prop="jfs" label="积分" width="100"></el-table-column>
        <el-table-column label="操作" width='300' align='center'>
          <template slot-scope="scope">
            <el-button type="primary" size='mini' @click="editclick(scope.row._id)">编辑</el-button>
            <el-button type="danger" size='mini' @click="delclick(scope.row._id)">删除</el-button>
            <el-button type="warning" size='mini' @click="resetPassword(scope.row._id)">密码重置</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination" background small layout="prev, pager, next" @current-change='handleCurrentChange'
                     :page-size="size" :total="total">
        <!-- :pager-count="11"  最多显示页码数
              size-change pageSize 改变时会触发    回调参数:每页条数
              prev-click  用户点击上一页按钮改变当前页后触发    回调参数:当前页
              next-click-->
              <!-- flr  右边-->
      </el-pagination>
  </div>
</template>

<script>
export default {
  name: "admin",
  data() {
    return {
      userInfo: [],
      loading: true,
      total: null,
      page: 1,
      size: 5
    };
  },
  methods: {
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page = val;
      this.getData();
    },
    delclick(id) {
      // 通过验证密码删除
      this.$prompt("请输入用户密码", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
        // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        // inputErrorMessage: '邮箱格式不正确'
      })
        .then(({ value }) => {
          this.$axios.get(`/users/deleteUser?id=${id}&password=${value}`)
            .then(res => {
              // console.log(res);
              if (res.code === 200) {
                this.$message({
                  type: "success",
                  message: res.msg,
                  center: true
                });
                setTimeout(() => { this.getData(); }, 1000);
              } else {
                this.$message({
                  type: "error",
                  message: "error:" + res.msg,
                  center: true
                });
              }
            });
        })
        .catch(error => {
          this.$message({
            type: "info",
            message: "取消删除！！！" + error,
            duration: 1000
          });
        });
      // 直接确认是否删除
      // this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   this.$message({
      //     type: 'success',
      //     message: '删除成功!'
      //   });
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消删除'
      //   });
      // });
    },
    editclick(e) {
      // console.log(e);
      this.$store.commit("KEEP_USERID", e);
      this.$router.push({ name: "editAdmine"});
    },
    resetPassword(id) {
      // console.log(id);
      this.$store.commit("KEEP_USERID", id);
      this.$router.push({name: "resetPassword"});
    },
    getData() {
      this.loading = true;
      this.$axios.get(`/users/getUsers?pn=${this.page}&size=${this.size}`)
        .then(res => {
          // console.log(res);
          if (res.code === 200) {
            res.data.forEach(item => {
              // 正则过滤时间
              item.create_time = item.create_time.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})Z/,"$1年$2月$3日$4点$5分");
              return item;
            });
            this.loading = false;
            this.userInfo = res.data;
            this.total = res.count;
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
            message: "网络链接错误！",
            type: "error",
            duration: 1000,
            center: true
          });
        });
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style scoped lang='scss'>
/deep/ .el-card {
  overflow: hidden;
}
.pagination {
  margin: 15px 40px;
}
/deep/ .el-table td {
  padding: 8px 0;
}
</style>
