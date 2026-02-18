import { defineStore } from "pinia";
import { usersApi } from "@/api/users";
const useUsersStore = defineStore("users", {
  state: () => ({
    list: [],
    total: 0,
    loading: false,
    detail: null,
    query: {
      page: 1,
      pageSize: 10,
      keyword: "",
      tier: void 0
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
        const result = await usersApi.listUsers(this.query);
        this.list = result.list;
        this.total = result.total;
      } finally {
        this.loading = false;
      }
    },
    async fetchDetail(id) {
      this.detail = await usersApi.getUserDetail(id);
      return this.detail;
    }
  }
});
export {
  useUsersStore
};
