<template>
  <div class="app-container">
      <!-- 章节列表  -->
      <div>
        <el-button type="primary" @click="addChapter()">添加章节</el-button>
      </div>

      <ul class="chapterList">
        <li v-for="chapter in chapterList" :key="chapter.id">
          <p>{{ chapter.title }}
            <span class="actschapter">
              <el-button type="text" @click="addVideo(chapter.id)">添加课时</el-button>
              <el-button type="text" @click="editChapter(chapter.id)">编辑</el-button>
              <el-button type="text" @click="removeChapterById(chapter.id)">删除</el-button>
            </span>
          </p>
          
          <ul class="chapterList videoList">
            <li v-for="video in chapter.children" :key="video.id">
              <p>{{ video.title }}
                <el-tag v-if="!video.videoSourceId" size="mini" type="danger">
                  {{ '尚未上传视频' }}
                </el-tag>
                <span class="actsvideo">
                  <el-tag v-if="video.free" size="mini" type="success">{{ '免费观看' }}</el-tag>&nbsp;&nbsp;
                  <el-button type="text" @click="editVideo(chapter.id, video.id)">编辑</el-button>
                  <el-button type="text" @click="removeVideoById(video.id)">删除</el-button>
                </span>
              </p>
            </li>
          </ul>
        </li>
      </ul>

      <!-- 章节表单对话框 -->
      <chapter-form ref="chapterForm" />
      <!-- 课时表单对话框 -->
      <video-form ref="videoForm" />

      <div style="text-align: center;">
        <el-button type="primary" @click="prev">上一步</el-button>
        <el-button type="primary" @click="next">下一步</el-button>
      </div>
  </div>
</template>

<script>
import ChapterForm from './Form'
import VideoForm from '../VIdeo/Form'
import chapterApi from '@/api/chapter'
import videoApi from '@/api/video'
export default {
  // 注册子组件
  components: {
    ChapterForm,
    VideoForm
  }
  ,
  data() {
    return {
      chapterList: [], // 章节嵌套列表
    }
  },
  created() {
    if (this.$parent.courseId != null) {
      this.fetchNodeList()
    }
  },
  methods: {
    // 获取章节嵌套列表数据
    fetchNodeList() {
      chapterApi.getNestedListById(this.$parent.courseId).then(response => {
        this.chapterList = response.data.items
      })
    },
    // 删除章节列表
    removeChapterById(id) {
      this.$confirm('此操作将删除永久删除该章节内容, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return chapterApi.removeChapterById(id)
        }).then(response => {
            // 给出提示
            this.$notify({
              title: '成功',
              message: response.message,
              type: 'success'
            });
            // 刷新页面
            this.fetchNodeList()
        }).catch((response) => {
          if (response === 'cancel') {
            this.$notify({
              title: '提示',
              message: `已取消删除`,
              type: 'info'
            }); 
          }
        });
    },
    // 添加章节
    addChapter() {
      this.$refs.chapterForm.show()
    },
    // 编辑章节
    editChapter(id) {
      this.$refs.chapterForm.show(id)
    },

    // ==========================课时=============================
    // 添加课时
    addVideo(chapterId) {
      this.$refs.videoForm.show(chapterId)
    },
    // 更新课时
    editVideo(chapterId, videoId) {
      this.$refs.videoForm.show(chapterId, videoId)
    },
    // 删除课时
    removeVideoById(id) {
      this.$confirm('此操作将删除永久删除该课时, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return videoApi.removeById(id)
        }).then(response => {
            // 给出提示
            this.$notify({
              title: '成功',
              message: response.message,
              type: 'success'
            });
            // 刷新页面
            this.fetchNodeList()
        }).catch((response) => {
          if (response === 'cancel') {
            this.$notify({
              title: '提示',
              message: `已取消删除`,
              type: 'info'
            }); 
          }
        });
    },
    prev() {
      this.$parent.active = 0
    },
    next() {
      this.$parent.active = 2
    }
  }
}
</script>

<style>
.chapterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chapterList li{
  position: relative;
}
.chapterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
  border-radius: 5px;
}
.chapterList .actschapter {
    float: right;
    font-size: 14px;
}
.chapterList .actsvideo {
    float: right;
    font-size: 14px;
    position: relative;
    top: -5px;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 2px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dashed #DDD;
  border-radius: 10px;
}

</style>