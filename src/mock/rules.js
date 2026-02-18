import { formatDate, wait } from "./common";
import { readDatabase, updateDatabase } from "./db";
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function dateOnly(value) {
  return value.slice(0, 10);
}
async function getRules() {
  const db = readDatabase();
  return wait({
    nextDayRule: db.nextDayRule,
    couponRule: db.couponRule
  });
}
async function updateNextDayRule(payload) {
  const db = updateDatabase((draft) => {
    draft.nextDayRule = {
      ...payload,
      updatedAt: formatDate(/* @__PURE__ */ new Date())
    };
  });
  return wait(db.nextDayRule);
}
async function updateCouponRule(payload) {
  const db = updateDatabase((draft) => {
    draft.couponRule = {
      ...payload,
      updatedAt: formatDate(/* @__PURE__ */ new Date())
    };
  });
  return wait(db.couponRule);
}
async function previewNextDayStock(rule) {
  const db = readDatabase();
  const activeRule = rule ?? db.nextDayRule;
  const now = /* @__PURE__ */ new Date();
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - (activeRule.windowDays - 1));
  const byDrink = /* @__PURE__ */ new Map();
  db.drinks.forEach((drink) => {
    byDrink.set(drink.id, []);
  });
  db.orders.forEach((order) => {
    if (order.status === "cancelled") return;
    const d = new Date(order.createdAt);
    if (d < startDate || d > now) return;
    const arr = byDrink.get(order.drinkId) ?? [];
    arr.push(order.quantity);
    byDrink.set(order.drinkId, arr);
  });
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);
  const rows = db.drinks.map((drink) => {
    const quantities = byDrink.get(drink.id) ?? [];
    const total = quantities.reduce((sum, cur) => sum + cur, 0);
    const recentAverage = total / Math.max(activeRule.windowDays, 1);
    const lastDayCount = db.orders.filter(
      (order) => order.drinkId === drink.id && order.status !== "cancelled" && dateOnly(order.createdAt) === yesterdayKey
    ).reduce((sum, cur) => sum + cur.quantity, 0);
    const recommendedRaw = recentAverage * activeRule.recentWeight + lastDayCount * activeRule.trendWeight;
    return {
      drinkId: drink.id,
      drinkName: drink.name,
      recentAverage: Number(recentAverage.toFixed(2)),
      lastDayCount,
      recommended: Math.round(clamp(recommendedRaw, activeRule.minStock, activeRule.maxStock))
    };
  });
  rows.sort((a, b) => b.recommended - a.recommended);
  return wait(rows);
}
async function previewCouponRule(rule) {
  const db = readDatabase();
  const active = rule ?? db.couponRule;
  const rows = db.users.map((user) => {
    const matchedRule = active.tiers.find(
      (tier) => tier.tier === user.tier && user.orderCount >= tier.minOrders && user.orderCount <= tier.maxOrders
    ) ?? null;
    return {
      userId: user.id,
      userName: user.name,
      tier: user.tier,
      matchedRule
    };
  });
  return wait(rows);
}
export {
  getRules,
  previewCouponRule,
  previewNextDayStock,
  updateCouponRule,
  updateNextDayRule
};
