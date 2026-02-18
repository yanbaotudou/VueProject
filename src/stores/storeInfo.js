import { defineStore } from "pinia";
import { storeApi } from "@/api/store";
const useStoreInfoStore = defineStore("store-info", {
  state: () => ({
    info: null,
    loading: false
  }),
  actions: {
    async fetchStoreInfo() {
      this.loading = true;
      try {
        this.info = await storeApi.getStoreInfo();
      } finally {
        this.loading = false;
      }
    },
    async saveStoreInfo(payload) {
      this.loading = true;
      try {
        this.info = await storeApi.updateStoreInfo(payload);
      } finally {
        this.loading = false;
      }
    }
  }
});
export {
  useStoreInfoStore
};
