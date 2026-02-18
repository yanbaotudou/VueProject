<template>
  <div>
    <PageHeader title="仪表盘" description="查看销售与订单核心指标，支持近 7/30 天趋势分析。">
      <el-radio-group v-model="range" @change="refresh">
        <el-radio-button :value="7">近7天</el-radio-button>
        <el-radio-button :value="30">近30天</el-radio-button>
      </el-radio-group>
    </PageHeader>

    <el-row :gutter="16" class="metric-row">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="metric-card">
          <p class="label">今日销售额</p>
          <h3>¥ {{ ordersStore.metrics.todaySales.toFixed(2) }}</h3>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="metric-card">
          <p class="label">今日订单量</p>
          <h3>{{ ordersStore.metrics.todayOrders }}</h3>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="metric-card">
          <p class="label">本周销售额</p>
          <h3>¥ {{ ordersStore.metrics.weekSales.toFixed(2) }}</h3>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="metric-card">
          <p class="label">本周订单量</p>
          <h3>{{ ordersStore.metrics.weekOrders }}</h3>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="24" :lg="12">
        <el-card class="chart-card" shadow="never">
          <template #header>
            <div class="flex-between">
              <span>销售额趋势</span>
            </div>
          </template>
          <div ref="salesChartRef" class="chart-box" />
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="12">
        <el-card class="chart-card" shadow="never">
          <template #header>
            <div class="flex-between">
              <span>订单量趋势</span>
            </div>
          </template>
          <div ref="ordersChartRef" class="chart-box" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup >
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import * as echarts from "echarts";
import { useOrdersStore } from "@/stores/orders";
const ordersStore = useOrdersStore();
const range = ref(7);
const salesChartRef = ref();
const ordersChartRef = ref();
let salesChart = null;
let ordersChart = null;
function buildBaseOption(title, dates) {
  return {
    tooltip: { trigger: "axis" },
    grid: { left: 28, right: 16, top: 24, bottom: 24, containLabel: true },
    xAxis: {
      type: "category",
      data: dates,
      boundaryGap: false
    },
    yAxis: { type: "value" },
    title: {
      text: title,
      left: 0,
      textStyle: {
        fontSize: 13,
        fontWeight: 500
      }
    }
  };
}
function renderCharts() {
  const dates = ordersStore.trend.map((item) => item.date.slice(5));
  const salesData = ordersStore.trend.map((item) => item.sales);
  const orderData = ordersStore.trend.map((item) => item.orders);
  if (salesChart && salesChartRef.value) {
    salesChart.setOption({
      ...buildBaseOption("\u9500\u552E\u989D\uFF08\u5143\uFF09", dates),
      color: ["#0f766e"],
      series: [
        {
          type: "line",
          smooth: true,
          data: salesData,
          areaStyle: {
            opacity: 0.08
          }
        }
      ]
    });
  }
  if (ordersChart && ordersChartRef.value) {
    ordersChart.setOption({
      ...buildBaseOption("\u8BA2\u5355\u91CF\uFF08\u676F\uFF09", dates),
      color: ["#2563eb"],
      series: [
        {
          type: "line",
          smooth: true,
          data: orderData,
          areaStyle: {
            opacity: 0.08
          }
        }
      ]
    });
  }
}
async function refresh() {
  try {
    await Promise.all([ordersStore.fetchMetrics(), ordersStore.fetchTrend(range.value)]);
    await nextTick();
    renderCharts();
  } catch (error) {
    ElMessage.error(error?.message ?? "\u52A0\u8F7D\u4EEA\u8868\u76D8\u5931\u8D25");
  }
}
function resizeCharts() {
  salesChart?.resize();
  ordersChart?.resize();
}
onMounted(async () => {
  if (salesChartRef.value) {
    salesChart = echarts.init(salesChartRef.value);
  }
  if (ordersChartRef.value) {
    ordersChart = echarts.init(ordersChartRef.value);
  }
  await refresh();
  window.addEventListener("resize", resizeCharts);
});
watch(
  () => ordersStore.trend,
  () => {
    renderCharts();
  }
);
onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeCharts);
  salesChart?.dispose();
  ordersChart?.dispose();
});
</script>

<style scoped>
.metric-row {
  margin-bottom: 16px;
}

.metric-card {
  min-height: 110px;
  margin-bottom: 16px;
}

.label {
  margin: 0;
  color: var(--text-secondary);
  font-size: 13px;
}

h3 {
  margin: 12px 0 0;
  font-size: 26px;
}

.chart-card {
  margin-bottom: 16px;
  border: 1px solid var(--border);
}

.chart-box {
  height: 330px;
}
</style>
