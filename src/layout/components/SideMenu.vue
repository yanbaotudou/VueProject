<template>
  <div class="side-wrap">
    <div class="logo">饮品管理系统</div>
    <el-menu :default-active="activePath" class="menu" router>
      <el-menu-item v-for="routeItem in visibleMenus" :key="routeItem.name" :index="`/${routeItem.path}`">
        <el-icon>
          <component :is="routeItem.meta?.icon" />
        </el-icon>
        <span>{{ routeItem.meta?.title }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup >
import { computed } from "vue";
import { useRoute } from "vue-router";
import { appChildrenRoutes } from "@/router";
import { useAuthStore } from "@/stores/auth";
const route = useRoute();
const authStore = useAuthStore();
const activePath = computed(() => {
  return route.path;
});
const visibleMenus = computed(() => {
  return appChildrenRoutes.filter((item) => {
    const roles = item.meta?.roles;
    if (!roles || roles.length === 0) return true;
    return roles.includes(authStore.role);
  });
});
</script>

<style scoped>
.side-wrap {
  height: 100%;
  background: linear-gradient(180deg, #0f766e 0%, #115e59 100%);
  color: #fff;
  overflow: hidden;
}

.logo {
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 1px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
}

.menu {
  border-right: none;
  background: transparent;
}

:deep(.el-menu-item) {
  color: rgba(255, 255, 255, 0.85);
}

:deep(.el-menu-item.is-active) {
  background: rgba(255, 255, 255, 0.16);
  color: #ffffff;
}

:deep(.el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.12);
}

:deep(.el-menu-item .el-icon) {
  color: inherit;
}
</style>
