import { defineStore } from "pinia";
import { staffApi } from "@/api/staff";
const useStaffStore = defineStore("staff", {
  state: () => ({
    list: [],
    total: 0,
    loading: false,
    query: {
      page: 1,
      pageSize: 10,
      keyword: "",
      role: void 0,
      status: void 0
    }
  }),
  actions: {
    async fetchList(partial) {
      this.loading = true;
      try {
        this.query = {
          ...this.query,
          ...partial
        };
        const result = await staffApi.listStaff(this.query);
        this.list = result.list;
        this.total = result.total;
      } finally {
        this.loading = false;
      }
    },
    async create(payload) {
      await staffApi.createStaff(payload);
      await this.fetchList({ page: 1 });
    },
    async update(id, payload) {
      await staffApi.updateStaff(id, payload);
      await this.fetchList();
    },
    async remove(id) {
      await staffApi.deleteStaff(id);
      await this.fetchList();
    },
    async toggle(id) {
      await staffApi.toggleStaffStatus(id);
      await this.fetchList();
    }
  }
});
export {
  useStaffStore
};
