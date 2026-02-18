const storeRoute = {
  path: "store",
  name: "Store",
  component: () => import("@/views/store/StoreView.vue"),
  meta: {
    title: "\u5E97\u94FA\u4FE1\u606F",
    icon: "Shop",
    roles: ["manager"]
  }
};
var stdin_default = storeRoute;
export {
  stdin_default as default
};
