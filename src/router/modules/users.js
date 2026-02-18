const usersRoute = {
  path: "users",
  name: "Users",
  component: () => import("@/views/users/UsersView.vue"),
  meta: {
    title: "\u7528\u6237\u5206\u6790",
    icon: "User",
    roles: ["manager"]
  }
};
var stdin_default = usersRoute;
export {
  stdin_default as default
};
