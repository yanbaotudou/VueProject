const reviewsRoute = {
  path: "reviews",
  name: "Reviews",
  component: () => import("@/views/reviews/ReviewsView.vue"),
  meta: {
    title: "\u8BC4\u8BBA\u7BA1\u7406",
    icon: "ChatDotRound",
    roles: ["manager", "clerk"]
  }
};
var stdin_default = reviewsRoute;
export {
  stdin_default as default
};
