<template>
  <div class="app-container">
      <!-- 输入表单 -->
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name" />
      </el-form-item>
      <el-form-item label="入驻时间">
        <el-date-picker v-model="teacher.joinDate" value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" :min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
            -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <el-form-item label="讲师头像">
        <el-upload
          class="avatar-uploader"
          action="http://localhost:9640/api/oss/file/auth/upload?module=teacher"
          :show-file-list="false"
          :on-error="handleUploadError"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="teacher.avatar" :src="teacher.avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate()">{{ submit === 0 ? '添加' : '更新'}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacherApi from '@/api/teacher'
export default {
  data() {
    return {
      // 讲师对象
      teacher: {
        sort: 0,
        level: 1,
      },
      saveBtnDisabled: false, // 提交按钮默认可用
      submit: 0, // 0表示添加，1表示更新
    }
  },
  created() {
    console.log("form created声明函数被执行")
    // 获取路由传递的动态值
    if (this.$route.params.id) {
      console.log("更新讲师")
      this.submit = 1
      this.fetchDataById(this.$route.params.id)
    }
  },
  methods: {
    saveOrUpdate() {
      this.saveBtnDisabled = true
      if (this.submit === 0) {
        this.saveTeacher()
      } else {
        this.updateTeacher()
      }
    },
    saveTeacher() {
      teacherApi.save(this.teacher).then(response => {
        this.$notify({
          title: '成功',
            message: response.message,
            type: 'success'
          });
        this.$router.push('/teacher/list') 
      }).catch(error => {
        this.$notify({
            title: '失败',
            message: response.message,
            type: 'info'
          });
      })
    },
    fetchDataById(id) {
      teacherApi.getById(id).then(response => {
        this.teacher = response.data.teacher
      })
    },
    updateTeacher() {
      teacherApi.updateById(this.teacher).then(response => {
        this.$notify({
          title: '成功',
            message: response.message,
            type: 'success'
          });
        this.$router.push('/teacher/list') 
      }).catch(error => {
        this.$notify({
            title: '失败',
            message: response.message,
            type: 'info'
          });
      })
    },
    // 文件上传成功后的回调函数
    handleAvatarSuccess(response, file, fileList) {
      if (response.success) {
        this.teacher.avatar = response.data.url
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
    handleUploadError(err) {
      this.$notify({
        title: '失败',
          message: '请检查网络连接',
          type: 'error'
        });    
    },
    // 文件上传前的校验
    beforeAvatarUpload(file) {
        const isType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' // MIME
        const isLt4M = file.size / 1024 / 1024 < 4;
        if (!isLt4M) {
          this.$message.error('上传头像图片大小不能超过 4MB!');
        }
        if (!isType) {
          this.$message.error('上传头像图片文件类型错误!');
        }

        return isLt4M && isType;
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>