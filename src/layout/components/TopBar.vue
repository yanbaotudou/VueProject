<template>
  <div class="top-bar">
    <div class="left-area">
      <div v-if="isMobile" class="left-tools">
        <el-button text circle class="menu-btn" @click="emit('toggle-menu')">
          <el-icon><Menu /></el-icon>
        </el-button>
        <div class="mobile-title">{{ currentTitle }}</div>
      </div>

      <el-breadcrumb v-if="!isMobile" separator="/">
        <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">{{ item.meta.title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

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
import { Menu } from "@element-plus/icons-vue";
defineProps({
  isMobile: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(["toggle-menu"]);
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const settingsStore = useSettingsStore();
const currentTitle = computed(() => route.meta?.title || "管理端");
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

.left-area {
  display: flex;
  align-items: center;
  min-width: 0;
}

.left-tools {
  display: flex;
  align-items: center;
}

.mobile-title {
  margin-left: 6px;
  max-width: 45vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 15px;
  font-weight: 600;
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

@media (max-width: 992px) {
  .top-bar {
    padding: 0 12px;
  }

  .right-tools {
    gap: 8px;
  }

  .user-trigger {
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
