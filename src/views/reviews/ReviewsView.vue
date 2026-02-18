<template>
  <div>
    <PageHeader title="评论管理" description="查看评论、筛选状态并进行回复处理。" />

    <el-card class="page-card page-toolbar" shadow="never">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="用户/饮品/内容" clearable />
        </el-form-item>

        <el-form-item label="回复状态">
          <el-select v-model="searchForm.status" clearable placeholder="全部" style="width: 120px">
            <el-option label="待回复" value="pending" />
            <el-option label="已回复" value="replied" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="loadData(true)">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="page-card page-table" shadow="never">
      <el-table v-loading="reviewsStore.loading" :data="reviewsStore.list" border>
        <el-table-column prop="userName" label="用户" min-width="100" />
        <el-table-column prop="drinkName" label="饮品" min-width="120" />
        <el-table-column label="评分" width="90">
          <template #default="scope">
            <el-rate v-model="scope.row.rating" disabled size="small" />
          </template>
        </el-table-column>
        <el-table-column prop="content" label="评论内容" min-width="220" />
        <el-table-column label="回复内容" min-width="220">
          <template #default="scope">{{ scope.row.reply?.content || '-' }}</template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'replied' ? 'success' : 'warning'">
              {{ scope.row.status === 'replied' ? '已回复' : '待回复' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="评论时间" width="170" />
        <el-table-column label="操作" width="90" fixed="right">
          <template #default="scope">
            <el-button link type="primary" :disabled="scope.row.status === 'replied'" @click="openReply(scope.row)">
              回复
            </el-button>
          </template>
        </el-table-column>

        <template #empty>
          <el-empty description="暂无评论" />
        </template>
      </el-table>

      <div style="display: flex; justify-content: flex-end; margin-top: 16px">
        <el-pagination
          background
          layout="total, prev, pager, next, sizes"
          :current-page="reviewsStore.query.page"
          :page-size="reviewsStore.query.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="reviewsStore.total"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <el-dialog v-model="replyDialogVisible" title="回复评论" width="520px">
      <el-form ref="replyFormRef" :model="replyForm" :rules="replyRules" label-width="90px">
        <el-form-item label="用户">
          <el-input v-model="replyForm.userName" disabled />
        </el-form-item>
        <el-form-item label="评论">
          <el-input v-model="replyForm.content" type="textarea" :rows="3" disabled />
        </el-form-item>
        <el-form-item label="回复" prop="replyContent">
          <el-input
            v-model="replyForm.replyContent"
            type="textarea"
            :rows="4"
            maxlength="120"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="replyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReply">提交回复</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup >
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useReviewsStore } from "@/stores/reviews";
import { useAuthStore } from "@/stores/auth";
const reviewsStore = useReviewsStore();
const authStore = useAuthStore();
const searchForm = reactive({
  keyword: "",
  status: ""
});
const replyDialogVisible = ref(false);
const replyFormRef = ref();
const replyReviewId = ref("");
const replyForm = reactive({
  userName: "",
  content: "",
  replyContent: ""
});
const replyRules = {
  replyContent: [
    { required: true, message: "\u8BF7\u8F93\u5165\u56DE\u590D\u5185\u5BB9", trigger: "blur" },
    { min: 2, max: 120, message: "\u56DE\u590D\u5185\u5BB9\u957F\u5EA6\u9700\u5728 2-120 \u5B57", trigger: "blur" }
  ]
};
async function loadData(resetPage = false, page, pageSize) {
  try {
    await reviewsStore.fetchList({
      page: page ?? (resetPage ? 1 : reviewsStore.query.page),
      pageSize: pageSize ?? reviewsStore.query.pageSize,
      keyword: searchForm.keyword,
      status: searchForm.status || void 0
    });
  } catch (error) {
    ElMessage.error(error?.message ?? "\u52A0\u8F7D\u8BC4\u8BBA\u5931\u8D25");
  }
}
function handlePageChange(page) {
  loadData(false, page, reviewsStore.query.pageSize);
}
function handleSizeChange(size) {
  loadData(false, 1, size);
}
function resetSearch() {
  searchForm.keyword = "";
  searchForm.status = "";
  loadData(true);
}
function openReply(row) {
  replyReviewId.value = row.id;
  replyForm.userName = row.userName;
  replyForm.content = row.content;
  replyForm.replyContent = "";
  replyDialogVisible.value = true;
}
async function submitReply() {
  if (!replyFormRef.value) return;
  try {
    await replyFormRef.value.validate();
    await reviewsStore.reply(
      replyReviewId.value,
      replyForm.replyContent,
      authStore.displayName || "\u7CFB\u7EDF\u7BA1\u7406\u5458"
    );
    ElMessage.success("\u56DE\u590D\u6210\u529F");
    replyDialogVisible.value = false;
  } catch (error) {
    ElMessage.error(error?.message ?? "\u56DE\u590D\u5931\u8D25");
  }
}
loadData(true);
</script>
