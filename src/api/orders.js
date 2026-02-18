import * as orderMock from "@/mock/orders";
const ordersApi = {
  listOrders: orderMock.listOrders,
  getOrderDetail: orderMock.getOrderDetail,
  getOrderTrends: orderMock.getOrderTrends,
  getDashboardMetrics: orderMock.getDashboardMetrics
};
export {
  ordersApi
};
