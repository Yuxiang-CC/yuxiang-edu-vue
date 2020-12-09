<template>
  <div class="app-container">
    <h2>{{order.id}} 的订单信息</h2>
    <el-form ref="form" :model="order" label-width="120px">
      <el-form-item label="订单标识" >
        <el-input v-model="order.orderNo" width="150px" disabled></el-input>
      </el-form-item>

      <el-form-item label="课程名称" >
        <el-input v-model="order.courseTitle" width="150px" disabled></el-input>
      </el-form-item>

      <el-form-item label="课程封面" >
        <el-input v-model="order.courseCover" width="150px" disabled></el-input>
      </el-form-item>

      <el-form-item label="课程讲师名" >
        <el-input v-model="order.teacherName" width="150px" disabled></el-input>
      </el-form-item>

      <el-form-item label="用户手机号" >
        <el-input v-model="order.mobile" width="150px" disabled></el-input>
      </el-form-item>

      <el-form-item label="用户名称" >
        <el-input v-model="order.nickname" width="150px" disabled></el-input>
      </el-form-item>

      <el-form-item label="价格" >
        <el-input v-model="order.totalFee" width="150px" disabled></el-input>
      </el-form-item>
      
      <el-form-item label="创建时间">
        <el-col :span="5">
          <el-date-picker disabled type="date" placeholder="选择日期" v-model="order.gmtCreate" style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item>
    </el-form>


  </div>
</template>
<script>
import tradeApi from '@/api/trade'
export default {
  data() {
    return {
      // 订单对象
      order: {}
    }
  },
  created() {
    // 获取路由传递的动态值
    if (this.$route.params.id) {
      console.log(this.$route.params.id)
      this.fetchOrderInfoById(this.$route.params.id)
    }
  },
  methods: {
    fetchOrderInfoById(orderId) {
      tradeApi.getOrderInfo(orderId).then(res => {
        this.order = res.data.item
      })
    }
  }
}
</script>
<style>

</style>