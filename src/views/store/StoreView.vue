<template>
  <div>
    <PageHeader title="店铺信息" description="维护店铺基础信息与营业状态。" />

    <el-card class="page-card" shadow="never">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        style="max-width: 760px"
      >
        <el-form-item label="店铺名称" prop="name">
          <el-input v-model="form.name" maxlength="30" show-word-limit />
        </el-form-item>

        <el-form-item label="店铺地址" prop="address">
          <el-input v-model="form.address" maxlength="60" show-word-limit />
        </el-form-item>

        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="例如 0571-88886666" />
        </el-form-item>

        <el-form-item label="营业时间" prop="businessHours">
          <el-input v-model="form.businessHours" placeholder="例如 09:00-22:00" />
        </el-form-item>

        <el-form-item label="营业状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio-button value="open">营业中</el-radio-button>
            <el-radio-button value="closed">已打烊</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="店铺公告" prop="notice">
          <el-input v-model="form.notice" type="textarea" :rows="3" maxlength="100" show-word-limit />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="storeInfoStore.loading" @click="onSubmit">保存</el-button>
          <el-button @click="loadData">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup >
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useStoreInfoStore } from "@/stores/storeInfo";
const storeInfoStore = useStoreInfoStore();
const formRef = ref();
const form = reactive({
  id: "",
  name: "",
  address: "",
  phone: "",
  businessHours: "",
  status: "open",
  notice: ""
});
const rules = {
  name: [
    { required: true, message: "\u8BF7\u8F93\u5165\u5E97\u94FA\u540D\u79F0", trigger: "blur" },
    { min: 2, max: 30, message: "\u957F\u5EA6\u9700\u5728 2-30 \u4E2A\u5B57\u7B26", trigger: "blur" }
  ],
  address: [{ required: true, message: "\u8BF7\u8F93\u5165\u5E97\u94FA\u5730\u5740", trigger: "blur" }],
  phone: [
    { required: true, message: "\u8BF7\u8F93\u5165\u8054\u7CFB\u7535\u8BDD", trigger: "blur" },
    {
      pattern: /^([0-9-]{7,15})$/,
      message: "\u8054\u7CFB\u7535\u8BDD\u683C\u5F0F\u4E0D\u6B63\u786E",
      trigger: "blur"
    }
  ],
  businessHours: [
    { required: true, message: "\u8BF7\u8F93\u5165\u8425\u4E1A\u65F6\u95F4", trigger: "blur" },
    {
      pattern: /^\d{2}:\d{2}-\d{2}:\d{2}$/,
      message: "\u683C\u5F0F\u5E94\u4E3A 09:00-22:00",
      trigger: "blur"
    }
  ]
};
async function loadData() {
  try {
    await storeInfoStore.fetchStoreInfo();
    Object.assign(form, storeInfoStore.info);
  } catch (error) {
    ElMessage.error(error?.message ?? "\u52A0\u8F7D\u5E97\u94FA\u4FE1\u606F\u5931\u8D25");
  }
}
async function onSubmit() {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
    await storeInfoStore.saveStoreInfo(form);
    ElMessage.success("\u5E97\u94FA\u4FE1\u606F\u5DF2\u4FDD\u5B58");
  } catch (error) {
    ElMessage.error(error?.message ?? "\u4FDD\u5B58\u5931\u8D25");
  }
}
loadData();
</script>
