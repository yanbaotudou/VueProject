import { formatDate, generateId, paginate, wait } from "./common";
import { readDatabase, updateDatabase } from "./db";
function addDays(date, days) {
  const copied = new Date(date);
  copied.setDate(copied.getDate() + days);
  return copied;
}
function createCouponRecord(template, user, source) {
  const now = /* @__PURE__ */ new Date();
  return {
    id: generateId("coupon_rec"),
    templateId: template.id,
    templateName: template.name,
    userId: user.id,
    userName: user.name,
    source,
    status: "issued",
    issuedAt: formatDate(now),
    expiredAt: formatDate(addDays(now, template.validDays))
  };
}
async function listCouponTemplates(query) {
  const db = readDatabase();
  let filtered = [...db.couponTemplates];
  if (query.keyword) {
    filtered = filtered.filter((item) => item.name.includes(query.keyword ?? ""));
  }
  filtered.sort((a, b) => a.createdAt > b.createdAt ? -1 : 1);
  return wait(paginate(filtered, query));
}
async function createCouponTemplate(payload) {
  const created = {
    ...payload,
    id: generateId("coupon_tpl"),
    createdAt: formatDate(/* @__PURE__ */ new Date())
  };
  const db = updateDatabase((draft) => {
    draft.couponTemplates.unshift(created);
  });
  return wait(db.couponTemplates[0]);
}
async function updateCouponTemplate(id, payload) {
  const db = updateDatabase((draft) => {
    const index = draft.couponTemplates.findIndex((item) => item.id === id);
    if (index !== -1) {
      draft.couponTemplates[index] = {
        ...draft.couponTemplates[index],
        ...payload
      };
    }
  });
  const target = db.couponTemplates.find((item) => item.id === id);
  if (!target) {
    return Promise.reject(new Error("\u4F18\u60E0\u5238\u6A21\u677F\u4E0D\u5B58\u5728"));
  }
  return wait(target);
}
async function deleteCouponTemplate(id) {
  updateDatabase((draft) => {
    draft.couponTemplates = draft.couponTemplates.filter((item) => item.id !== id);
    draft.couponRecords = draft.couponRecords.filter((item) => item.templateId !== id);
    draft.couponRule.tiers = draft.couponRule.tiers.map((tier) => {
      if (tier.couponTemplateId === id) {
        return {
          ...tier,
          couponTemplateId: "",
          couponTemplateName: ""
        };
      }
      return tier;
    });
  });
  return wait(void 0);
}
async function listCouponRecords(query) {
  const db = readDatabase();
  let filtered = [...db.couponRecords];
  if (query.userName) {
    filtered = filtered.filter((item) => item.userName.includes(query.userName ?? ""));
  }
  filtered.sort((a, b) => a.issuedAt > b.issuedAt ? -1 : 1);
  return wait(paginate(filtered, query));
}
async function sendCoupon(payload) {
  const db = updateDatabase((draft) => {
    const template = draft.couponTemplates.find((item) => item.id === payload.templateId);
    const user = draft.users.find((item) => item.id === payload.userId);
    if (!template || !user) {
      return;
    }
    const record2 = createCouponRecord(template, user, payload.source ?? "manual");
    draft.couponRecords.unshift(record2);
    user.couponCount += 1;
  });
  const record = db.couponRecords[0];
  if (!record) {
    return Promise.reject(new Error("\u53D1\u5238\u5931\u8D25\uFF1A\u6A21\u677F\u6216\u7528\u6237\u4E0D\u5B58\u5728"));
  }
  return wait(record);
}
async function sendCouponsByRule() {
  const db = updateDatabase((draft) => {
    const generated = [];
    draft.users.forEach((user) => {
      const matchedTier = draft.couponRule.tiers.find(
        (tier) => tier.tier === user.tier && user.orderCount >= tier.minOrders && user.orderCount <= tier.maxOrders
      );
      if (!matchedTier || !matchedTier.couponTemplateId) return;
      const template = draft.couponTemplates.find((item) => item.id === matchedTier.couponTemplateId);
      if (!template || template.status !== "active") return;
      const record = createCouponRecord(template, user, "rule");
      generated.push(record);
      user.couponCount += 1;
    });
    draft.couponRecords = [...generated, ...draft.couponRecords];
  });
  const issuedAt = db.couponRecords[0]?.issuedAt;
  const records = issuedAt ? db.couponRecords.filter((item) => item.source === "rule" && item.issuedAt === issuedAt) : [];
  return wait(records);
}
export {
  createCouponTemplate,
  deleteCouponTemplate,
  listCouponRecords,
  listCouponTemplates,
  sendCoupon,
  sendCouponsByRule,
  updateCouponTemplate
};
