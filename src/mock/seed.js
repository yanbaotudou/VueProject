import { dayOffset, formatDate } from "./common";
function resolveTier(orderCount) {
  if (orderCount <= 2) return "new";
  if (orderCount <= 10) return "regular";
  return "vip";
}
function createCategories() {
  return [
    { id: "cat_new", name: "\u65B0\u54C1", type: "new" },
    { id: "cat_fruit", name: "\u679C\u8336", type: "fruit-tea" },
    { id: "cat_milk", name: "\u5976\u8336", type: "milk-tea" },
    { id: "cat_coffee", name: "\u5496\u5561", type: "coffee" },
    { id: "cat_topping", name: "\u5C0F\u6599\u5206\u7C7B", type: "topping" }
  ];
}
function createDrinks() {
  const now = formatDate(/* @__PURE__ */ new Date());
  return [
    {
      id: "drink_001",
      categoryId: "cat_new",
      categoryName: "\u65B0\u54C1",
      name: "\u6D77\u76D0\u8309\u8389",
      attributes: {
        ingredients: ["\u8309\u8389\u8336\u5E95", "\u6D77\u76D0\u5976\u76D6"],
        sizes: [
          { name: "\u4E2D\u676F", price: 16 },
          { name: "\u5927\u676F", price: 19 }
        ],
        temps: ["\u70ED", "\u5E38\u6E29", "\u5C11\u51B0"],
        toppings: ["\u73CD\u73E0", "\u6930\u679C", "\u5976\u51BB"],
        remark: "\u82B1\u9999\u660E\u663E\uFF0C\u5976\u76D6\u504F\u54B8"
      },
      status: "on",
      createdAt: now,
      updatedAt: now
    },
    {
      id: "drink_002",
      categoryId: "cat_fruit",
      categoryName: "\u679C\u8336",
      name: "\u6EE1\u676F\u897F\u67DA",
      attributes: {
        ingredients: ["\u897F\u67DA\u679C\u8089", "\u7EFF\u8336"],
        sizes: [
          { name: "\u4E2D\u676F", price: 18 },
          { name: "\u5927\u676F", price: 22 }
        ],
        temps: ["\u53BB\u51B0", "\u5C11\u51B0", "\u5E38\u6E29"],
        toppings: ["\u897F\u7C73", "\u6930\u679C"],
        remark: "\u9178\u751C\u53E3\u611F"
      },
      status: "on",
      createdAt: now,
      updatedAt: now
    },
    {
      id: "drink_003",
      categoryId: "cat_milk",
      categoryName: "\u5976\u8336",
      name: "\u9ED1\u7CD6\u6CE2\u6CE2\u5976\u8336",
      attributes: {
        ingredients: ["\u7EA2\u8336", "\u9C9C\u5976", "\u9ED1\u7CD6\u6CE2\u6CE2"],
        sizes: [
          { name: "\u4E2D\u676F", price: 17 },
          { name: "\u5927\u676F", price: 20 }
        ],
        temps: ["\u70ED", "\u5E38\u6E29", "\u5C11\u51B0"],
        toppings: ["\u6CE2\u6CE2", "\u5976\u51BB", "\u5E03\u4E01"],
        remark: "\u9ED8\u8BA4\u534A\u7CD6"
      },
      status: "on",
      createdAt: now,
      updatedAt: now
    },
    {
      id: "drink_004",
      categoryId: "cat_milk",
      categoryName: "\u5976\u8336",
      name: "\u828B\u6CE5\u5575\u5575\u5976\u7EFF",
      attributes: {
        ingredients: ["\u5976\u7EFF", "\u828B\u6CE5", "\u6CE2\u6CE2"],
        sizes: [
          { name: "\u4E2D\u676F", price: 19 },
          { name: "\u5927\u676F", price: 23 }
        ],
        temps: ["\u70ED", "\u5E38\u6E29", "\u5C11\u51B0"],
        toppings: ["\u6CE2\u6CE2", "\u71D5\u9EA6"],
        remark: "\u828B\u6CE5\u6D53\u539A"
      },
      status: "on",
      createdAt: now,
      updatedAt: now
    },
    {
      id: "drink_005",
      categoryId: "cat_coffee",
      categoryName: "\u5496\u5561",
      name: "\u62FF\u94C1",
      attributes: {
        ingredients: ["\u610F\u5F0F\u6D53\u7F29", "\u725B\u5976"],
        sizes: [
          { name: "\u4E2D\u676F", price: 20 },
          { name: "\u5927\u676F", price: 24 }
        ],
        temps: ["\u70ED", "\u5C11\u51B0", "\u53BB\u51B0"],
        toppings: ["\u5976\u6CE1"],
        remark: "\u652F\u6301\u71D5\u9EA6\u5976+3\u5143"
      },
      status: "on",
      createdAt: now,
      updatedAt: now
    },
    {
      id: "drink_006",
      categoryId: "cat_coffee",
      categoryName: "\u5496\u5561",
      name: "\u7F8E\u5F0F",
      attributes: {
        ingredients: ["\u610F\u5F0F\u6D53\u7F29", "\u7EAF\u51C0\u6C34"],
        sizes: [
          { name: "\u4E2D\u676F", price: 15 },
          { name: "\u5927\u676F", price: 18 }
        ],
        temps: ["\u70ED", "\u5C11\u51B0", "\u53BB\u51B0"],
        toppings: ["\u67E0\u6AAC\u7247"],
        remark: "\u53EF\u52A0\u7CD6"
      },
      status: "on",
      createdAt: now,
      updatedAt: now
    },
    {
      id: "drink_007",
      categoryId: "cat_fruit",
      categoryName: "\u679C\u8336",
      name: "\u6768\u679D\u7518\u9732",
      attributes: {
        ingredients: ["\u8292\u679C", "\u897F\u67DA", "\u6930\u5976", "\u897F\u7C73"],
        sizes: [
          { name: "\u4E2D\u676F", price: 21 },
          { name: "\u5927\u676F", price: 25 }
        ],
        temps: ["\u5C11\u51B0", "\u53BB\u51B0"],
        toppings: ["\u897F\u7C73", "\u6930\u679C"],
        remark: "\u6930\u5976\u57FA\u5E95"
      },
      status: "on",
      createdAt: now,
      updatedAt: now
    },
    {
      id: "drink_008",
      categoryId: "cat_new",
      categoryName: "\u65B0\u54C1",
      name: "\u9752\u63D0\u51B0\u8403",
      attributes: {
        ingredients: ["\u9752\u63D0", "\u4E4C\u9F99\u8336"],
        sizes: [
          { name: "\u4E2D\u676F", price: 17 },
          { name: "\u5927\u676F", price: 21 }
        ],
        temps: ["\u5C11\u51B0", "\u53BB\u51B0"],
        toppings: ["\u5BD2\u5929\u6676\u7403", "\u6930\u679C"],
        remark: "\u6E05\u723D\u4F4E\u7CD6"
      },
      status: "off",
      createdAt: now,
      updatedAt: now
    }
  ];
}
function createUserBase() {
  return [
    { id: "user_001", name: "\u5F20\u6668", phone: "13800001001" },
    { id: "user_002", name: "\u674E\u8431", phone: "13800001002" },
    { id: "user_003", name: "\u738B\u660A", phone: "13800001003" },
    { id: "user_004", name: "\u8D75\u5A1C", phone: "13800001004" },
    { id: "user_005", name: "\u9648\u51EF", phone: "13800001005" },
    { id: "user_006", name: "\u5218\u6B23", phone: "13800001006" },
    { id: "user_007", name: "\u5B59\u5029", phone: "13800001007" },
    { id: "user_008", name: "\u5468\u5B87", phone: "13800001008" },
    { id: "user_009", name: "\u5434\u6960", phone: "13800001009" },
    { id: "user_010", name: "\u90D1\u60A6", phone: "13800001010" }
  ];
}
function createOrders(drinks) {
  const payments = ["wechat", "alipay", "cash"];
  const statuses = ["paid", "making", "ready", "completed", "cancelled"];
  const users = createUserBase();
  const result = [];
  for (let i = 0; i < 220; i += 1) {
    const drink = drinks[i % drinks.length];
    const user = users[i % users.length];
    const size = drink.attributes.sizes[i % drink.attributes.sizes.length];
    const temp = drink.attributes.temps[i % drink.attributes.temps.length];
    const topping = drink.attributes.toppings.slice(0, i % 2 + 1);
    const quantity = i % 3 + 1;
    const discount = i % 5 === 0 ? 3 : i % 11 === 0 ? 5 : 0;
    const amount = Math.max(size.price * quantity - discount, 1);
    const createdAt = dayOffset(i % 45);
    result.push({
      id: `order_${String(i + 1).padStart(4, "0")}`,
      orderNo: `NO${2026e5 + i}`,
      drinkId: drink.id,
      drinkName: drink.name,
      drinkAttributes: {
        size: size.name,
        temp,
        toppings: topping
      },
      payment: payments[i % payments.length],
      amount,
      discount,
      quantity,
      pickupCode: String(1e3 + i % 9e3),
      status: statuses[i % statuses.length],
      createdAt,
      userId: user.id,
      userName: user.name
    });
  }
  return result.sort((a, b) => a.createdAt > b.createdAt ? -1 : 1);
}
function createCouponTemplates() {
  return [
    {
      id: "coupon_tpl_001",
      name: "\u65B0\u4EBA\u9996\u5355\u7ACB\u51CF6\u5143",
      type: "full-reduction",
      threshold: 20,
      discountAmount: 6,
      validDays: 7,
      status: "active",
      createdAt: dayOffset(30)
    },
    {
      id: "coupon_tpl_002",
      name: "\u5E38\u5BA2\u6EE130\u51CF5",
      type: "full-reduction",
      threshold: 30,
      discountAmount: 5,
      validDays: 14,
      status: "active",
      createdAt: dayOffset(28)
    },
    {
      id: "coupon_tpl_003",
      name: "VIP 9\u6298\u5238",
      type: "discount",
      threshold: 0,
      discountPercent: 9,
      validDays: 20,
      status: "active",
      createdAt: dayOffset(26)
    }
  ];
}
function createCouponRule(templates) {
  return {
    tiers: [
      {
        id: "rule_tier_001",
        tier: "new",
        minOrders: 0,
        maxOrders: 2,
        windowDays: 7,
        couponTemplateId: templates[0].id,
        couponTemplateName: templates[0].name
      },
      {
        id: "rule_tier_002",
        tier: "regular",
        minOrders: 3,
        maxOrders: 10,
        windowDays: 30,
        couponTemplateId: templates[1].id,
        couponTemplateName: templates[1].name
      },
      {
        id: "rule_tier_003",
        tier: "vip",
        minOrders: 11,
        maxOrders: 999,
        windowDays: 30,
        couponTemplateId: templates[2].id,
        couponTemplateName: templates[2].name
      }
    ],
    updatedAt: formatDate(/* @__PURE__ */ new Date())
  };
}
function createUsers(orders) {
  const userBase = createUserBase();
  return userBase.map((user) => {
    const userOrders = orders.filter((order) => order.userId === user.id);
    const orderCount = userOrders.length;
    const latestOrder = userOrders[0]?.createdAt ?? dayOffset(90);
    return {
      ...user,
      orderCount,
      tier: resolveTier(orderCount),
      isNew: orderCount <= 1,
      lastOrderAt: latestOrder,
      couponCount: Math.max(1, Math.floor(orderCount / 4))
    };
  });
}
function createCouponRecords(users, templates) {
  const records = [];
  users.forEach((user, index) => {
    const template = user.tier === "new" ? templates[0] : user.tier === "regular" ? templates[1] : templates[2];
    records.push({
      id: `coupon_rec_${String(index + 1).padStart(3, "0")}`,
      templateId: template.id,
      templateName: template.name,
      userId: user.id,
      userName: user.name,
      source: "rule",
      status: index % 4 === 0 ? "used" : "issued",
      issuedAt: dayOffset(12 - index % 7),
      expiredAt: dayOffset(-(7 + index % 5))
    });
  });
  return records;
}
function createReviews(orders) {
  const sample = orders.slice(0, 24);
  return sample.map((order, index) => {
    const replied = index % 3 === 0;
    return {
      id: `review_${String(index + 1).padStart(3, "0")}`,
      userId: order.userId,
      userName: order.userName,
      orderId: order.id,
      drinkName: order.drinkName,
      rating: index % 5 + 1,
      content: index % 2 === 0 ? "\u53E3\u611F\u4E0D\u9519\uFF0C\u51FA\u676F\u901F\u5EA6\u5F88\u5FEB\u3002" : "\u5E0C\u671B\u751C\u5EA6\u9009\u9879\u80FD\u66F4\u7EC6\u4E00\u4E9B\uFF0C\u6574\u4F53\u8FD8\u53EF\u4EE5\u3002",
      createdAt: order.createdAt,
      status: replied ? "replied" : "pending",
      reply: replied ? {
        content: "\u611F\u8C22\u53CD\u9988\uFF0C\u6211\u4EEC\u4F1A\u6301\u7EED\u4F18\u5316\u51FA\u54C1\u4E0E\u670D\u52A1\u3002",
        replyAt: dayOffset(index % 10),
        staffName: "\u5E97\u957F-\u738B\u5E97"
      } : void 0
    };
  });
}
function createStaff() {
  return [
    {
      id: "staff_001",
      name: "\u738B\u5E97",
      phone: "13900002001",
      role: "manager",
      status: "enabled",
      username: "admin",
      password: "admin123",
      createdAt: dayOffset(120)
    },
    {
      id: "staff_002",
      name: "\u9648\u5E97\u5458",
      phone: "13900002002",
      role: "clerk",
      status: "enabled",
      username: "clerk",
      password: "clerk123",
      createdAt: dayOffset(90)
    }
  ];
}
function createStoreInfo() {
  return {
    id: "store_001",
    name: "\u8F7B\u996ELab\uFF08\u5355\u5E97\uFF09",
    address: "\u676D\u5DDE\u5E02\u897F\u6E56\u533A\u6587\u4E09\u8DEF 88 \u53F7",
    phone: "0571-88886666",
    businessHours: "09:00-22:00",
    status: "open",
    notice: "\u65B0\u54C1\u6D77\u76D0\u8309\u8389\u4E0A\u7EBF\uFF0C\u7B2C\u4E8C\u676F\u534A\u4EF7\uFF08\u6D3B\u52A8\u4EC5\u9650\u5468\u672B\uFF09"
  };
}
function createSeedDatabase() {
  const categories = createCategories();
  const drinks = createDrinks();
  const orders = createOrders(drinks);
  const couponTemplates = createCouponTemplates();
  const users = createUsers(orders);
  return {
    storeInfo: createStoreInfo(),
    drinkCategories: categories,
    drinks,
    orders,
    nextDayRule: {
      windowDays: 7,
      recentWeight: 0.7,
      trendWeight: 0.3,
      minStock: 8,
      maxStock: 120,
      updatedAt: formatDate(/* @__PURE__ */ new Date())
    },
    couponRule: createCouponRule(couponTemplates),
    couponTemplates,
    couponRecords: createCouponRecords(users, couponTemplates),
    users,
    reviews: createReviews(orders),
    staff: createStaff(),
    settings: {
      theme: "light",
      systemName: "\u8F7B\u996ELab \u7BA1\u7406\u7AEF",
      contactEmail: "ops@qingyinlab.test"
    }
  };
}
export {
  createSeedDatabase
};
