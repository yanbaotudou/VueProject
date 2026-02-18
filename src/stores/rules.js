import { defineStore } from "pinia";
import { rulesApi } from "@/api/rules";
const useRulesStore = defineStore("rules", {
  state: () => ({
    nextDayRule: null,
    couponRule: null,
    stockPreview: [],
    couponPreview: [],
    loading: false
  }),
  actions: {
    async fetchRules() {
      this.loading = true;
      try {
        const result = await rulesApi.getRules();
        this.nextDayRule = result.nextDayRule;
        this.couponRule = result.couponRule;
      } finally {
        this.loading = false;
      }
    },
    async saveNextDayRule(payload) {
      this.nextDayRule = await rulesApi.updateNextDayRule(payload);
    },
    async saveCouponRule(payload) {
      this.couponRule = await rulesApi.updateCouponRule(payload);
    },
    async previewNextDayStock(rule) {
      this.stockPreview = await rulesApi.previewNextDayStock(rule);
    },
    async previewCouponRule(rule) {
      this.couponPreview = await rulesApi.previewCouponRule(rule);
    }
  }
});
export {
  useRulesStore
};
