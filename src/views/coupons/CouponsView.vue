<template>
  <div>
    <PageHeader title="优惠券管理" description="维护优惠券模板、发放记录，并支持手动发券。">
      <el-button type="primary" @click="openTemplateDialog()">新增模板</el-button>
      <el-button type="success" @click="openSendDialog">手动发券</el-button>
    </PageHeader>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="模板管理" name="templates">
        <el-card class="page-card page-toolbar" shadow="never">
          <el-form :inline="true" :model="templateSearch">
            <el-form-item label="关键词">
              <el-input v-model="templateSearch.keyword" placeholder="模板名称" clearable />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="loadTemplates(true)">查询</el-button>
              <el-button @click="resetTemplateSearch">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card class="page-card page-table" shadow="never">
          <el-table v-loading="couponsStore.loading" :data="couponsStore.templates" border>
            <el-table-column prop="name" label="模板名称" min-width="170" />
            <el-table-column label="类型" width="100">
              <template #default="scope">
                {{ scope.row.type === 'full-reduction' ? '满减券' : '折扣券' }}
              </template>
            </el-table-column>
            <el-table-column label="优惠规则" min-width="180">
              <template #default="scope">
                {{ templateRuleText(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column prop="validDays" label="有效期(天)" width="100" />
            <el-table-column label="状态" width="90">
              <template #default="scope">
                <el-tag :type="scope.row.status === 'active' ? 'success' : 'info'">
                  {{ scope.row.status === 'active' ? '启用' : '停用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" width="170" />
            <el-table-column label="操作" width="140" fixed="right">
              <template #default="scope">
                <el-button link type="primary" @click="openTemplateDialog(scope.row)">编辑</el-button>
                <el-popconfirm title="确认删除模板？" @confirm="removeTemplate(scope.row.id)">
                  <template #reference>
                    <el-button link type="danger">删除</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>

            <template #empty>
              <el-empty description="暂无模板" />
            </template>
          </el-table>

          <div style="display: flex; justify-content: flex-end; margin-top: 16px">
            <el-pagination
              background
              layout="total, prev, pager, next, sizes"
              :current-page="couponsStore.templateQuery.page"
              :page-size="couponsStore.templateQuery.pageSize"
              :page-sizes="[10, 20, 50]"
              :total="couponsStore.templatesTotal"
              @current-change="(page) => loadTemplates(false, page, couponsStore.templateQuery.pageSize)"
              @size-change="(size) => loadTemplates(false, 1, size)"
            />
          </div>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="发放记录" name="records">
        <el-card class="page-card page-toolbar" shadow="never">
          <el-form :inline="true" :model="recordSearch">
            <el-form-item label="用户名称">
              <el-input v-model="recordSearch.userName" placeholder="请输入用户名称" clearable />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="loadRecords(true)">查询</el-button>
              <el-button @click="resetRecordSearch">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card class="page-card page-table" shadow="never">
          <el-table v-loading="couponsStore.loading" :data="couponsStore.records" border>
            <el-table-column prop="templateName" label="模板" min-width="160" />
            <el-table-column prop="userName" label="用户" min-width="100" />
            <el-table-column label="来源" width="90">
              <template #default="scope">{{ scope.row.source === 'manual' ? '手动' : '规则' }}</template>
            </el-table-column>
            <el-table-column label="状态" width="90">
              <template #default="scope">
                <el-tag>{{ statusText(scope.row.status) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="issuedAt" label="发放时间" width="170" />
            <el-table-column prop="expiredAt" label="过期时间" width="170" />

            <template #empty>
              <el-empty description="暂无发放记录" />
            </template>
          </el-table>

          <div style="display: flex; justify-content: flex-end; margin-top: 16px">
            <el-pagination
              background
              layout="total, prev, pager, next, sizes"
              :current-page="couponsStore.recordQuery.page"
              :page-size="couponsStore.recordQuery.pageSize"
              :page-sizes="[10, 20, 50]"
              :total="couponsStore.recordsTotal"
              @current-change="(page) => loadRecords(false, page, couponsStore.recordQuery.pageSize)"
              @size-change="(size) => loadRecords(false, 1, size)"
            />
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="templateDialogVisible" :title="editingTemplateId ? '编辑模板' : '新增模板'" width="560px">
      <el-form ref="templateFormRef" :model="templateForm" :rules="templateRules" label-width="100px">
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="templateForm.name" maxlength="30" show-word-limit />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="templateForm.type">
            <el-radio-button value="full-reduction">满减券</el-radio-button>
            <el-radio-button value="discount">折扣券</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="使用门槛" prop="threshold">
          <el-input-number v-model="templateForm.threshold" :min="0" :max="999" />
        </el-form-item>
        <el-form-item v-if="templateForm.type === 'full-reduction'" label="减免金额" prop="discountAmount">
          <el-input-number v-model="templateForm.discountAmount" :min="1" :max="999" />
        </el-form-item>
        <el-form-item v-else label="折扣力度" prop="discountPercent">
          <el-input-number v-model="templateForm.discountPercent" :min="1" :max="9.9" :step="0.1" />
        </el-form-item>
        <el-form-item label="有效期天数" prop="validDays">
          <el-input-number v-model="templateForm.validDays" :min="1" :max="90" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="templateForm.status">
            <el-radio-button value="active">启用</el-radio-button>
            <el-radio-button value="inactive">停用</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="templateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitTemplate">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="sendDialogVisible" title="手动发券" width="520px">
      <el-form ref="sendFormRef" :model="sendForm" :rules="sendRules" label-width="90px">
        <el-form-item label="用户" prop="userId">
          <el-select v-model="sendForm.userId" filterable placeholder="请选择用户" style="width: 100%">
            <el-option v-for="item in usersStore.list" :key="item.id" :label="`${item.name} (${item.phone})`" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="模板" prop="templateId">
          <el-select v-model="sendForm.templateId" placeholder="请选择模板" style="width: 100%">
            <el-option
              v-for="item in couponsStore.templates"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="sendDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitSend">发放</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup >
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useCouponsStore } from "@/stores/coupons";
import { useUsersStore } from "@/stores/users";
const couponsStore = useCouponsStore();
const usersStore = useUsersStore();
const activeTab = ref("templates");
const templateSearch = reactive({ keyword: "" });
const recordSearch = reactive({ userName: "" });
const templateDialogVisible = ref(false);
const editingTemplateId = ref("");
const templateFormRef = ref();
const templateForm = reactive({
  name: "",
  type: "full-reduction",
  threshold: 0,
  discountAmount: 3,
  discountPercent: 9,
  validDays: 7,
  status: "active"
});
const templateRules = {
  name: [{ required: true, message: "\u8BF7\u8F93\u5165\u6A21\u677F\u540D\u79F0", trigger: "blur" }],
  type: [{ required: true, message: "\u8BF7\u9009\u62E9\u7C7B\u578B", trigger: "change" }],
  validDays: [{ required: true, message: "\u8BF7\u8F93\u5165\u6709\u6548\u671F", trigger: "change" }]
};
const sendDialogVisible = ref(false);
const sendFormRef = ref();
const sendForm = reactive({
  userId: "",
  templateId: ""
});
const sendRules = {
  userId: [{ required: true, message: "\u8BF7\u9009\u62E9\u7528\u6237", trigger: "change" }],
  templateId: [{ required: true, message: "\u8BF7\u9009\u62E9\u6A21\u677F", trigger: "change" }]
};
function statusText(status) {
  if (status === "issued") return "\u5DF2\u53D1\u653E";
  if (status === "used") return "\u5DF2\u4F7F\u7528";
  return "\u5DF2\u8FC7\u671F";
}
function templateRuleText(row) {
  if (row.type === "full-reduction") {
    return `\u6EE1${row.threshold}\u51CF${row.discountAmount}`;
  }
  return `${row.discountPercent}\u6298`;
}
async function loadTemplates(resetPage = false, page, pageSize) {
  try {
    await couponsStore.fetchTemplates({
      page: page ?? (resetPage ? 1 : couponsStore.templateQuery.page),
      pageSize: pageSize ?? couponsStore.templateQuery.pageSize,
      keyword: templateSearch.keyword
    });
  } catch (error) {
    ElMessage.error(error?.message ?? "\u52A0\u8F7D\u6A21\u677F\u5931\u8D25");
  }
}
async function loadRecords(resetPage = false, page, pageSize) {
  try {
    await couponsStore.fetchRecords({
      page: page ?? (resetPage ? 1 : couponsStore.recordQuery.page),
      pageSize: pageSize ?? couponsStore.recordQuery.pageSize,
      userName: recordSearch.userName
    });
  } catch (error) {
    ElMessage.error(error?.message ?? "\u52A0\u8F7D\u8BB0\u5F55\u5931\u8D25");
  }
}
function resetTemplateSearch() {
  templateSearch.keyword = "";
  loadTemplates(true);
}
function resetRecordSearch() {
  recordSearch.userName = "";
  loadRecords(true);
}
function resetTemplateForm() {
  templateForm.name = "";
  templateForm.type = "full-reduction";
  templateForm.threshold = 0;
  templateForm.discountAmount = 3;
  templateForm.discountPercent = 9;
  templateForm.validDays = 7;
  templateForm.status = "active";
}
function openTemplateDialog(row) {
  if (row) {
    editingTemplateId.value = row.id;
    templateForm.name = row.name;
    templateForm.type = row.type;
    templateForm.threshold = row.threshold;
    templateForm.discountAmount = row.discountAmount ?? 3;
    templateForm.discountPercent = row.discountPercent ?? 9;
    templateForm.validDays = row.validDays;
    templateForm.status = row.status;
  } else {
    editingTemplateId.value = "";
    resetTemplateForm();
  }
  templateDialogVisible.value = true;
}
async function submitTemplate() {
  if (!templateFormRef.value) return;
  try {
    await templateFormRef.value.validate();
    const payload = {
      name: templateForm.name,
      type: templateForm.type,
      threshold: templateForm.threshold,
      discountAmount: templateForm.type === "full-reduction" ? templateForm.discountAmount : void 0,
      discountPercent: templateForm.type === "discount" ? templateForm.discountPercent : void 0,
      validDays: templateForm.validDays,
      status: templateForm.status
    };
    if (editingTemplateId.value) {
      await couponsStore.updateTemplate(editingTemplateId.value, payload);
      ElMessage.success("\u6A21\u677F\u5DF2\u66F4\u65B0");
    } else {
      await couponsStore.createTemplate(payload);
      ElMessage.success("\u6A21\u677F\u5DF2\u521B\u5EFA");
    }
    templateDialogVisible.value = false;
  } catch (error) {
    ElMessage.error(error?.message ?? "\u4FDD\u5B58\u5931\u8D25");
  }
}
async function removeTemplate(id) {
  try {
    await couponsStore.removeTemplate(id);
    ElMessage.success("\u6A21\u677F\u5DF2\u5220\u9664");
  } catch (error) {
    ElMessage.error(error?.message ?? "\u5220\u9664\u5931\u8D25");
  }
}
async function openSendDialog() {
  await usersStore.fetchList({ page: 1, pageSize: 200 });
  if (!couponsStore.templates.length) {
    ElMessage.warning("\u8BF7\u5148\u521B\u5EFA\u4F18\u60E0\u5238\u6A21\u677F");
    return;
  }
  sendForm.userId = "";
  sendForm.templateId = "";
  sendDialogVisible.value = true;
}
async function submitSend() {
  if (!sendFormRef.value) return;
  try {
    await sendFormRef.value.validate();
    await couponsStore.sendCoupon({
      userId: sendForm.userId,
      templateId: sendForm.templateId,
      source: "manual"
    });
    ElMessage.success("\u53D1\u5238\u6210\u529F");
    sendDialogVisible.value = false;
    activeTab.value = "records";
    await loadRecords(true);
  } catch (error) {
    ElMessage.error(error?.message ?? "\u53D1\u5238\u5931\u8D25");
  }
}
async function init() {
  await Promise.all([loadTemplates(true), loadRecords(true)]);
}
init();
</script>
