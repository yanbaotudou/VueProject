const staffRoute = {
  path: "staff",
  name: "Staff",
  component: () => import("@/views/staff/StaffView.vue"),
  meta: {
    title: "\u5458\u5DE5\u7BA1\u7406",
    icon: "Avatar",
    roles: ["manager"]
  }
};
var stdin_default = staffRoute;
export {
  stdin_default as default
};
