<template>
  <div class="app-container">
    
    <!-- 课程预览 -->
    <div class="ccInfo">
      <img :src="coursePublishInfo.cover">
      <div class="main">
        <h2>{{ coursePublishInfo.title }}</h2>
        <p class="gray">共{{ coursePublishInfo.lessonNum }}课时</p>
        <p><span>所属分类: {{ coursePublishInfo.subjectParentTitle }} - {{ coursePublishInfo.subjectTitle }}</span></p>
        <p>课程讲师: {{ coursePublishInfo.teacherName }}</p>
        <h3 class="red">￥{{ coursePublishInfo.price }}</h3>
      </div>
    </div>

    <div style="text-align: center;">
      <el-button type="primary" @click="prev">上一步</el-button>
      <el-button :disabled="publishBtnDisabled" type="primary" @click="publish">发布课程</el-button>
    </div>
  </div>
</template>

<script>
import courseApi from '@/api/course'
export default {
  data() {
    return {
      publishBtnDisabled: false,
      coursePublishInfo: {},
    }
  },
  created() {
    if (this.$parent.courseId != null) {
      this.batchCoursePublishById(this.$parent.courseId)
    }
  },
  methods: {
    // 上一步
    prev() {
      this.$parent.active = 1
    },
    // 下一步，发布
    publish() {
      this.publishBtnDisabled = true
      courseApi.publishCourseById(this.$parent.courseId).then(response => {
        this.$notify({
            title: '成功',
            message: response.message,
            type: 'success'
          });
      this.$parent.active = 3
      }).catch(error => {
        this.$notify({
            title: '失败',
            message: response.message,
            type: 'error'
          });
      })
    },
    batchCoursePublishById(id) {
      courseApi.getCoursePublishById(id).then(response => {
        this.coursePublishInfo = response.data.item
        this.publishBtnDisabled = response.data.item.status === "Normal" ? true: false;
      })
    }
  }
}
</script>

<style>
.ccInfo {
    background: #f5f5f5;
    padding: 20px;
    overflow: hidden;
    border: 1px dashed #DDD;
    margin-bottom: 40px;
    position: relative;
}
.ccInfo img {
    background: #d6d6d6;
    width: 500px;
    height: 278px;
    display: block;
    float: left;
    border: none;
}
.ccInfo .main {
    margin-left: 520px;
}

.ccInfo .main h2 {
    font-size: 28px;
    margin-bottom: 30px;
    line-height: 1;
    font-weight: normal;
}
.ccInfo .main p {
    margin-bottom: 10px;
    word-wrap: break-word;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
}

.ccInfo .main p {
    margin-bottom: 10px;
    word-wrap: break-word;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
}
.ccInfo .main h3 {
    left: 540px;
    bottom: 20px;
    line-height: 1;
    font-size: 28px;
    color: #d32f24;
    font-weight: normal;
    position: absolute;
}

</style>