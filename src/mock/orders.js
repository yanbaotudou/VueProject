import { paginate, wait } from "./common";
import { readDatabase } from "./db";
function inDateRange(target, start, end) {
  if (!start && !end) return true;
  const value = new Date(target).getTime();
  const startTime = start ? new Date(start).getTime() : Number.MIN_SAFE_INTEGER;
  const endTime = end ? new Date(end).getTime() : Number.MAX_SAFE_INTEGER;
  return value >= startTime && value <= endTime;
}
async function listOrders(query) {
  const db = readDatabase();
  let filtered = [...db.orders];
  if (query.keyword) {
    filtered = filtered.filter(
      (item) => item.orderNo.includes(query.keyword ?? "") || item.drinkName.includes(query.keyword ?? "")
    );
  }
  if (query.status) {
    filtered = filtered.filter((item) => item.status === query.status);
  }
  if (query.pickupCode) {
    filtered = filtered.filter((item) => item.pickupCode.includes(query.pickupCode ?? ""));
  }
  filtered = filtered.filter((item) => inDateRange(item.createdAt, query.startTime, query.endTime));
  filtered.sort((a, b) => a.createdAt > b.createdAt ? -1 : 1);
  return wait(paginate(filtered, query));
}
async function getOrderDetail(id) {
  const db = readDatabase();
  const target = db.orders.find((item) => item.id === id);
  if (!target) {
    return Promise.reject(new Error("\u8BA2\u5355\u4E0D\u5B58\u5728"));
  }
  return wait(target);
}
function toDateKey(value) {
  return value.slice(0, 10);
}
async function getOrderTrends(rangeDays) {
  const db = readDatabase();
  const now = /* @__PURE__ */ new Date();
  const trendMap = /* @__PURE__ */ new Map();
  for (let i = rangeDays - 1; i >= 0; i -= 1) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const key = date.toISOString().slice(0, 10);
    trendMap.set(key, { date: key, sales: 0, orders: 0 });
  }
  db.orders.forEach((order) => {
    const key = toDateKey(order.createdAt);
    if (trendMap.has(key) && order.status !== "cancelled") {
      const current = trendMap.get(key);
      current.sales += order.amount;
      current.orders += order.quantity;
      trendMap.set(key, current);
    }
  });
  return wait(Array.from(trendMap.values()));
}
async function getDashboardMetrics() {
  const db = readDatabase();
  const now = /* @__PURE__ */ new Date();
  const todayKey = now.toISOString().slice(0, 10);
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 6);
  const metrics = {
    todaySales: 0,
    todayOrders: 0,
    weekSales: 0,
    weekOrders: 0
  };
  db.orders.forEach((order) => {
    if (order.status === "cancelled") return;
    const orderDate = new Date(order.createdAt);
    const dayKey = toDateKey(order.createdAt);
    if (dayKey === todayKey) {
      metrics.todaySales += order.amount;
      metrics.todayOrders += order.quantity;
    }
    if (orderDate >= weekStart && orderDate <= now) {
      metrics.weekSales += order.amount;
      metrics.weekOrders += order.quantity;
    }
  });
  metrics.todaySales = Number(metrics.todaySales.toFixed(2));
  metrics.weekSales = Number(metrics.weekSales.toFixed(2));
  return wait(metrics);
}
export {
  getDashboardMetrics,
  getOrderDetail,
  getOrderTrends,
  listOrders
};
