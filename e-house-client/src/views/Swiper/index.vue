<template>
  <div class="swiper-wrap" v-loading="loading">
      <el-table :data="tableData"   :row-style="rowClass" class="table" @selection-change="handleSelectionChange"
                :header-cell-style="{background:'#eef1f6',color:'#606266'}">
        <el-table-column type="selection" style="color: #000;"  width="60"></el-table-column>
        <el-table-column type="index"  width="60"></el-table-column>
        <el-table-column prop="pic" width='200' label="缩略图" align='left'>
          <template slot-scope="scope">
            <img class="table-item-img" :src="scope.row.pic" alt="">
          </template>
        </el-table-column>
        <el-table-column sortable prop="sort" width='200' label="顺序" align='left'></el-table-column>
        <el-table-column sortable prop="status" width='200' label="状态" align='left'></el-table-column>
        <el-table-column prop="title" width='300' label="标题" align='left' show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width='250' align='left'>
          <template slot-scope="scope">
            <el-button type="primary" size='mini' @click="editClick(scope.row._id)">编辑</el-button>
            <el-button type="danger" size='mini' @click="delClick(scope.row._id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
          <el-button type="primary" size="mini" class="add" @click="addClick">添加</el-button>
          <el-button :type="orVal" :disabled="!isVal" size="mini" class="removeAll" @click="removeSelect">批量删除</el-button>
          <el-pagination class="flr pagination" background   small layout="prev, pager, next" @current-change='handleCurrentChange'
                         :page-size="size" :total="total">
          </el-pagination>
      </div>
  </div>
</template>

<script>
// import  { Scrollbar } from 'element-ui';
import getDate from "../../unitls/date";
import format from "date-fns/format";
export default {
    name: "swiper",
    data() {
        return {
            tableData: [],
            page: 1,
            size: 4,
            total: null,
            loading: true,
            multipleSelection: [],  // 存放当前选中的所有元素
            selectRow: [],  // 当前选中的所有行的索引
            isVal: false // 选中是否多于两行
        }
    },
    methods: {
        // 1. 获取渲染数据
        getData() {
            this.loading = true;
            this.$axios.get(`/swiper/getSwiper?pn=${this.page}&size=${this.size}`)
                .then(res => {
                    // console.log(res);
                    if(res.code === 200) {
                        res.data.forEach(item => {
                            item.create_time = format(new Date(item.create_time), "yyyy-MM-dd HH:mm:ss");
                            // console.log(item.create_time);
                            return item;
                        });
                        this.tableData = res.data;
                        this.total = res.count;
                        this.loading = false;
                    } else {
                        this.$message({
                            message: res.msg,
                            type: "error",
                            duration: 1000,
                            center: true
                        });
                        this.loading = false;
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

        // 2. 删除轮播图
        delClick(id) {
            this.$confirm("此操作将永久删除轮播图！！！, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$axios.get(`/swiper/deleteSwiper?id=${id}`).then(res => {
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

        // 3. 编辑轮播图
        editClick(id) {
            this.$store.commit("KEEP_USERID", id);
            this.$router.push({name: "editSwiper"})
        },

        // 4. 添加轮播图
        addClick() {
            this.$router.push({name: "addSwiper"});
        },
        // 5. 批量删除
        removeSelect() {
            // console.log(this.multipleSelection);
            const multipleSelection = this.multipleSelection;
            let idArr = [];
             multipleSelection.forEach(item => {
                 // console.log(item._id);
                 idArr.push(item._id);
             });
             this.$confirm("此操作将永久删除轮播图！！！, 是否继续?", "提示", {
                 confirmButtonText: "确定",
                 cancelButtonText: "取消",
                 type: "warning"
             })
                 .then(() => {
                     console.log(idArr);
                     this.$axios.get(`/swiper/deleteAllSelected/${idArr}`).then(res => {
                         if(res.code === 200) {
                             this.$message({
                                 type: "success",
                                 message: res.msg,
                                 center: true
                             });
                             setTimeout(() => {
                                 this.tableData = []; // 清空
                                 this.multipleSelection = [];
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
        handleCurrentChange(val) { // 分页处理当前页
            this.page = val;
            this.getData();  // 重新获取数据，相当于刷新
            // console.log(this.selectRow);
        },
        handleSelectionChange(val) { // val是一个数组，里面存放所有你选中的行元素
            this.isVal = val.length >= 2;
            this.multipleSelection = val;
        },
        rowClass({row, rowIndex}) {
            if(this.selectRow.includes(rowIndex)) {
                return {"background-color": "rgba(185, 221, 249, 0.75)"};
            }
        }
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
            }
        }
    },
    computed: {
        orVal() {
            return this.isVal ? "danger" : null;
        }
    }
}
</script>

<style scoped lang='scss'>
.swiper-wrap {
    width: 100%;
    .table {
        width: 100%;
        .table-item-img {
            width: 100px;
        }
    }
  .footer {
    height: 40px;
    background: #eef1f6;
    width: 100%;
    .add {
        margin: 5px 10px;
    }
  }
}
.pagination {
  margin: 10px 40px;
}
/deep/ .el-table td {
  padding: 9px 0;
}
/deep/ .el-table {
  overflow-x: hidden;
}
.loading {
  height: 50px;
}
</style>
