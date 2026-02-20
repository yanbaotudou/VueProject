import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import AppLayout from "@/layout/AppLayout.vue";
import dashboardRoute from "./modules/dashboard";
import storeRoute from "./modules/store";
import drinksRoute from "./modules/drinks";
import ordersRoute from "./modules/orders";
import rulesRoute from "./modules/rules";
import usersRoute from "./modules/users";
import couponsRoute from "./modules/coupons";
import reviewsRoute from "./modules/reviews";
import staffRoute from "./modules/staff";
import settingsRoute from "./modules/settings";
import { useAuthStore } from "@/stores/auth";
import { useUiStore } from "@/stores/ui";
import { pinia } from "@/stores";
const appChildrenRoutes = [
  dashboardRoute,
  storeRoute,
  drinksRoute,
  ordersRoute,
  rulesRoute,
  usersRoute,
  couponsRoute,
  reviewsRoute,
  staffRoute,
  settingsRoute
];
const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/LoginView.vue"),
    meta: {
      title: "\u767B\u5F55",
      public: true
    }
  },
  {
    path: "/",
    name: "Root",
    component: AppLayout,
    redirect: "/dashboard",
    children: appChildrenRoutes
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"),
    meta: {
      title: "\u9875\u9762\u4E0D\u5B58\u5728",
      public: true
    }
  }
];
const routerMode = import.meta.env.VITE_ROUTER_MODE || "history";
const router = createRouter({
  history: routerMode === "hash" ? createWebHashHistory(import.meta.env.BASE_URL) : createWebHistory(import.meta.env.BASE_URL),
  routes
});
function resolveFallbackPath(role) {
  const first = appChildrenRoutes.find((item) => {
    const roles = item.meta?.roles;
    return !roles || roles.includes(role);
  });
  return first ? `/${first.path}` : "/dashboard";
}
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore(pinia);
  const uiStore = useUiStore(pinia);
  uiStore.setGlobalLoading(true);
  if (!authStore.isLoggedIn && to.path !== "/login") {
    next({
      path: "/login",
      query: {
        redirect: to.fullPath
      }
    });
    return;
  }
  if (authStore.isLoggedIn && to.path === "/login") {
    next("/dashboard");
    return;
  }
  const routeRoles = to.meta.roles;
  if (routeRoles && authStore.isLoggedIn && !routeRoles.includes(authStore.role)) {
    next(resolveFallbackPath(authStore.role));
    return;
  }
  next();
});
router.afterEach(() => {
  const uiStore = useUiStore(pinia);
  uiStore.setGlobalLoading(false);
});
router.onError(() => {
  const uiStore = useUiStore(pinia);
  uiStore.setGlobalLoading(false);
});
var stdin_default = router;
export {
  appChildrenRoutes,
  stdin_default as default
};
