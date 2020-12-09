<template>
  <div class="app-container">

    <!--查询表单-->
    <el-form :inline="true">
      <el-form-item>
        <!-- <el-input v-model="searchObject.name" clearable placeholder="讲师"/> -->
        <el-autocomplete
          class="inline-input"
          v-model="searchObject.name"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          :trigger-on-focus="false"
          value-key="name"
        ></el-autocomplete>
      </el-form-item>

      <el-form-item>
        <el-select v-model="searchObject.level" clearable placeholder="头衔">
          <el-option value="1" label="高级讲师"/>
          <el-option value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>

      <el-form-item label="入驻时间">
        <el-date-picker
          v-model="searchObject.joinDateBegin"
          placeholder="开始时间"
          value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item label="-">
        <el-date-picker
          v-model="searchObject.joinDateEnd"
          placeholder="结束时间"
          value-format="yyyy-MM-dd" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
      </el-form-item>
    </el-form>

    <!-- 工具条 -->
    <div>
      <el-button type="danger" size="mini" @click="batchRemove">批量删除</el-button>
    </div>
    <br>

    <!-- 讲师信息 -->
    <el-table :data="teacherList" border stripe style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column  type="selection" width="40"></el-table-column>
      <!-- <el-table-column type="index" width="50"></el-table-column> -->
      <el-table-column label="#" width="50">
          <template slot-scope="scope">
              {{ (page -1 ) * size + scope.$index + 1}}
          </template>
      </el-table-column>
      <el-table-column prop="level" label="级别" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level === 1">高级讲师</el-tag>
          <el-tag v-if="scope.row.level === 2" type="success">首席讲师</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="100">
      </el-table-column>
      <el-table-column label="头像" width="140">
        <template slot-scope="scope">
          <el-image 
            style="width: 100px; height: 100px"
            :src="scope.row.avatar"
            :preview-src-list="[scope.row.avatar]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="intro" label="简介" width="500"></el-table-column>
      <el-table-column prop="joinDate" label="入住时间" :formatter="dateFormatter"></el-table-column>
      <el-table-column label="操作">
      <template slot-scope="scope">
        <router-link :to="'/teacher/edit/' + scope.row.id" >
          <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
        </router-link>
        <el-button el-button type="danger" size="mini" icon="el-icon-delete"
          @click="removeById(scope.$index, scope.row.id)">删除</el-button>
      </template>
      </el-table-column>
    </el-table>

    
    <el-pagination
        background 
        :current-page="page" 
        :page-size="size"
        :total="total"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :page-sizes="[5, 10, 15, 30, 50]"
        style="padding: 30px 0px; text-align:center"
        @current-change="changeCurrentPage"
        @size-change="changePageSize"
    />
  </div>
</template>

<script>
import teacherApi from "@/api/teacher";
import {parseTime} from "@/utils/index";
export default {
  data() {
    return {
      teacherList: [], //讲师列表
      total: 0, // 总记录数
      page: 1, // 当前页面
      size: 5, // 页面大小
      searchObject: {
        name: '',
        level: '',
        joinDateBegin: '',
        joinDateEnd: '',
      }, // 查询表单
      idList: [], // 批量选中的数据列表
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 调用API，加载讲师列表
    fetchData() {
      teacherApi
        .pageList(this.page, this.size, this.searchObject)
        .then(response => {
          this.teacherList = response.data.rows;
          this.total = response.data.total;
        });
    },
    resetData() {
      this.searchObject.name = ''
      this.searchObject.level = ''
      this.searchObject.joinDateBegin = ''
      this.searchObject.joinDateEnd = ''
      this.fetchData()
    },
    removeById(index, id) {
      // 是否删除
      this.$confirm('即将删除该条记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return teacherApi.removeById(id)
        }).then(response => {
            // 给出提示
            this.$notify({
              title: '成功',
              message: `删除成功`,
              type: 'success'
            });
            // 刷新页面
            this.fetchData()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 批量删除
    batchRemove() {

      if (this.idList.length <= 0) {
        this.$message({
            type: 'error',
            message: '您未选中任何记录'
          }); 
        return
      }

      // 拿到多选数据
      this.$confirm('即将删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return teacherApi.batchRemove(this.idList)
        }).then(response => {
            // 给出提示
            this.$notify({
              title: '成功',
              message: `删除成功`,
              type: 'success'
            });
            // 刷新页面
            this.fetchData()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 将勾选信息的id值放入数组中
    handleSelectionChange(selection) {
      this.idList.push(selection[0].id)
    },
    // 当前页改变时会触发
    changeCurrentPage(page) {
        this.page = page
        this.fetchData()
    },
    // 每页条数
    changePageSize(size) {
        this.size = size
        this.fetchData()
    },
    // queryString 是输入框中输入的字符
    querySearch(queryString, cb) {
      teacherApi.getNameListByKey(queryString).then(response => {
        console.log(response.data.names)
        cb(response.data.names)
      })
    },
    // 格式化日期
    dateFormatter(row, column, cellValue, index) {
      return row.joinDate.substring(0,10)
    }
  }
};
</script>
    
<style>
</style>