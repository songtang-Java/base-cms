<template>
    <div class="post-list-wrap">
        <el-card v-loading="loading">
            <div slot="header" class="header-card">帖子列表</div>
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        type="index"
                        width="50">
                </el-table-column>
                <el-table-column
                        label="用户名"
                        width="180">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.name }}</el-tag>
                        </div>
                        <el-popover trigger="hover" placement="top">
<!--                            <p>姓名: {{ scope.row.name }}</p>-->
<!--                            <p>住址: {{ scope.row.address }}</p>-->

                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="内容" width="180" prop="content"></el-table-column>
                <el-table-column label="跟帖" width="180" prop="tipsCount"></el-table-column>
                <el-table-column
                        label="时间"
                        width="180">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{ scope.row.date }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="flr pagination" background small layout="prev, pager, next" @current-change='handleCurrentChange' :page-size="4" :total="total">
                <!-- :pager-count="11"  最多显示页码数
                      size-change pageSize 改变时会触发    回调参数:每页条数
                      prev-click  用户点击上一页按钮改变当前页后触发    回调参数:当前页
                      next-click-->
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "PostList",
        data() {
            return {
                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }]
            }
        },
        methods: {
            handleEdit(index, row) {
                console.log(index, row);
            },
            handleDelete(index, row) {
                console.log(index, row);
            }
        }
    }
</script>

<style scoped>

</style>
