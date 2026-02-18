const drinksRoute = {
  path: "drinks",
  name: "Drinks",
  component: () => import("@/views/drinks/DrinksView.vue"),
  meta: {
    title: "\u996E\u54C1\u7BA1\u7406",
    icon: "CoffeeCup",
    roles: ["manager", "clerk"]
  }
};
var stdin_default = drinksRoute;
export {
  stdin_default as default
};
