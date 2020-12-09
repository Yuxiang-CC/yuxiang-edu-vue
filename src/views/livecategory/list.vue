<template>
  <div class="app-container">
    <el-input
      placeholder="输入关键字进行过滤"
      v-model="filterText">
    </el-input>

    <el-tag>
        <i class="el-icon-download"/>
        <a href="javascript:void(0);" @click="exportExcel()">导出Excel</a>
      </el-tag>

    <el-tree
      class="filter-tree"
      :data="liveCategorys"
      :props="defaultProps"
      default-expand-all
      :filter-node-method="filterNode"
      ref="tree">
    </el-tree>
  </div>
</template>
<script>
import liveCategoryApi from '@/api/liveCategory'
import axios from 'axios'
export default {
  watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
  data() {
    return {
      filterText: '',
      liveCategorys: [],
      defaultProps: {
          children: 'children',
          label: 'name'
        }
    }
  },
  created() {
    this.fetchLiveCategory()
  },
  methods: {
    fetchLiveCategory() {
      liveCategoryApi.getAll().then(res => {
        
        this.liveCategorys = res.data.items
      })
    },
    // 过滤信息
    filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
    },
      // 导出Excel
      exportExcel() {
      var that = this
      var req = axios.create({
        url:"http://localhost:9600/admin/vod/live-category/export",
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
          a.download = "直播分类.xlsx"
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
  }
}
</script>
<style>

</style>