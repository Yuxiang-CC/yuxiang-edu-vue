<template>
  <div class="app-container">

    <!--表单-->
    <el-form :inline="true" class="demo-form-inline">

      <el-form-item label="日期">
        <el-date-picker
          v-model="beginDay"
          type="date"
          placeholder="选择要统计的开始日期"
          value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="endDay"
          type="date"
          placeholder="选择要统计的结束日期"
          value-format="yyyy-MM-dd" />
      </el-form-item>

      <el-button
        :disabled="dataDisabled"
        type="primary"
        @click="genarateData()">查看统计信息</el-button>

      <el-button
        :disabled="excelDisabled"
        type="primary"
        @click="genarateExcel()">生成Excel表格</el-button>
    </el-form>

    <br/>
    
    <div id="charts" style="">
      <h2 >统计信息如下</h2>
      <div id="one-day-chart" style="width:400px;height:300px;"></div>
    </div>
    <h2 id="datarangetitle"></h2>
    <div id="datarange">
    </div>

  </div>
</template>

<script>
import statisticsApi from '@/api/statistics'
import axios from 'axios'
import { title } from '@/settings'
// 引入基本模板
var echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
// vm实例对象
var that 
export default {
  data() {
    return {
      oneDayStatistics: {
      },
      beginDay: '',
      endDay: '',
      dataDisabled: false, // 按钮禁用状态
      excelDisabled: false,
      dateRangeStatistics: [],//时间范围内的统计信息
    }
  },
  mounted() {
    that = this
  },
  created() {
    this.fetchOneDayStatistics()
  },
  methods: {
    fetchOneDayStatistics() {
      statisticsApi.getDaily('2020-11-30').then(res => {
        this.oneDayStatistics = res.data.daily;
        this.drawOneDayChart()
      })
    },
    drawOneDayChart() {
      let oneDayInfo = that.oneDayStatistics
      var oneDayChart = echarts.init(document.getElementById("one-day-chart"))
      // 指定图表的配置项和数据
		  var option = {
			  title: {
				  text: `${oneDayInfo.dateCalculated}数据`
			  },
			  tooltip: {},
			  legend: {
				  data:['人数']
			  },
			  xAxis: {
				  data: ["课程","登录","注册","新增视频"]
			  },
			  yAxis: {},
			  series: [{
				  name: '数量',
				  type: 'bar',
				  data: [oneDayInfo.courseNum, oneDayInfo.loginNum, oneDayInfo.registerNum, oneDayInfo.videoViewNum]
			  }]
		  };

		  // 使用刚指定的配置项和数据显示图表。
		  oneDayChart.setOption(option);
    },
    // 生成时间范围内的图表
    drawDateRangeChart() {
      var datas = that.dateRangeStatistics
      document.getElementById("datarangetitle").innerHTML = this.beginDay + ' 到 ' + this.endDay + ' 的统计信息'
      // 成生元素设置Id
      var dateRangeParent = document.getElementById("datarange")
      for (let i = 0;i < 5;i++) {
        var d = document.createElement("div")
        d.style.width = '400px';
        d.style.height = '300px';
        d.style.margin = '10px 10px';
        d.style.display = 'inline-block'
        d.setAttribute("id", 'date-range-' + i);
        dateRangeParent.appendChild(d);

      // 填入数据绘画图表
        var dateRangeOne = echarts.init(document.getElementById('date-range-' + i))

        // 指定图表的配置项和数据
        var option = {
          title: {
            text: `${datas[i].dateCalculated}数据`
          },
          tooltip: {},
          legend: {
            data:['人数']
          },
          xAxis: {
            data: ["课程","登录","注册","新增视频"]
          },
          yAxis: {},
          series: [{
            name: '数量',
            type: 'bar',
            data: [datas[i].courseNum, datas[i].loginNum, datas[i].registerNum, datas[i].videoViewNum]
          }]
        };

        dateRangeOne.setOption(option)

      }

    },
    // 获取某时间范围内的统计信息，仅限于已经生成统计的天
    genarateData() {
      if (this.beginDay == '' || this.endDay == '') {
        this.$notify({
          'title': '警告',
          'message': '请选择日期开始时间和结束时间',
          'type': 'warning'
        })
        return
      }

      statisticsApi.getDailyByDate(this.beginDay, this.endDay).then(res => {
        this.dateRangeStatistics = res.data.items
        this.drawDateRangeChart()
        this.dataDisabled = false
      })

    },
    // 对某一个时间内的数据生成Excel表格
    genarateExcel() {
      if (this.beginDay == '' || this.endDay == '') {
        this.$notify({
          'title': '警告',
          'message': '请选择日期开始时间和结束时间',
          'type': 'warning'
        })
        return
      }
      var that = this;
      var req = axios.create({
        url:`http://localhost:9600/admin/statistics/daily/export/${that.beginDay}/${that.endDay}`,
        method: 'get',
        responseType: 'blob'
      })
      req.request().then(res => {
        let data = res.data

        if (data) {
          // 获取数据类型
          let type = res.headers['content-type'].split(';')[0]
          let blob = new Blob([res.data], { type: type })

          // 创建URL
          const blobUrl = window.URL.createObjectURL(blob)

          const a = document.createElement('a')
          a.download = that.beginDay + "至" + that.endDay + "统计信息.xlsx"
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
.datarange {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}
.datarange > div {
  flex: 1;
  border: 1px solid sandybrown;
}
</style>