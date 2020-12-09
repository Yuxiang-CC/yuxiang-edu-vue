<template>
  <div class="app-container">
      <!-- 查询表单 -->
    <el-form :inline="true" class="demo-form-inline">
      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select
          v-model="searchObj.subjectParentId"
          placeholder="请选择"
          @change="subjectLevelOneChanged">
          <el-option
            v-for="subject in subjectList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>

        <!-- 二级分类 -->
        <el-select v-model="searchObj.subjectId" placeholder="请选择">
          <el-option
            v-for="subject in subjectLevelTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
      </el-form-item>

      <!-- 标题 -->
      <el-form-item>
        <el-input v-model="searchObj.title" placeholder="课程标题"/>
      </el-form-item>

      <!-- 讲师 -->
      <el-form-item>
        <el-select
          v-model="searchObj.teacherId"
          placeholder="请选择讲师">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 工具条 -->
    <!-- <div>
      <el-button type="danger" size="mini" @click="batchRemove()">批量删除</el-button>
    </div> -->
    <br>

      <!-- 数据列表 -->
    <el-table :data="courseList" border stripe >

      <el-table-column label="#" width="50">
        <template slot-scope="scope">
          {{ (page - 1) * size + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="封面" width="200" align="center">
        <template slot-scope="scope">
          <el-image 
            :src="scope.row.cover"
            :preview-src-list="[scope.row.cover]"
            alt="scope.row.title" 
            width="100%">
          </el-image>
        </template>
      </el-table-column>

      <el-table-column label="课程信息">
        <template slot-scope="scope">
          <a href="">{{ scope.row.title }}</a>
          <p>
            分类：{{ scope.row.subjectParentTitle }} > {{ scope.row.subjectTitle }}
          </p>
          <p>
            课时：{{ scope.row.lessonNum }} /
            浏览：{{ scope.row.viewCount }} /
            付费学员：{{ scope.row.buyCount }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="讲师" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.teacherName }}
        </template>
      </el-table-column>
      <el-table-column label="价格(元)" width="100" align="center" >
        <template slot-scope="scope">
          <!-- {{ typeof '0' }}  {{ typeof 0 }} {{ '0' == 0 }} -->
          <!-- {{ typeof scope.row.price }}
          {{ typeof Number(scope.row.price) }}
          {{ typeof Number(scope.row.price).toFixed(2) }} -->

          <el-tag v-if="Number(scope.row.price) === 0" type="success">免费</el-tag>

          <!-- 前端解决保留两位小数的问题 -->
          <!-- <el-tag v-else>{{ Number(scope.row.price).toFixed(2) }}</el-tag> -->

          <!-- 后端解决保留两位小数的问题，前端不用处理 -->
          <el-tag v-else>{{ scope.row.price }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="课程状态" width="100" align="center" >
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 'Draft' ? 'warning' : 'success'">{{ scope.row.status === 'Draft' ? '未发布' : '已发布' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.gmtCreate.substr(0, 10) }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="300" align="center">
        <template slot-scope="scope">
          <router-link :to="'/course/info/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <router-link :to="'/course/chapter/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改大纲</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

      <!-- 分页 -->
      <el-pagination
        background 
        :current-page="page" 
        :page-size="size"
        :total="total"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :page-sizes="[5, 10, 15, 30, 50]"
        style="padding: 30px 0px; text-align:center"
        @current-change="changeCurrentPage"
        @size-change="changePageSize"/>

  </div>
</template>

<script>
import courseApi from '@/api/course'
import teacherApi from '@/api/teacher'
import subjectApi from '@/api/subject'

export default {
  data() {
    return {
      courseList: [], //课程列表
      total: 0, // 总记录数
      page: 1, // 当前页面
      size: 5, // 页面大小
      searchObj: { // 查询条件对象
        title: '',
        teacherId: '',
        subjectId: '',
        subjectParentId: '',
      }, 
      teacherList: [], // 讲师列表
      subjectList: [], // 课程分类一级列表
      subjectLevelTwoList: [] // 课程分类二级列表
    }
  },
  created() {
    //
    this.fetchData()
    this.initTeacherList()
    this.initSubjectList()

  },
  methods: {
    // 获取课程信息
    fetchData() {
      courseApi.getListPage(this.page, this.size, this.searchObj).then(response => {
        this.courseList = response.data.items
        this.total = response.data.total
      }).catch(err => {
        this.$notify({
          title: '错误',
          message: '请检查网络连接',
          type: 'error'
        }); 
      })
    },
    // 当前页改变时会触发
    changeCurrentPage(page) {
        this.page = page
        this.fetchData()
    },
    // 每页条数改变时会触发
    changePageSize(size) {
        this.size = size
        this.fetchData()
    },
    // 初始化讲师
    initTeacherList() {
      teacherApi.getList().then(response => {
        this.teacherList = response.data.items
      })
    },
    // 初始化课程类别
    initSubjectList() {
      subjectApi.getNestedTreeList().then(response => {
        this.subjectList = response.data.items
      })
    },
    // 课程二级分类展示
    subjectLevelOneChanged(value) {
      console.log(value)
      this.subjectList.forEach(subject => {
        if (subject.id === value) {
          // 清空二级分类列表内容
          this.searchObj.subjectId = ''
          this.subjectLevelTwoList = subject.children
        }
      })
    },
    // 清空搜索条件对象信息
    resetData() {
      this.searchObj.title = ''
      this.searchObj.teacherId = ''
      this.searchObj.subjectId = ''
      this.searchObj.subjectParentId = ''
      this.subjectLevelTwoList = []
      this.fetchData()
    },
    removeById(id) {
      // 是否删除
      this.$confirm('即将删除该条记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return courseApi.removeCourseById(id)
        }).then(response => {
            // 给出提示
            this.$notify({
              title: '成功',
              message: `删除成功`,
              type: 'success'
            });
            // 刷新页面
            this.fetchData()
        }).catch((response) => {
          if (response === 'cancel') {
            this.$notify({
              title: '提示',
              message: `已取消删除`,
              type: 'info'
            }); 
          }
        });
    }

  },


}
</script>

<style>

</style>