<template>
  <div class="app-container">
      <!-- TODO 课程表单信息 -->
      <!-- 课程信息表单 -->
    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder="注：专业名称注意大小写! 示例：机器学习项目课：从基础到搭建项目视频课程。"/>
      </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择讲师">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :value="teacher.id"
            :label="teacher.name" />
        </el-select>
      </el-form-item>

      <!-- 所属分类 -->
      <el-form-item label="课程分类">
         <!-- 一级分类  -->
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="请选择"
          @change="subjectChanged">
          <el-option
            v-for="subject in subjectList"
            :key="subject.id"
            :value="subject.id"
            :label="subject.title" />
        </el-select>

         <!-- 二级分类  -->
        <el-select
          v-model="courseInfo.subjectId"
          placeholder="请选择">
          <el-option
            v-for="subject in subjectLevelTwoList"
            :key="subject.id"
            :value="subject.id"
            :label="subject.title" />
        </el-select>

      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>

      <!-- 课程封面 -->
      <el-form-item label="课程封面">
        <!-- <el-upload
          :show-file-list="false"
          :on-success="handleCoverSuccess"
          :before-upload="beforeCoverUpload"
          :on-error="handleCoverError"
          class="cover-uploader"
          action="http://localhost:9640/api/oss/file/auth/upload?module=cover">
          <img v-if="courseInfo.cover" :src="courseInfo.cover">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload> -->
        <el-upload
          class="upload-demo"
          drag
          action="http://localhost:9640/api/oss/file/auth/upload?module=cover"
          :on-success="handleCoverSuccess"
          :before-upload="beforeCoverUpload"
          :on-error="handleCoverError"
          :limit="1"
          :multiple="false"
          >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png//gif文件，且不超过5Mb，最多上传一张</div>
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程设为0元"/> 元
      </el-form-item>
    </el-form>

      <div style="text-align: center;">
        <el-button :disabled="saveBtnDisable" type="primary" @click="saveAndNext" >保存并下一步</el-button>
      </div>
      
  </div>
</template>

<script>
import courseApi from '@/api/course'
import teacherApi from '@/api/teacher'
import subjectApi from '@/api/subject'
import { validUsername } from '@/utils/validate'
// 富文本编辑器
import tinymce from '@/components/Tinymce/index'

export default {
  components: {tinymce},
  data() {
    return {
      saveBtnDisable: false,
      courseInfo: { // 课程基本信息
        title: '',
        teacherId: '',
        subjectParentId: '',
        subjectId: '',
        lessonNum: 0,
        description: '',
        cover: '',
        price: 0,
      }, 
      teacherList: [], // 讲师列表
      subjectList: [], // 课程分类一级列表
      subjectLevelTwoList: [] // 课程分类二级列表
    }
  },
  created(){

    // Id来源于路由
    // if (this.$route.name === 'CourseInfoEdit') {
    //   this.$parent.courseId = this.$route.params.id
    // }

    // 课程信息回显判断  Id来源于父组件
    if (this.$parent.courseId != null) {
      this.fetchCourseInfoById(this.$parent.courseId)
    } else {
      // 此时为新增，只需要渲染一级类别
      this.initSubjectList()
    }
    // 渲染讲师列表
    this.initTeacherList()
  },
  methods: {

    // 根据Id获取课程信息
    fetchCourseInfoById(courseId) {
      courseApi.getCourseInfoById(courseId).then(response => {
        this.courseInfo = response.data.courseInfo

        // 课程类别渲染
        subjectApi.getNestedTreeList().then(response => {
          this.subjectList = response.data.items
          // 判断this.subjectLIst 下哪一级别是当前对象的级别
          this.subjectList.forEach(subject => {
            
            if (subject.id === this.courseInfo.subjectParentId) {
              console.log("SubjectId:" + subject.id)
              this.subjectLevelTwoList = subject.children
            }

          })
        })
      })
    },

    // 保存并下一步
    saveAndNext() {
      this.saveBtnDisable = true
      // 当父组件Id有值时，进行更新，否则就是新增
      if (this.$parent.courseId == null) {
        this.saveData()
      } else {
        this.updataData()
      }
    },
    saveData() {
      courseApi.saveSourceInfo(this.courseInfo).then(response => {
        this.$notify({
            title: '成功',
            message: response.message,
            type: 'success'
          });
        this.$parent.courseId = response.data.courseId // 获取courseId
        this.$parent.active = 1
      })
    },
    updataData() {
      courseApi.updateCourseInfoById(this.courseInfo).then(response => {
        this.$notify({
            title: '成功',
            message: response.message,
            type: 'success'
          });
        this.$parent.active = 1
      })
    },
    // 课程二级分类展示
    subjectChanged(value) {
      console.log(value)
      this.subjectList.forEach(subject => {
        if (subject.id === value) {
          // 清空二级分类列表内容
          this.courseInfo.subjectId = ''
          this.subjectLevelTwoList = subject.children
        }
      })
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
    // 文件上传成功后的回调函数
    handleCoverSuccess(response, file, fileList) {
      if (response.success) {
        console.log(response.data)
        this.courseInfo.cover = response.data.url
        this.$notify({
            title: '成功',
            message: response.message,
            type: 'success'
          });
      // 强制重新渲染
      this.$forceUpdate()
      } else {
        this.$notify({
            title: '失败',
            message: response.message,
            type: 'info'
          });
      }
    },
    // 文件上传失败
    handleCoverError(err) {
      this.$notify({
        title: '失败',
          message: '请检查网络连接',
          type: 'error'
        });    
    },
    // 文件上传前的校验
    beforeCoverUpload(file) {
      const isType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' // MIME
        const isLt4M = file.size / 1024 / 1024 < 5;
        if (!isLt4M) {
          this.$message.error('上传图片大小不能超过 5MB!');
        }
        if (!isType) {
          this.$message.error('上传图片文件类型错误!');
        }

        return isLt4M && isType;
    },
  }
}
</script>

<style>

</style>