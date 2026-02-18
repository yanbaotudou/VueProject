import { defineStore } from "pinia";
import {
  couponsApi
} from "@/api/coupons";
const useCouponsStore = defineStore("coupons", {
  state: () => ({
    templates: [],
    templatesTotal: 0,
    records: [],
    recordsTotal: 0,
    loading: false,
    templateQuery: {
      page: 1,
      pageSize: 10,
      keyword: ""
    },
    recordQuery: {
      page: 1,
      pageSize: 10,
      userName: ""
    }
  }),
  actions: {
    async fetchTemplates(partial) {
      this.loading = true;
      try {
        this.templateQuery = {
          ...this.templateQuery,
          ...partial
        };
        const result = await couponsApi.listCouponTemplates(this.templateQuery);
        this.templates = result.list;
        this.templatesTotal = result.total;
      } finally {
        this.loading = false;
      }
    },
    async fetchRecords(partial) {
      this.loading = true;
      try {
        this.recordQuery = {
          ...this.recordQuery,
          ...partial
        };
        const result = await couponsApi.listCouponRecords(this.recordQuery);
        this.records = result.list;
        this.recordsTotal = result.total;
      } finally {
        this.loading = false;
      }
    },
    async createTemplate(payload) {
      await couponsApi.createCouponTemplate(payload);
      await this.fetchTemplates({ page: 1 });
    },
    async updateTemplate(id, payload) {
      await couponsApi.updateCouponTemplate(id, payload);
      await this.fetchTemplates();
    },
    async removeTemplate(id) {
      await couponsApi.deleteCouponTemplate(id);
      await this.fetchTemplates();
      await this.fetchRecords();
    },
    async sendCoupon(payload) {
      await couponsApi.sendCoupon(payload);
      await this.fetchRecords({ page: 1 });
    },
    async sendByRule() {
      await couponsApi.sendCouponsByRule();
      await this.fetchRecords({ page: 1 });
    }
  }
});
export {
  useCouponsStore
};
