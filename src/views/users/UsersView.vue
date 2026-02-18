<template>
  <div>
    <PageHeader title="用户分析" description="查看用户下单次数、分层标签与发券记录联动。">
      <el-button type="primary" @click="autoSendByRule">按规则自动发券</el-button>
    </PageHeader>

    <el-card class="page-card page-toolbar" shadow="never">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="姓名/手机号" clearable />
        </el-form-item>

        <el-form-item label="用户层级">
          <el-select v-model="searchForm.tier" clearable placeholder="全部" style="width: 130px">
            <el-option label="新人" value="new" />
            <el-option label="常客" value="regular" />
            <el-option label="VIP" value="vip" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="loadData(true)">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="page-card page-table" shadow="never">
      <el-table v-loading="usersStore.loading" :data="usersStore.list" border>
        <el-table-column prop="name" label="用户" min-width="110" />
        <el-table-column prop="phone" label="手机号" min-width="130" />
        <el-table-column prop="orderCount" label="下单次数" width="100" />
        <el-table-column label="分层标签" width="100">
          <template #default="scope">
            <el-tag :type="tierTagType(scope.row.tier)">{{ tierText(scope.row.tier) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="新人标识" width="100">
          <template #default="scope">{{ scope.row.isNew ? '是' : '否' }}</template>
        </el-table-column>
        <el-table-column prop="couponCount" label="发券数" width="90" />
        <el-table-column prop="lastOrderAt" label="最近下单时间" width="170" />
        <el-table-column label="操作" width="90" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="openDetail(scope.row.id)">详情</el-button>
          </template>
        </el-table-column>

        <template #empty>
          <el-empty description="暂无用户数据" />
        </template>
      </el-table>

      <div style="display: flex; justify-content: flex-end; margin-top: 16px">
        <el-pagination
          background
          layout="total, prev, pager, next, sizes"
          :current-page="usersStore.query.page"
          :page-size="usersStore.query.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="usersStore.total"
          @current-change="(page) => loadData(false, page, usersStore.query.pageSize)"
          @size-change="(size) => loadData(false, 1, size)"
        />
      </div>
    </el-card>

    <el-dialog v-model="detailVisible" title="用户详情" width="460px">
      <el-descriptions v-if="usersStore.detail" :column="1" border>
        <el-descriptions-item label="姓名">{{ usersStore.detail.name }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ usersStore.detail.phone }}</el-descriptions-item>
        <el-descriptions-item label="下单次数">{{ usersStore.detail.orderCount }}</el-descriptions-item>
        <el-descriptions-item label="用户层级">{{ tierText(usersStore.detail.tier) }}</el-descriptions-item>
        <el-descriptions-item label="最近下单">{{ usersStore.detail.lastOrderAt }}</el-descriptions-item>
        <el-descriptions-item label="发券累计">{{ usersStore.detail.couponCount }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup >
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useUsersStore } from "@/stores/users";
import { useCouponsStore } from "@/stores/coupons";
const usersStore = useUsersStore();
const couponsStore = useCouponsStore();
const detailVisible = ref(false);
const searchForm = reactive({
  keyword: "",
  tier: ""
});
function tierText(tier) {
  if (tier === "new") return "\u65B0\u4EBA";
  if (tier === "regular") return "\u5E38\u5BA2";
  return "VIP";
}
function tierTagType(tier) {
  if (tier === "new") return "success";
  if (tier === "regular") return "warning";
  return "danger";
}
async function loadData(resetPage = false, page, pageSize) {
  try {
    await usersStore.fetchList({
      page: page ?? (resetPage ? 1 : usersStore.query.page),
      pageSize: pageSize ?? usersStore.query.pageSize,
      keyword: searchForm.keyword,
      tier: searchForm.tier || void 0
    });
  } catch (error) {
    ElMessage.error(error?.message ?? "\u52A0\u8F7D\u7528\u6237\u6570\u636E\u5931\u8D25");
  }
}
function resetSearch() {
  searchForm.keyword = "";
  searchForm.tier = "";
  loadData(true);
}
async function openDetail(id) {
  try {
    await usersStore.fetchDetail(id);
    detailVisible.value = true;
  } catch (error) {
    ElMessage.error(error?.message ?? "\u83B7\u53D6\u7528\u6237\u8BE6\u60C5\u5931\u8D25");
  }
}
async function autoSendByRule() {
  try {
    await couponsStore.sendByRule();
    ElMessage.success("\u81EA\u52A8\u53D1\u5238\u5B8C\u6210\uFF08\u6A21\u62DF\uFF09");
    await loadData();
  } catch (error) {
    ElMessage.error(error?.message ?? "\u81EA\u52A8\u53D1\u5238\u5931\u8D25");
  }
}
loadData(true);
</script>
