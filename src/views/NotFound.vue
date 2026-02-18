<template>
  <div class="not-found page-card">
    <el-empty description="页面不存在">
      <el-button type="primary" @click="$router.push('/dashboard')">回到仪表盘</el-button>
    </el-empty>
  </div>
</template>

<style scoped>
.not-found {
  height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
