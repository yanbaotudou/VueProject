<template>
  <div>
    <PageHeader title="系统设置" description="管理主题与系统基础信息。" />

    <el-card class="page-card" shadow="never">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" style="max-width: 680px">
        <el-form-item label="系统名称" prop="systemName">
          <el-input v-model="form.systemName" maxlength="30" show-word-limit />
        </el-form-item>

        <el-form-item label="联系邮箱" prop="contactEmail">
          <el-input v-model="form.contactEmail" />
        </el-form-item>

        <el-form-item label="主题模式" prop="theme">
          <el-radio-group v-model="form.theme">
            <el-radio-button value="light">浅色</el-radio-button>
            <el-radio-button value="dark">深色</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="settingsStore.loading" @click="save">保存设置</el-button>
          <el-button @click="loadData">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup >
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useSettingsStore } from "@/stores/settings";
const settingsStore = useSettingsStore();
const formRef = ref();
const form = reactive({
  theme: "light",
  systemName: "",
  contactEmail: ""
});
const rules = {
  systemName: [{ required: true, message: "\u8BF7\u8F93\u5165\u7CFB\u7EDF\u540D\u79F0", trigger: "blur" }],
  contactEmail: [
    { required: true, message: "\u8BF7\u8F93\u5165\u8054\u7CFB\u90AE\u7BB1", trigger: "blur" },
    { type: "email", message: "\u90AE\u7BB1\u683C\u5F0F\u4E0D\u6B63\u786E", trigger: "blur" }
  ]
};
async function loadData() {
  try {
    await settingsStore.fetchSettings();
    Object.assign(form, settingsStore.settings);
  } catch (error) {
    ElMessage.error(error?.message ?? "\u52A0\u8F7D\u8BBE\u7F6E\u5931\u8D25");
  }
}
async function save() {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
    await settingsStore.saveSettings({ ...form });
    ElMessage.success("\u8BBE\u7F6E\u5DF2\u4FDD\u5B58");
  } catch (error) {
    ElMessage.error(error?.message ?? "\u4FDD\u5B58\u5931\u8D25");
  }
}
loadData();
</script>
