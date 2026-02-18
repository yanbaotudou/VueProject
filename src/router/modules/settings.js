const settingsRoute = {
  path: "settings",
  name: "Settings",
  component: () => import("@/views/settings/SettingsView.vue"),
  meta: {
    title: "\u7CFB\u7EDF\u8BBE\u7F6E",
    icon: "Setting",
    roles: ["manager", "clerk"]
  }
};
var stdin_default = settingsRoute;
export {
  stdin_default as default
};
