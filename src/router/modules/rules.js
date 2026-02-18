const rulesRoute = {
  path: "rules",
  name: "Rules",
  component: () => import("@/views/rules/RulesView.vue"),
  meta: {
    title: "\u89C4\u5219\u7BA1\u7406",
    icon: "SetUp",
    roles: ["manager"]
  }
};
var stdin_default = rulesRoute;
export {
  stdin_default as default
};
