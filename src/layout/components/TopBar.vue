<template>
  <div class="top-bar">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">{{ item.meta.title }}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="right-tools">
      <el-switch
        :model-value="settingsStore.theme === 'dark'"
        inline-prompt
        active-text="暗"
        inactive-text="亮"
        @change="onThemeChange"
      />
      <el-dropdown>
        <span class="user-trigger">
          {{ authStore.displayName || '未登录用户' }}
          <el-icon><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup >
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useSettingsStore } from "@/stores/settings";
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const settingsStore = useSettingsStore();
const breadcrumbs = computed(
  () => route.matched.filter((item) => item.meta?.title && item.path !== "/").map((item) => ({
    path: item.path,
    meta: item.meta
  }))
);
function logout() {
  authStore.logout();
  router.push("/login");
}
function onThemeChange() {
  settingsStore.toggleTheme();
}
</script>

<style scoped>
.top-bar {
  height: var(--header-height);
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.right-tools {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: var(--text-primary);
  user-select: none;
}
</style>
