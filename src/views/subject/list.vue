<template>
  <div class="app-container">
      <el-input style="margin-bottom: 10px;"
        placeholder="输入关键字进行搜索"
        v-model="filterText">
      </el-input>

      <el-tag>
        <i class="el-icon-download"/>
        <a href="javascript:void(0);" @click="exportExcel()">导出Excel</a>
      </el-tag>

      <el-tree 
        class="filter-tree"
        :data="subjectList" 
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode" 
        ref="tree"
        ></el-tree>
  </div>
</template>

<script>
import subjectApi from '@/api/subject'
import axios from 'axios'
export default {
  data() {
    return {
      filterText: '', // 过滤文本
      subjectList: [], // 数据列表
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
  },
  methods: {
    fetchNodeList() {
      subjectApi.getNestedTreeList().then(response => {
        this.subjectList = response.data.items
      })
    },
    filterNode(value, data) {
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
    },
    exportExcel() {
      var that = this
      var req = axios.create({
        url:"http://localhost:9600/admin/core/subject/export",
        method: 'get',
        responseType: 'blob'
      })
      req.request().then(res => {
        console.log(res)
        let data = res.data
        if (data) {
          // 获取数据类型
          let type = res.headers['content-type'].split(';')[0]
          let blob = new Blob([res.data], { type: type })

          // 创建URL
          const blobUrl = window.URL.createObjectURL(blob)

          const a = document.createElement('a')
          a.download = "课程分类.xlsx"
          a.href = blobUrl // 设置下载URL
          document.body.appendChild(a)
          // 下载文件
          a.click()
      
          // 释放内存
          URL.revokeObjectURL(blobUrl)
          document.body.removeChild(a)

          that.$notify({
            title: '通知',
            message: '下载成功',
            type: 'success'
          })
        } else {
          that.$notify({
            title: '通知',
            message: '下载失败',
            type: 'error'
          })
        }

      })

    }
  },
  created() {
    this.fetchNodeList()
  }
}
</script>

<style>

</style>