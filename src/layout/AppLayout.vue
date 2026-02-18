<template>
  <el-container class="layout-wrap">
    <el-aside width="220px" class="layout-aside">
      <SideMenu />
    </el-aside>

    <el-container>
      <el-header class="layout-header">
        <TopBar />
      </el-header>
      <el-main class="layout-main">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup >

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
</style>
