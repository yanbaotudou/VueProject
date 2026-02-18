const dashboardRoute = {
  path: "dashboard",
  name: "Dashboard",
  component: () => import("@/views/dashboard/DashboardView.vue"),
  meta: {
    title: "\u4EEA\u8868\u76D8",
    icon: "Odometer",
    roles: ["manager", "clerk"]
  }
};
var stdin_default = dashboardRoute;
export {
  stdin_default as default
};
