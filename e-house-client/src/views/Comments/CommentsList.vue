<template>
    <div class="comments-wrap">
        <el-table :data="tableData" class="table"  :header-cell-style="{background:'#eef1f6',color:'#606266'}">
            <el-table-column type="index"  width="60"></el-table-column>
            <el-table-column  prop="description" width='400' label="描述" align='left'></el-table-column>
            <el-table-column  prop="status" width='300' label="状态" align='left'>
                <template slot-scope="scope">
                    <span v-if="scope.row.status === '未开启'" class="not-open span">未开启</span>
                    <span v-else-if="scope.row.status === '进行中'" class="process span">进行中</span>
                    <span v-else="scope.row.status === '已结束'" class="been-over span">已结束</span>
                </template>
            </el-table-column>
            <el-table-column  prop="create_time" width='300' label="时间" align='left'></el-table-column>
            <el-table-column label="操作" width='200' align='left' prop="status" >
                <template slot-scope="scope">
                    <el-button type="primary"  size='mini' click="editClick(scope.row._id)" v-if="scope.row.status!=='已结束'">
                        修改</el-button>
                    <el-button type="success" v-if="scope.row.status!=='已结束' && scope.row.status === '未开启'" size='mini'
                               @click="openClick(scope.row._id)">开启</el-button>
                    <el-button type="danger" v-if="scope.row.status!=='已结束' && scope.row.status === '进行中'" size='mini'
                               @click="overClick(scope.row._id)">结束</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="footer">
            <el-pagination class="flr pagination" background   small layout="prev, pager, next" @current-change='handleCurrentChange'
                           :page-size="size" :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import format from "date-fns/format";
    export default {
        name: "CommentsList",
        data() {
            return {
                tableData: [],
                page: 1,
                size: 10,
                total: null,
                loading: true,
                isOpen: false,
                state: ""
            }
        },
        methods: {
            /* 1. 获取渲染数据*/
            getData() {
                this.loading = true;
                this.$axios.get(`comments/getComments/${this.page}/${this.size}`)
                    .then(res => {
                        if(res.code === 200) {
                            res.data.forEach(item => {
                                item.create_time = format(new Date(item.create_time), "yyyy-MM-dd HH:mm:ss");
                                if(item.status === 0) {
                                    item.status = "未开启";
                                }else if(item.status === 1) {
                                    item.status = "进行中";
                                }else if(item.status === -1) {
                                    item.status = "已结束";
                                }
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
                            message: "网络链接错误!" + err,
                            type: "error",
                            duration: 1000,
                            center: true
                        });
                        this.loading = false;
                    })
            },
            editClick(id) {
                this.$store.commit("KEEP_USERID", id);
                this.$router.push({name: "editComments"});
            },
            handleCurrentChange(val) { // 分页处理当前页
                this.page = val;
                this.getData();  // 重新获取数据，相当于刷新
            },
            // 4. 开启
            openClick(id) {
                this.$axios.post(`/comments/updateStatus/${id}/1`).then(res => {
                    if(res.code === 200) {
                        this.getData();
                    } else {
                        this.$message({
                            message: res.msg,
                            type: "error",
                            duration: 1000,
                            center: true
                        })
                    }
                }).catch(err => {
                    this.$message({
                        message: "捕捉数据失败！",
                        type: "error",
                        duration: 1000,
                        center: true
                    })
                })
            },
            // 5. 结束
            overClick(id) {
                this.$axios.post(`/comments/updateStatus/${id}/-1`).then(res => {
                    if(res.code === 200) {
                        this.getData();
                    } else {
                        this.$message({
                            message: res.msg,
                            type: "error",
                            duration: 1000,
                            center: true
                        })
                    }
                }).catch(err => {
                    this.$message({
                        message: "捕捉数据失败！",
                        type: "error",
                        duration: 1000,
                        center: true
                    })
                })
            }
        },
        created() {
            this.getData();
        },
    }
</script>

<style scoped lang='scss'>
    .not-open{
        border: 1px solid #e4e8f1;
        background: #e4e8f1;
        border-radius: 10px;
        color: #48576a;
    }
    .process{
        border: 1px solid #b8eed0;
        background: #b8eed0;
        border-radius: 10px;
        color: #13ce66;
    }
    .been-over{
        border: 1px solid #ffcbcb;
        background: #ffcbcb;
        border-radius: 10px;
        color: #ff4949;
    }
    .span{
        padding: 5px;
    }
    .footer {
        height: 40px;
        background: #eef1f6;
        width: 100%;
        .pagination {
            margin: 8px 40px;
        }
    }
</style>
