<template>
  <div>
    <PageHeader title="订单管理" description="支持按时间、状态、取号、关键字筛选订单并查看详情。" />

    <el-card class="page-card page-toolbar" shadow="never">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="订单号/饮品名" clearable />
        </el-form-item>

        <el-form-item label="订单状态">
          <el-select v-model="searchForm.status" clearable placeholder="全部" style="width: 130px">
            <el-option label="已支付" value="paid" />
            <el-option label="制作中" value="making" />
            <el-option label="待取餐" value="ready" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>

        <el-form-item label="取号">
          <el-input v-model="searchForm.pickupCode" placeholder="取号" clearable style="width: 120px" />
        </el-form-item>

        <el-form-item label="时间范围">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            value-format="YYYY-MM-DD"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="loadData(true)">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="page-card page-table" shadow="never">
      <el-table v-loading="ordersStore.loading" :data="ordersStore.list" border>
        <el-table-column prop="orderNo" label="订单编号" min-width="140" />
        <el-table-column prop="drinkName" label="饮品名称" min-width="120" />
        <el-table-column label="饮品属性" min-width="220">
          <template #default="scope">
            {{ scope.row.drinkAttributes.size }} / {{ scope.row.drinkAttributes.temp }} /
            {{ scope.row.drinkAttributes.toppings.join('、') || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="支付" width="100">
          <template #default="scope">{{ paymentText(scope.row.payment) }}</template>
        </el-table-column>
        <el-table-column label="优惠" width="90">
          <template #default="scope">¥{{ scope.row.discount.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" width="70" />
        <el-table-column prop="pickupCode" label="取号" width="90" />
        <el-table-column label="状态" width="90">
          <template #default="scope">
            <el-tag :type="statusType(scope.row.status)">{{ statusText(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="下单时间" width="170" />
        <el-table-column label="操作" width="90" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="openDetail(scope.row.id)">详情</el-button>
          </template>
        </el-table-column>

        <template #empty>
          <el-empty description="暂无订单数据" />
        </template>
      </el-table>

      <div style="display: flex; justify-content: flex-end; margin-top: 16px">
        <el-pagination
          background
          layout="total, prev, pager, next, sizes"
          :current-page="ordersStore.query.page"
          :page-size="ordersStore.query.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="ordersStore.total"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <OrderDetailDialog :visible="detailVisible" :order="ordersStore.detail" @close="detailVisible = false" />
  </div>
</template>

<script setup >
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useOrdersStore } from "@/stores/orders";
const ordersStore = useOrdersStore();
const detailVisible = ref(false);
const searchForm = reactive({
  keyword: "",
  status: "",
  pickupCode: "",
  dateRange: []
});
const statusMap = {
  paid: "\u5DF2\u652F\u4ED8",
  making: "\u5236\u4F5C\u4E2D",
  ready: "\u5F85\u53D6\u9910",
  completed: "\u5DF2\u5B8C\u6210",
  cancelled: "\u5DF2\u53D6\u6D88"
};
const statusTagMap = {
  paid: "primary",
  making: "warning",
  ready: "info",
  completed: "success",
  cancelled: "danger"
};
const paymentMap = {
  wechat: "\u5FAE\u4FE1",
  alipay: "\u652F\u4ED8\u5B9D",
  cash: "\u73B0\u91D1"
};
async function loadData(resetPage = false, page, pageSize) {
  try {
    await ordersStore.fetchList({
      page: page ?? (resetPage ? 1 : ordersStore.query.page),
      pageSize: pageSize ?? ordersStore.query.pageSize,
      keyword: searchForm.keyword,
      status: searchForm.status || void 0,
      pickupCode: searchForm.pickupCode,
      startTime: searchForm.dateRange?.[0] ? `${searchForm.dateRange[0]} 00:00:00` : "",
      endTime: searchForm.dateRange?.[1] ? `${searchForm.dateRange[1]} 23:59:59` : ""
    });
  } catch (error) {
    ElMessage.error(error?.message ?? "\u52A0\u8F7D\u8BA2\u5355\u5931\u8D25");
  }
}
function handlePageChange(page) {
  loadData(false, page, ordersStore.query.pageSize);
}
function handleSizeChange(size) {
  loadData(false, 1, size);
}
function paymentText(payment) {
  return paymentMap[payment];
}
function statusText(status) {
  return statusMap[status];
}
function statusType(status) {
  return statusTagMap[status];
}
function resetSearch() {
  searchForm.keyword = "";
  searchForm.status = "";
  searchForm.pickupCode = "";
  searchForm.dateRange = [];
  loadData(true);
}
async function openDetail(id) {
  try {
    await ordersStore.fetchDetail(id);
    detailVisible.value = true;
  } catch (error) {
    ElMessage.error(error?.message ?? "\u83B7\u53D6\u8BE6\u60C5\u5931\u8D25");
  }
}
loadData(true);
</script>
