<template>
  <el-container class="layout-wrap">
    <el-aside v-if="!isMobile" width="220px" class="layout-aside">
      <SideMenu />
    </el-aside>

    <el-container>
      <el-header class="layout-header">
        <TopBar :is-mobile="isMobile" @toggle-menu="drawerVisible = true" />
      </el-header>
      <el-main class="layout-main">
        <RouterView />
      </el-main>
    </el-container>

    <el-drawer
      v-if="isMobile"
      v-model="drawerVisible"
      direction="ltr"
      size="220px"
      :with-header="false"
      append-to-body
      class="mobile-menu-drawer"
    >
      <SideMenu @menu-click="drawerVisible = false" />
    </el-drawer>
  </el-container>
</template>

<script setup >
import { onBeforeUnmount, onMounted, ref } from "vue";
const drawerVisible = ref(false);
const isMobile = ref(false);
function updateLayoutMode() {
  isMobile.value = window.innerWidth <= 992;
  if (!isMobile.value) {
    drawerVisible.value = false;
  }
}
onMounted(() => {
  updateLayoutMode();
  window.addEventListener("resize", updateLayoutMode);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateLayoutMode);
});
</script>

<style scoped>
.layout-wrap {
  width: 100%;
  height: 100%;
}

.layout-aside {
  background: transparent;
}

.layout-header {
  padding: 0;
  height: var(--header-height);
}

.layout-main {
  background: var(--bg-page);
  padding: 16px;
}

:deep(.mobile-menu-drawer .el-drawer__body) {
  padding: 0;
}

@media (max-width: 992px) {
  .layout-main {
    padding: 10px;
  }
}
</style>
