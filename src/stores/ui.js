import { defineStore } from "pinia";
const useUiStore = defineStore("ui", {
  state: () => ({
    globalLoading: false
  }),
  actions: {
    setGlobalLoading(value) {
      this.globalLoading = value;
    }
  }
});
export {
  useUiStore
};
