<template>
  <div>
    <PageHeader title="饮品管理" description="支持饮品分类、属性维护、上下架与删除。">
      <el-button type="primary" @click="openCreateDialog">新增饮品</el-button>
    </PageHeader>

    <el-card class="page-card page-toolbar" shadow="never">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="饮品名称" clearable />
        </el-form-item>

        <el-form-item label="分类">
          <el-select v-model="searchForm.categoryId" placeholder="全部" clearable style="width: 140px">
            <el-option v-for="item in drinksStore.categories" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable style="width: 120px">
            <el-option label="上架" value="on" />
            <el-option label="下架" value="off" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="loadData(true)">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="page-card page-table" shadow="never">
      <el-table v-loading="drinksStore.loading" :data="drinksStore.list" border>
        <el-table-column prop="name" label="饮品名称" min-width="140" />
        <el-table-column prop="categoryName" label="分类" width="120" />
        <el-table-column label="配料" min-width="180">
          <template #default="scope">
            {{ scope.row.attributes.ingredients.join('、') }}
          </template>
        </el-table-column>
        <el-table-column label="规格价格" min-width="180">
          <template #default="scope">
            {{ formatSizes(scope.row.attributes.sizes) }}
          </template>
        </el-table-column>
        <el-table-column label="温度" min-width="120">
          <template #default="scope">
            {{ scope.row.attributes.temps.join(' / ') }}
          </template>
        </el-table-column>
        <el-table-column label="小料" min-width="160">
          <template #default="scope">
            {{ scope.row.attributes.toppings.join('、') }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'on' ? 'success' : 'info'">
              {{ scope.row.status === 'on' ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="updatedAt" width="170" />
        <el-table-column label="操作" fixed="right" width="220">
          <template #default="scope">
            <el-button link type="primary" @click="openEditDialog(scope.row)">编辑</el-button>
            <el-button link type="warning" @click="onToggleStatus(scope.row.id)">
              {{ scope.row.status === 'on' ? '下架' : '上架' }}
            </el-button>
            <el-popconfirm title="确认删除该饮品？" @confirm="onDelete(scope.row.id)">
              <template #reference>
                <el-button link type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>

        <template #empty>
          <el-empty description="暂无饮品数据" />
        </template>
      </el-table>

      <div style="display: flex; justify-content: flex-end; margin-top: 16px">
        <el-pagination
          background
          layout="total, prev, pager, next, sizes"
          :current-page="drinksStore.query.page"
          :page-size="drinksStore.query.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="drinksStore.total"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑饮品' : '新增饮品'" width="760px" destroy-on-close>
      <el-form ref="dialogFormRef" :model="dialogForm" :rules="dialogRules" label-width="96px">
        <el-form-item label="饮品名称" prop="name">
          <el-input v-model="dialogForm.name" maxlength="30" show-word-limit />
        </el-form-item>

        <el-form-item label="饮品分类" prop="categoryId">
          <el-select v-model="dialogForm.categoryId" style="width: 100%">
            <el-option v-for="item in drinksStore.categories" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="配料" prop="ingredientsText">
          <el-input
            v-model="dialogForm.ingredientsText"
            type="textarea"
            :rows="2"
            placeholder="多个配料用英文逗号分隔"
          />
        </el-form-item>

        <el-form-item label="规格价格" prop="sizes">
          <div style="width: 100%">
            <div v-for="(item, index) in dialogForm.sizes" :key="index" class="size-row">
              <el-input v-model="item.name" placeholder="规格名，如中杯" style="width: 45%" />
              <el-input-number v-model="item.price" :min="1" :max="999" :precision="2" style="width: 45%" />
              <el-button type="danger" link :disabled="dialogForm.sizes.length <= 1" @click="removeSize(index)">
                删除
              </el-button>
            </div>
            <el-button type="primary" link @click="addSize">+ 添加规格</el-button>
          </div>
        </el-form-item>

        <el-form-item label="温度" prop="temps">
          <el-select v-model="dialogForm.temps" multiple style="width: 100%">
            <el-option v-for="temp in tempOptions" :key="temp" :label="temp" :value="temp" />
          </el-select>
        </el-form-item>

        <el-form-item label="小料" prop="toppings">
          <el-select v-model="dialogForm.toppings" multiple style="width: 100%" clearable>
            <el-option v-for="top in toppingOptions" :key="top" :label="top" :value="top" />
          </el-select>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="dialogForm.remark" type="textarea" :rows="2" maxlength="120" show-word-limit />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="dialogForm.status">
            <el-radio-button value="on">上架</el-radio-button>
            <el-radio-button value="off">下架</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="onSubmitDialog">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup >
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useDrinksStore } from "@/stores/drinks";
const drinksStore = useDrinksStore();
const searchForm = reactive({
  keyword: "",
  categoryId: "",
  status: ""
});
const dialogVisible = ref(false);
const isEdit = ref(false);
const currentId = ref("");
const submitLoading = ref(false);
const dialogFormRef = ref();
const tempOptions = ["\u70ED", "\u5E38\u6E29", "\u5C11\u51B0", "\u53BB\u51B0"];
const toppingOptions = ["\u73CD\u73E0", "\u6930\u679C", "\u5976\u51BB", "\u5E03\u4E01", "\u71D5\u9EA6", "\u897F\u7C73", "\u5BD2\u5929\u6676\u7403"];
const createInitialForm = () => ({
  name: "",
  categoryId: "",
  ingredientsText: "",
  sizes: [{ name: "\u4E2D\u676F", price: 16 }],
  temps: ["\u5C11\u51B0"],
  toppings: [],
  remark: "",
  status: "on"
});
const dialogForm = reactive(createInitialForm());
const dialogRules = {
  name: [
    { required: true, message: "\u8BF7\u8F93\u5165\u996E\u54C1\u540D\u79F0", trigger: "blur" },
    { min: 2, max: 30, message: "\u957F\u5EA6\u9700\u5728 2-30 \u4E2A\u5B57\u7B26", trigger: "blur" }
  ],
  categoryId: [{ required: true, message: "\u8BF7\u9009\u62E9\u5206\u7C7B", trigger: "change" }],
  ingredientsText: [{ required: true, message: "\u8BF7\u8F93\u5165\u914D\u6599", trigger: "blur" }],
  sizes: [
    {
      validator: (_rule, value, callback) => {
        if (!value.length) {
          callback(new Error("\u8BF7\u81F3\u5C11\u6DFB\u52A0\u4E00\u4E2A\u89C4\u683C"));
          return;
        }
        if (value.some((item) => !item.name || item.price <= 0)) {
          callback(new Error("\u89C4\u683C\u540D\u79F0\u4E0E\u4EF7\u683C\u4E0D\u80FD\u4E3A\u7A7A"));
          return;
        }
        callback();
      },
      trigger: "blur"
    }
  ],
  temps: [{ type: "array", required: true, message: "\u8BF7\u9009\u62E9\u6E29\u5EA6", trigger: "change" }]
};
function addSize() {
  dialogForm.sizes.push({ name: "", price: 1 });
}
function removeSize(index) {
  dialogForm.sizes.splice(index, 1);
}
function formatSizes(sizes) {
  return sizes.map((item) => `${item.name}: \xA5${item.price}`).join(" / ");
}
async function loadData(resetPage = false, page, pageSize) {
  try {
    await drinksStore.fetchList({
      page: page ?? (resetPage ? 1 : drinksStore.query.page),
      pageSize: pageSize ?? drinksStore.query.pageSize,
      keyword: searchForm.keyword,
      categoryId: searchForm.categoryId,
      status: searchForm.status || void 0
    });
  } catch (error) {
    ElMessage.error(error?.message ?? "\u52A0\u8F7D\u996E\u54C1\u5931\u8D25");
  }
}
function handlePageChange(page) {
  loadData(false, page, drinksStore.query.pageSize);
}
function handleSizeChange(size) {
  loadData(false, 1, size);
}
function resetSearch() {
  searchForm.keyword = "";
  searchForm.categoryId = "";
  searchForm.status = "";
  loadData(true);
}
function resetDialogForm() {
  Object.assign(dialogForm, createInitialForm());
}
function openCreateDialog() {
  isEdit.value = false;
  currentId.value = "";
  resetDialogForm();
  dialogVisible.value = true;
}
function openEditDialog(row) {
  isEdit.value = true;
  currentId.value = row.id;
  Object.assign(dialogForm, {
    name: row.name,
    categoryId: row.categoryId,
    ingredientsText: row.attributes.ingredients.join(","),
    sizes: row.attributes.sizes.map((item) => ({ ...item })),
    temps: [...row.attributes.temps],
    toppings: [...row.attributes.toppings],
    remark: row.attributes.remark,
    status: row.status
  });
  dialogVisible.value = true;
}
async function onSubmitDialog() {
  if (!dialogFormRef.value) return;
  try {
    await dialogFormRef.value.validate();
    submitLoading.value = true;
    const category = drinksStore.categories.find((item) => item.id === dialogForm.categoryId);
    const payload = {
      categoryId: dialogForm.categoryId,
      categoryName: category?.name ?? "",
      name: dialogForm.name,
      attributes: {
        ingredients: dialogForm.ingredientsText.split(",").map((item) => item.trim()).filter(Boolean),
        sizes: dialogForm.sizes.map((item) => ({
          name: item.name.trim(),
          price: Number(item.price)
        })),
        temps: dialogForm.temps,
        toppings: dialogForm.toppings,
        remark: dialogForm.remark
      },
      status: dialogForm.status
    };
    if (isEdit.value && currentId.value) {
      await drinksStore.update(currentId.value, payload);
      ElMessage.success("\u996E\u54C1\u5DF2\u66F4\u65B0");
    } else {
      await drinksStore.create(payload);
      ElMessage.success("\u996E\u54C1\u5DF2\u521B\u5EFA");
    }
    dialogVisible.value = false;
  } catch (error) {
    ElMessage.error(error?.message ?? "\u63D0\u4EA4\u5931\u8D25");
  } finally {
    submitLoading.value = false;
  }
}
async function onToggleStatus(id) {
  try {
    await drinksStore.toggleStatus(id);
    ElMessage.success("\u72B6\u6001\u5DF2\u66F4\u65B0");
  } catch (error) {
    ElMessage.error(error?.message ?? "\u64CD\u4F5C\u5931\u8D25");
  }
}
async function onDelete(id) {
  try {
    await drinksStore.remove(id);
    ElMessage.success("\u5DF2\u5220\u9664");
  } catch (error) {
    ElMessage.error(error?.message ?? "\u5220\u9664\u5931\u8D25");
  }
}
async function init() {
  await drinksStore.fetchCategories();
  await loadData(true);
}
init();
</script>

<style scoped>
.size-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
</style>
