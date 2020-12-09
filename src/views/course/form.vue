<template>
  <div class="app-container">
      <h2 style="text-align: center;">发布新课程</h2>
      <el-steps :active="active" finish-status="success" simple style="margin-top: 20px">
        <el-step title="填写课程基本信息" ></el-step>
        <el-step title="创建课程大纲" ></el-step>
        <el-step title="发布课程" ></el-step>
      </el-steps>

      <!-- 步骤内容 -->
      <!-- step1 Info -->
      <Info v-if="active === 0" />
      <!-- step2 ChapterIndex -->
      <Chapter v-if="active === 1" />
      <!-- step3 Publish -->
      <Publish v-if="active === 2 || active === 3" />

  </div>
</template>

<script>
import Info from '@/views/course/components/Info'
import Chapter from '@/views/course/components/Chapter/Index' // 会找 Chapter 或chapter下的index.vue
import Publish from '@/views/course/components/Publish'
    
export default {
  components: {Info, Chapter, Publish}, // 注册组件

  created() {
    if (this.$route.name === 'CourseChapterEdit') {
      this.courseId = this.$route.params.id
      this.active = 1
    } else if (this.$route.name === 'CourseInfoEdit') {
      this.courseId = this.$route.params.id
      this.active = 0
    }
  },
  data() {
    return {
      active: 0,
      courseId: null,
    }
  }
}
</script>

<style>

</style>