const ordersRoute = {
  path: "orders",
  name: "Orders",
  component: () => import("@/views/orders/OrdersView.vue"),
  meta: {
    title: "\u8BA2\u5355\u7BA1\u7406",
    icon: "List",
    roles: ["manager", "clerk"]
  }
};
var stdin_default = ordersRoute;
export {
  stdin_default as default
};
