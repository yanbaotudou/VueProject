<template>
  <div>
    <PageHeader title="员工管理" description="管理员工账号、角色权限与启用状态。">
      <el-button type="primary" @click="openDialog()">新增员工</el-button>
    </PageHeader>

    <el-card class="page-card page-toolbar" shadow="never">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="姓名/手机号/用户名" clearable />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="searchForm.role" clearable placeholder="全部" style="width: 120px">
            <el-option label="店长" value="manager" />
            <el-option label="店员" value="clerk" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" clearable placeholder="全部" style="width: 120px">
            <el-option label="启用" value="enabled" />
            <el-option label="禁用" value="disabled" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData(true)">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="page-card page-table" shadow="never">
      <el-table v-loading="staffStore.loading" :data="staffStore.list" border>
        <el-table-column prop="name" label="姓名" min-width="100" />
        <el-table-column prop="phone" label="手机号" min-width="130" />
        <el-table-column prop="username" label="登录账号" min-width="120" />
        <el-table-column label="角色" width="90">
          <template #default="scope">
            {{ scope.row.role === 'manager' ? '店长' : '店员' }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'enabled' ? 'success' : 'danger'">
              {{ scope.row.status === 'enabled' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="170" />
        <el-table-column label="操作" width="260" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="openDialog(scope.row)">编辑</el-button>
            <el-button link type="warning" @click="toggleStatus(scope.row.id)">
              {{ scope.row.status === 'enabled' ? '禁用' : '启用' }}
            </el-button>
            <el-popconfirm title="确认删除该员工？" @confirm="removeStaff(scope.row.id)">
              <template #reference>
                <el-button link type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>

        <template #empty>
          <el-empty description="暂无员工数据" />
        </template>
      </el-table>

      <div style="display: flex; justify-content: flex-end; margin-top: 16px">
        <el-pagination
          background
          layout="total, prev, pager, next, sizes"
          :current-page="staffStore.query.page"
          :page-size="staffStore.query.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="staffStore.total"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑员工' : '新增员工'" width="520px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-radio-group v-model="form.role">
            <el-radio-button value="manager">店长</el-radio-button>
            <el-radio-button value="clerk">店员</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" maxlength="20" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" show-password maxlength="20" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio-button value="enabled">启用</el-radio-button>
            <el-radio-button value="disabled">禁用</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup >
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useStaffStore } from "@/stores/staff";
const staffStore = useStaffStore();
const searchForm = reactive({
  keyword: "",
  role: "",
  status: ""
});
const dialogVisible = ref(false);
const editingId = ref("");
const formRef = ref();
const form = reactive({
  name: "",
  phone: "",
  role: "clerk",
  status: "enabled",
  username: "",
  password: ""
});
const rules = {
  name: [
    { required: true, message: "\u8BF7\u8F93\u5165\u59D3\u540D", trigger: "blur" },
    { min: 2, max: 20, message: "\u957F\u5EA6\u9700\u5728 2-20 \u5B57", trigger: "blur" }
  ],
  phone: [
    { required: true, message: "\u8BF7\u8F93\u5165\u624B\u673A\u53F7", trigger: "blur" },
    { pattern: /^1\d{10}$/, message: "\u624B\u673A\u53F7\u683C\u5F0F\u4E0D\u6B63\u786E", trigger: "blur" }
  ],
  role: [{ required: true, message: "\u8BF7\u9009\u62E9\u89D2\u8272", trigger: "change" }],
  username: [
    { required: true, message: "\u8BF7\u8F93\u5165\u8D26\u53F7", trigger: "blur" },
    { min: 3, max: 20, message: "\u8D26\u53F7\u957F\u5EA6\u9700\u5728 3-20 \u4F4D", trigger: "blur" }
  ],
  password: [
    { required: true, message: "\u8BF7\u8F93\u5165\u5BC6\u7801", trigger: "blur" },
    { min: 6, max: 20, message: "\u5BC6\u7801\u957F\u5EA6\u9700\u5728 6-20 \u4F4D", trigger: "blur" }
  ]
};
function resetForm() {
  form.name = "";
  form.phone = "";
  form.role = "clerk";
  form.status = "enabled";
  form.username = "";
  form.password = "";
}
async function loadData(resetPage = false, page, pageSize) {
  try {
    await staffStore.fetchList({
      page: page ?? (resetPage ? 1 : staffStore.query.page),
      pageSize: pageSize ?? staffStore.query.pageSize,
      keyword: searchForm.keyword,
      role: searchForm.role || void 0,
      status: searchForm.status || void 0
    });
  } catch (error) {
    ElMessage.error(error?.message ?? "\u52A0\u8F7D\u5458\u5DE5\u6570\u636E\u5931\u8D25");
  }
}
function handlePageChange(page) {
  loadData(false, page, staffStore.query.pageSize);
}
function handleSizeChange(size) {
  loadData(false, 1, size);
}
function resetSearch() {
  searchForm.keyword = "";
  searchForm.role = "";
  searchForm.status = "";
  loadData(true);
}
function openDialog(row) {
  if (row) {
    editingId.value = row.id;
    form.name = row.name;
    form.phone = row.phone;
    form.role = row.role;
    form.status = row.status;
    form.username = row.username;
    form.password = row.password;
  } else {
    editingId.value = "";
    resetForm();
  }
  dialogVisible.value = true;
}
async function submit() {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
    if (editingId.value) {
      await staffStore.update(editingId.value, { ...form });
      ElMessage.success("\u5458\u5DE5\u4FE1\u606F\u5DF2\u66F4\u65B0");
    } else {
      await staffStore.create({ ...form });
      ElMessage.success("\u5458\u5DE5\u5DF2\u65B0\u589E");
    }
    dialogVisible.value = false;
  } catch (error) {
    ElMessage.error(error?.message ?? "\u63D0\u4EA4\u5931\u8D25");
  }
}
async function toggleStatus(id) {
  try {
    await staffStore.toggle(id);
    ElMessage.success("\u72B6\u6001\u5DF2\u66F4\u65B0");
  } catch (error) {
    ElMessage.error(error?.message ?? "\u64CD\u4F5C\u5931\u8D25");
  }
}
async function removeStaff(id) {
  try {
    await staffStore.remove(id);
    ElMessage.success("\u5DF2\u5220\u9664\u5458\u5DE5");
  } catch (error) {
    ElMessage.error(error?.message ?? "\u5220\u9664\u5931\u8D25");
  }
}
loadData(true);
</script>
