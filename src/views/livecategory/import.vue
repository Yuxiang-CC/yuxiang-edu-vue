<template>
  <div class="app-container">
    <el-form label-width="120px">

      <el-form-item label="信息描述">

        <el-tag type="info">右边查看excel模版说明 >> </el-tag>
        <el-tag>
          <i class="el-icon-download"/>
          <a :href="defaultExcelTemplate">点击下载模版</a>
        </el-tag>

      </el-form-item>

      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-exceed="fileUploadExceed"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :limit="1"
          action="http://localhost:9690/admin/core/live-category/import"
          name="file"
          accept="application/vnd.ms-excel">
          <el-button
            slot="trigger"
            size="small"
            type="primary">选取文件</el-button>
          <el-button
            :disabled="importBtnDisabled"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload">导入</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      defaultExcelTemplate: 'https://yuxiang-edu.oss-cn-qingdao.aliyuncs.com/livecategory/直播分类列表模板.xlsx',
      importBtnDisabled: false
    }
  },
  methods: {
    // 上传文件
    submitUpload() {
      this.importBtnDisabled = true
      this.$refs.upload.submit() // 手动进行表单提交
    },
    // 当选择文件数量超出约定数量时触发
    fileUploadExceed() {
      this.$notify({
            title: '警告',
            message: '只能选择一个文件对象',
            type: 'warning'
          });
    },
    // 上传成功的回调
    fileUploadSuccess(response) {
      this.importBtnDisabled = false
      this.$refs.upload.clearFiles() // 清空已经上传的文件
      this.$notify({
            title: '成功',
            message: response.message,
            type: 'success'
          });
    },
    // 上传失败的回调
    fileUploadError(err) {
      this.importBtnDisabled = false
      this.$refs.upload.clearFiles() // 清空已经上传的文件
      this.$notify({
            title: '错误',
            message: err.message,
            type: 'error'
          });
    }

  }
}
</script>
<style>

</style>