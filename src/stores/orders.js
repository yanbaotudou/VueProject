import { defineStore } from "pinia";
import { ordersApi } from "@/api/orders";
const useOrdersStore = defineStore("orders", {
  state: () => ({
    list: [],
    total: 0,
    loading: false,
    detail: null,
    trend: [],
    metrics: {
      todaySales: 0,
      todayOrders: 0,
      weekSales: 0,
      weekOrders: 0
    },
    query: {
      page: 1,
      pageSize: 10,
      keyword: "",
      status: void 0,
      pickupCode: "",
      startTime: "",
      endTime: ""
    }
  }),
  actions: {
    async fetchList(partial) {
      this.loading = true;
      try {
        this.query = {
          ...this.query,
          ...partial
        };
        const result = await ordersApi.listOrders(this.query);
        this.list = result.list;
        this.total = result.total;
      } finally {
        this.loading = false;
      }
    },
    async fetchDetail(id) {
      this.detail = await ordersApi.getOrderDetail(id);
      return this.detail;
    },
    async fetchTrend(rangeDays) {
      this.trend = await ordersApi.getOrderTrends(rangeDays);
    },
    async fetchMetrics() {
      this.metrics = await ordersApi.getDashboardMetrics();
    }
  }
});
export {
  useOrdersStore
};
