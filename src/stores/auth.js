import { defineStore } from "pinia";
import { authApi } from "@/api/auth";
import { removeStorageItem, setStorageItem, STORAGE_KEYS, getStorageItem } from "@/utils/storage";
const useAuthStore = defineStore("auth", {
  state: () => ({
    token: getStorageItem(STORAGE_KEYS.TOKEN, ""),
    profile: getStorageItem(STORAGE_KEYS.AUTH_PROFILE, null)
  }),
  getters: {
    isLoggedIn: (state) => Boolean(state.token),
    role: (state) => state.profile?.role ?? "clerk",
    displayName: (state) => state.profile?.name ?? ""
  },
  actions: {
    async login(username, password) {
      const result = await authApi.login({ username, password });
      this.token = result.token;
      this.profile = result.profile;
      setStorageItem(STORAGE_KEYS.TOKEN, result.token);
      setStorageItem(STORAGE_KEYS.AUTH_PROFILE, result.profile);
    },
    logout() {
      this.token = "";
      this.profile = null;
      removeStorageItem(STORAGE_KEYS.TOKEN);
      removeStorageItem(STORAGE_KEYS.AUTH_PROFILE);
    }
  }
});
export {
  useAuthStore
};
