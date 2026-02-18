<template>
  <el-dialog :model-value="visible" title="订单详情" width="680px" @close="$emit('close')">
    <el-descriptions v-if="order" :column="2" border>
      <el-descriptions-item label="订单编号">{{ order.orderNo }}</el-descriptions-item>
      <el-descriptions-item label="订单状态">
        <el-tag>{{ statusMap[order.status] }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="饮品名称">{{ order.drinkName }}</el-descriptions-item>
      <el-descriptions-item label="用户">{{ order.userName }}</el-descriptions-item>
      <el-descriptions-item label="规格">{{ order.drinkAttributes.size }}</el-descriptions-item>
      <el-descriptions-item label="温度">{{ order.drinkAttributes.temp }}</el-descriptions-item>
      <el-descriptions-item label="小料" :span="2">
        {{ order.drinkAttributes.toppings.join('、') || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="数量">{{ order.quantity }}</el-descriptions-item>
      <el-descriptions-item label="取号">{{ order.pickupCode }}</el-descriptions-item>
      <el-descriptions-item label="支付方式">{{ paymentMap[order.payment] }}</el-descriptions-item>
      <el-descriptions-item label="优惠金额">¥{{ order.discount.toFixed(2) }}</el-descriptions-item>
      <el-descriptions-item label="实付金额">¥{{ order.amount.toFixed(2) }}</el-descriptions-item>
      <el-descriptions-item label="下单时间">{{ order.createdAt }}</el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script setup>
defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  order: {
    type: Object,
    default: null
  }
});

defineEmits(['close']);
const statusMap = {
  paid: "\u5DF2\u652F\u4ED8",
  making: "\u5236\u4F5C\u4E2D",
  ready: "\u5F85\u53D6\u9910",
  completed: "\u5DF2\u5B8C\u6210",
  cancelled: "\u5DF2\u53D6\u6D88"
};
const paymentMap = {
  wechat: "\u5FAE\u4FE1",
  alipay: "\u652F\u4ED8\u5B9D",
  cash: "\u73B0\u91D1"
};
</script>
