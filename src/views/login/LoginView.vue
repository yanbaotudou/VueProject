<template>
  <div class="login-page">
    <div class="login-card">
      <h1>单店铺运营管理端</h1>
      <p class="sub">饮品管理系统</p>

      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keyup.enter="onSubmit">
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" placeholder="请输入账号" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" type="password" show-password />
        </el-form-item>

        <el-button type="primary" class="submit-btn" :loading="loading" @click="onSubmit">登录</el-button>
      </el-form>

      <div class="tips">
        <p>店长账号：`admin / admin123`</p>
        <p>店员账号：`clerk / clerk123`</p>
      </div>
    </div>
  </div>
</template>

<script setup >
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useAuthStore } from "@/stores/auth";
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const loading = ref(false);
const formRef = ref();
const form = reactive({
  username: "admin",
  password: "admin123"
});
const rules = {
  username: [
    { required: true, message: "\u8BF7\u8F93\u5165\u8D26\u53F7", trigger: "blur" },
    { min: 3, max: 20, message: "\u8D26\u53F7\u957F\u5EA6\u9700\u5728 3-20 \u4F4D", trigger: "blur" }
  ],
  password: [
    { required: true, message: "\u8BF7\u8F93\u5165\u5BC6\u7801", trigger: "blur" },
    { min: 6, max: 20, message: "\u5BC6\u7801\u957F\u5EA6\u9700\u5728 6-20 \u4F4D", trigger: "blur" }
  ]
};
async function onSubmit() {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
    loading.value = true;
    await authStore.login(form.username, form.password);
    ElMessage.success("\u767B\u5F55\u6210\u529F");
    const redirect = route.query.redirect || "/dashboard";
    router.push(redirect);
  } catch (error) {
    ElMessage.error(error?.message ?? "\u767B\u5F55\u5931\u8D25");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-page {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 15% 20%, rgba(15, 118, 110, 0.28), transparent 45%),
    radial-gradient(circle at 85% 80%, rgba(30, 64, 175, 0.18), transparent 45%),
    #f0f5f9;
}

.login-card {
  width: 420px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.75);
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
}

h1 {
  margin: 0;
  font-size: 26px;
}

.sub {
  margin: 8px 0 24px;
  color: #64748b;
}

.submit-btn {
  width: 100%;
  margin-top: 8px;
}

.tips {
  margin-top: 20px;
  padding: 10px 12px;
  background: #f0fdfa;
  border: 1px solid #ccfbf1;
  border-radius: 8px;
  color: #115e59;
  font-size: 12px;
}

.tips p {
  margin: 2px 0;
}
</style>
