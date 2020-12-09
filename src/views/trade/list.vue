<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true">
      <el-form-item>
        <el-input
          v-model="searchObject.teacherName"
          clearable
          placeholder="讲师名"
        />
      </el-form-item>

      <el-form-item>
        <el-input
          v-model="searchObject.memberId"
          clearable
          placeholder="用户ID"
        />
      </el-form-item>

      <el-form-item>
        <el-input
          v-model="searchObject.mobile"
          clearable
          placeholder="手机号"
        />
      </el-form-item>

      <el-form-item>
        <el-select
          v-model="searchObject.payType"
          clearable
          placeholder="支付类型"
        >
          <el-option value="1" label="微信" />
          <el-option value="2" label="支付宝" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-select v-model="searchObject.status" clearable placeholder="状态">
          <el-option value="1" label="已支付" />
          <el-option value="0" label="未支付" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="fetchOrderListByPage()"
          >查询</el-button
        >
        <el-button type="default" @click="resetData()">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 讲师信息 -->
    <el-table
      :data="orderList"
      border
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <!-- <el-table-column type="index" width="50"></el-table-column> -->
      <el-table-column label="#" width="50">
        <template slot-scope="scope">
          {{ (page - 1) * size + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="orderNo" label="订单编号"> </el-table-column>
      <el-table-column prop="level" label="订单信息" width="240px">
        <template slot-scope="scope">
          课程名：<span>{{ scope.row.courseTitle }}</span
          ><br />
          讲师名：<span>{{ scope.row.teacherName }}</span
          ><br />
          用户名；<span>{{ scope.row.nickname }}</span
          ><br />
        </template>
      </el-table-column>
      <el-table-column label="价格">
        <template slot-scope="scope">
          <el-tag type="danger">{{ scope.row.totalFee / 100 }}元</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="支付类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.payType == 1" type="success" effect="plain">微信</el-tag>
          <el-tag v-else-if="scope.row.payType == 2" type="primary" effect="plain">支付宝</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 0">未支付</el-tag>
          <el-tag v-else-if="scope.row.status == 1" type="success">已支付</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <router-link :to="'/trade/info/' + scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit"
              >查看详情</el-button
            >
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      :current-page="page"
      :page-size="size"
      :total="total"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :page-sizes="[5, 10, 15, 30, 50]"
      style="padding: 30px 0px; text-align: center"
      @current-change="changeCurrentPage"
      @size-change="changePageSize"
    />
  </div>
</template>
<script>
import tradeApi from "@/api/trade";
export default {
  data() {
    return {
      orderList: [], //讲师列表
      total: 0, // 总记录数
      page: 1, // 当前页面
      size: 5, // 页面大小
      searchObject: {
        teacherName: "",
        memberId: "",
        mobile: "",
        payType: "",
        status: "",
      }, // 查询表单
      idList: [],
    };
  },
  created() {
    this.fetchOrderListByPage();
  },
  methods: {
    // 分页获取信息
    fetchOrderListByPage() {
      if (this.searchObject.status === "0") {
        this.searchObject.payType = "";
      }
      tradeApi.pageList(this.page, this.size, this.searchObject).then((res) => {
        this.orderList = res.data.rows;
        this.total = res.data.total;
      });
    },
    // 将勾选信息的id值放入数组中
    handleSelectionChange(selection) {
      this.idList.push(selection[0].id);
    },
    // 当前页改变时会触发
    changeCurrentPage(page) {
      this.page = page;
      this.fetchOrderListByPage();
    },
    // 每页条数
    changePageSize(size) {
      this.size = size;
      this.fetchOrderListByPage();
    },
    resetData() {
      this.searchObject.teacherName = "";
      this.searchObject.memberId = "";
      this.searchObject.mobile = "";
      this.searchObject.payType = "";
      this.searchObject.status = "";
      this.fetchOrderListByPage();
    },
  },
};
</script>
<style>
</style>