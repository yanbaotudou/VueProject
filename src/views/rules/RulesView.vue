<template>
  <div>
    <PageHeader title="规则管理" description="配置次日备量推荐与分层发券策略，并实时预览效果。" />

    <el-row :gutter="16">
      <el-col :xs="24" :lg="12">
        <el-card class="page-card" shadow="never">
          <template #header>
            <div class="flex-between">
              <span>次日备量推荐规则</span>
              <div>
                <el-button size="small" @click="previewStock">预览结果</el-button>
                <el-button size="small" type="primary" @click="saveNextDayRule">保存规则</el-button>
              </div>
            </div>
          </template>

          <el-form label-width="120px" :model="nextDayForm">
            <el-form-item label="统计窗口(天)">
              <el-input-number v-model="nextDayForm.windowDays" :min="3" :max="30" />
            </el-form-item>
            <el-form-item label="近期权重">
              <el-input-number v-model="nextDayForm.recentWeight" :min="0" :max="1" :step="0.1" />
            </el-form-item>
            <el-form-item label="趋势权重">
              <el-input-number v-model="nextDayForm.trendWeight" :min="0" :max="1" :step="0.1" />
            </el-form-item>
            <el-form-item label="保底值">
              <el-input-number v-model="nextDayForm.minStock" :min="1" :max="999" />
            </el-form-item>
            <el-form-item label="上限值">
              <el-input-number v-model="nextDayForm.maxStock" :min="1" :max="999" />
            </el-form-item>
          </el-form>

          <el-table :data="rulesStore.stockPreview" border size="small">
            <el-table-column prop="drinkName" label="饮品" min-width="120" />
            <el-table-column prop="recentAverage" label="近均销量" width="90" />
            <el-table-column prop="lastDayCount" label="昨日销量" width="90" />
            <el-table-column prop="recommended" label="推荐备量" width="90" />
            <template #empty>
              <el-empty description="点击预览生成推荐结果" />
            </template>
          </el-table>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="12">
        <el-card class="page-card" shadow="never">
          <template #header>
            <div class="flex-between">
              <span>优惠券发放规则</span>
              <div>
                <el-button size="small" @click="previewCouponRule">预览策略</el-button>
                <el-button size="small" type="primary" @click="saveCouponRule">保存规则</el-button>
              </div>
            </div>
          </template>

          <el-table :data="couponTiers" border size="small">
            <el-table-column prop="tier" label="用户层级" width="90">
              <template #default="scope">{{ tierText(scope.row.tier) }}</template>
            </el-table-column>
            <el-table-column label="下单次数范围" min-width="150">
              <template #default="scope">
                <el-input-number v-model="scope.row.minOrders" :min="0" :max="999" size="small" />
                <span style="margin: 0 8px">-</span>
                <el-input-number v-model="scope.row.maxOrders" :min="0" :max="999" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="时间窗口" width="130">
              <template #default="scope">
                <el-select v-model="scope.row.windowDays" size="small" style="width: 100px">
                  <el-option :value="7" label="近7天" />
                  <el-option :value="30" label="近30天" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="券模板" min-width="180">
              <template #default="scope">
                <el-select v-model="scope.row.couponTemplateId" size="small" style="width: 160px">
                  <el-option
                    v-for="tpl in couponsStore.templates"
                    :key="tpl.id"
                    :value="tpl.id"
                    :label="tpl.name"
                  />
                </el-select>
              </template>
            </el-table-column>
          </el-table>

          <div style="margin-top: 12px; margin-bottom: 8px; font-weight: 600">发券命中预览</div>
          <el-table :data="rulesStore.couponPreview" border size="small" max-height="280">
            <el-table-column prop="userName" label="用户" min-width="110" />
            <el-table-column label="层级" width="80">
              <template #default="scope">{{ tierText(scope.row.tier) }}</template>
            </el-table-column>
            <el-table-column label="命中规则" min-width="220">
              <template #default="scope">
                {{ scope.row.matchedRule?.couponTemplateName || '未命中（无模板或条件不符）' }}
              </template>
            </el-table-column>
            <template #empty>
              <el-empty description="点击预览策略查看结果" />
            </template>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup >
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useRulesStore } from "@/stores/rules";
import { useCouponsStore } from "@/stores/coupons";
const rulesStore = useRulesStore();
const couponsStore = useCouponsStore();
const nextDayForm = reactive({
  windowDays: 7,
  recentWeight: 0.7,
  trendWeight: 0.3,
  minStock: 8,
  maxStock: 120,
  updatedAt: ""
});
const couponTiers = ref([]);
function tierText(tier) {
  if (tier === "new") return "\u65B0\u4EBA";
  if (tier === "regular") return "\u5E38\u5BA2";
  return "VIP";
}
function syncCouponTemplateName(tiers) {
  return tiers.map((tier) => {
    const template = couponsStore.templates.find((tpl) => tpl.id === tier.couponTemplateId);
    return {
      ...tier,
      couponTemplateName: template?.name ?? ""
    };
  });
}
async function previewStock() {
  try {
    await rulesStore.previewNextDayStock({ ...nextDayForm });
  } catch (error) {
    ElMessage.error(error?.message ?? "\u9884\u89C8\u5931\u8D25");
  }
}
async function saveNextDayRule() {
  try {
    if (nextDayForm.minStock > nextDayForm.maxStock) {
      ElMessage.warning("\u4FDD\u5E95\u503C\u4E0D\u80FD\u5927\u4E8E\u4E0A\u9650\u503C");
      return;
    }
    await rulesStore.saveNextDayRule({ ...nextDayForm });
    ElMessage.success("\u6B21\u65E5\u5907\u91CF\u89C4\u5219\u5DF2\u4FDD\u5B58");
    await previewStock();
  } catch (error) {
    ElMessage.error(error?.message ?? "\u4FDD\u5B58\u5931\u8D25");
  }
}
async function previewCouponRule() {
  try {
    const normalized = syncCouponTemplateName(couponTiers.value);
    await rulesStore.previewCouponRule({
      tiers: normalized,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    ElMessage.error(error?.message ?? "\u9884\u89C8\u5931\u8D25");
  }
}
async function saveCouponRule() {
  try {
    const normalized = syncCouponTemplateName(couponTiers.value);
    const invalid = normalized.some(
      (item) => item.maxOrders < item.minOrders || !item.couponTemplateId
    );
    if (invalid) {
      ElMessage.warning("\u8BF7\u68C0\u67E5\u6B21\u6570\u533A\u95F4\u548C\u6A21\u677F\u9009\u62E9");
      return;
    }
    await rulesStore.saveCouponRule({
      tiers: normalized,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    ElMessage.success("\u4F18\u60E0\u5238\u89C4\u5219\u5DF2\u4FDD\u5B58");
    await previewCouponRule();
  } catch (error) {
    ElMessage.error(error?.message ?? "\u4FDD\u5B58\u5931\u8D25");
  }
}
async function init() {
  try {
    await Promise.all([
      couponsStore.fetchTemplates({ page: 1, pageSize: 100 }),
      rulesStore.fetchRules()
    ]);
    if (rulesStore.nextDayRule) {
      Object.assign(nextDayForm, rulesStore.nextDayRule);
    }
    couponTiers.value = rulesStore.couponRule?.tiers.map((item) => ({ ...item })) ?? [];
    await Promise.all([previewStock(), previewCouponRule()]);
  } catch (error) {
    ElMessage.error(error?.message ?? "\u89C4\u5219\u521D\u59CB\u5316\u5931\u8D25");
  }
}
init();
</script>

<style scoped>
.page-card {
  margin-bottom: 16px;
}
</style>
