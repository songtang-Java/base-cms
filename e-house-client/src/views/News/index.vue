<template>
    <div class="news-wrap">
        <el-card>
            <el-table :data="tableData" :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                      :row-style="rowClass" class="table" @selection-change="handleSelectionChange">
                <el-table-column type="selection" style="color: #000;"  width="60"></el-table-column>
                <el-table-column  type="index" width='100' label="ID" align='left'></el-table-column>
                <el-table-column  prop="title" width='360' label="标题" align='left'></el-table-column>
                <el-table-column  prop="create_time" width='300' label="发布时间" align='left'></el-table-column>
                <el-table-column  prop="newsType" width='200' label="新闻类型" align='left'></el-table-column>
              <el-table-column label="操作" width='250' align='left'>
                <template slot-scope="scope">
                  <el-button type="primary" size='mini' @click="editClick(scope.row._id)">编辑</el-button>
                  <el-button type="danger" size='mini' @click="delClick(scope.row._id)">删除</el-button>
                  <el-button type="primary" size='mini' @click="produceClick(scope.row._id)">生成轮播图</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="footer">
                <el-pagination class="flr pagination" background   small layout="prev, pager, next" @current-change='handleCurrentChange'
                               :page-size="size" :total="total">
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script>
    import format from "date-fns/format"
    export default {
         name: "index",
         data() {
               return {
                   tableData: [],
                   total: null,
                   pn: 1,
                   size: 4,
                   loading: false,
                   multipleSelection: [],  // 存放当前选中的所有元素
                   selectRow: [],  // 当前选中的所有行的索引
               };
         },
         methods: {
             /* 1. 获取数据*/
             getData() {
                 this.loading = true;
                 this.$axios.get(`news/getNews/${this.pn}/${this.size}`)
                     .then(res => {
                         if(res.code === 200) {
                             res.data.forEach(item => {
                                 item.create_time = format(new Date(item.create_time), "yyyy-MM-dd HH:mm:ss");
                                 return item;
                             });
                             this.tableData = res.data;
                             this.loading = false;
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
                         this.$message({
                             message: "网络链接错误!",
                             type: "error",
                             duration: 1000,
                             center: true
                         });
                         this.loading = false;
                     })
             },
             /* 2. 选中处理，拿到选中的元素*/
             handleSelectionChange(val) { // val是一个数组，里面存放所有你选中的行元素
                 this.multipleSelection = val;
             },
             /* 3. 改变选中元素的背景样式*/
             rowClass({row, rowIndex}) {
                 if(this.selectRow.includes(rowIndex)) {
                     return {"background-color": "rgba(185, 221, 249, 0.75)"};
                 }
             },
             /* 4. 编辑*/
             editClick(id) {
                 this.$store.commit("KEEP_USERID", id);
                 this.$router.push({name: "editNews"});
             },
             /* 5. 删除*/
             delClick(id) {
                 this.$confirm("此操作将永久删除该新闻！！！, 是否继续?", "提示", {
                     confirmButtonText: "确定",
                     cancelButtonText: "取消",
                     type: "warning"
                 })
                     .then(() => {
                         this.$axios.get(`/news/deleteNews/${id}`).then(res => {
                             if(res.code === 200) {
                                 this.$message({
                                     type: "success",
                                     message: res.msg,
                                     center: true
                                 });
                                 setTimeout(() => {
                                     this.tableData = []; // 清空
                                     this.getData(); // 刷新
                                 }, 1000)
                             } else {
                                 this.$message({
                                     type: "error",
                                     message: "error:" + res.msg,
                                     center: true
                                 });
                             }
                         })
                     })
                     .catch(() => {
                         this.$message({
                             type: "info",
                             message: "已取消删除"
                         });
                     })
             },
             /* 6. 生成轮播图*/
             produceClick(id) {

             },
             /* 7.分页处理当前页*/
             handleCurrentChange(val) {
                 this.page = val;
                 this.getData();  // 重新获取数据，相当于刷新
                 // console.log(this.selectRow);
             },
         },
         created() {
             this.getData();
         },
         watch: {
             multipleSelection(data) {
                 // this.selectRow = [];
                 if(data.length > 0) {
                     data.forEach((item, index) => {
                         this.selectRow.push(this.tableData.indexOf(item));
                     })
                 }  else { // 如果没有选中那么就不把索引加入高亮数组中
                     this.selectRow = [];
                 }
             }
         },
    }
</script>

<style scoped lang="scss">
    .footer {
        height: 40px;
        background: #eef1f6;
        width: 100%;
        .pagination {
            margin: 10px 70px;
        }
    }

</style>
