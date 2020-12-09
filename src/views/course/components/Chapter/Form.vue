<template>
  <!-- 添加和修改章节表单 -->
  <el-dialog :visible="dialogVisible" title="添加章节" @close="close()">
    <el-form :model="chapter" label-width="120px">
      <el-form-item label="章节标题">
        <el-input v-model="chapter.title"/>
      </el-form-item>
      <el-form-item label="章节排序">
        <el-input-number v-model="chapter.sort" :min="0"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
    </div>
  </el-dialog>

</template>

<script>
import chapterApi from '@/api/chapter'
export default {
    data() {
        return {
            dialogVisible: false, // 是否显示对话框
            chapter: { // 章节对象
                sort: 0
            }
        }
    },
    methods: {
        // 打开对话框
        show(id) {
            console.log("Id: " + id)
            if (id) {
                chapterApi.getChapterById(id).then(response => {
                    this.chapter = response.data.item
                })
                this.dialogVisible = true
            } else {
                this.dialogVisible = true
            }
        },
        // 关闭对话框
        close() {
            this.clearForm()
            this.dialogVisible = false
        },
        // 保存或更新章节
        saveOrUpdate() {
            if (this.chapter.id == null) {
                this.save()
            } else {
                this.update()
            }
        },
        save() {
            this.chapter.courseId = this.$parent.$parent.courseId
            chapterApi.saveChapterInfo(this.chapter).then(response => {
                this.$notify({
                    title: '成功',
                    message: response.message,
                    type: 'success'
                });
                this.close()
                this.clearForm()
                // 刷新父组件列表
                this.$parent.fetchNodeList()
            })
        },
        update() {
            this.chapter.courseId = this.$parent.$parent.courseId
            chapterApi.updateChapterById(this.chapter).then(response => {
                this.$notify({
                    title: '成功',
                    message: response.message,
                    type: 'success'
                });
                this.close()
                this.clearForm()
                 // 刷新父组件列表
                this.$parent.fetchNodeList()
            })
        },
        // 重置表单
        clearForm() {
            this.chapter = { // 章节对象
                sort: 0
            }
        }

    }

}
</script>

<style>

</style>