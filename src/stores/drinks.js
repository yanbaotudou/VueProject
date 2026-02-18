import { defineStore } from "pinia";
import { drinksApi } from "@/api/drinks";
const useDrinksStore = defineStore("drinks", {
  state: () => ({
    categories: [],
    list: [],
    total: 0,
    loading: false,
    query: {
      page: 1,
      pageSize: 10,
      keyword: "",
      categoryId: "",
      status: void 0
    }
  }),
  actions: {
    async fetchCategories() {
      this.categories = await drinksApi.getDrinkCategories();
    },
    async fetchList(partial) {
      this.loading = true;
      try {
        this.query = {
          ...this.query,
          ...partial
        };
        const result = await drinksApi.listDrinks(this.query);
        this.list = result.list;
        this.total = result.total;
      } finally {
        this.loading = false;
      }
    },
    async create(payload) {
      await drinksApi.createDrink(payload);
      await this.fetchList({ page: 1 });
    },
    async update(id, payload) {
      await drinksApi.updateDrink(id, payload);
      await this.fetchList();
    },
    async remove(id) {
      await drinksApi.deleteDrink(id);
      await this.fetchList();
    },
    async toggleStatus(id) {
      await drinksApi.toggleDrinkStatus(id);
      await this.fetchList();
    }
  }
});
export {
  useDrinksStore
};
