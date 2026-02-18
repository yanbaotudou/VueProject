const couponsRoute = {
  path: "coupons",
  name: "Coupons",
  component: () => import("@/views/coupons/CouponsView.vue"),
  meta: {
    title: "\u4F18\u60E0\u5238\u7BA1\u7406",
    icon: "Ticket",
    roles: ["manager"]
  }
};
var stdin_default = couponsRoute;
export {
  stdin_default as default
};
