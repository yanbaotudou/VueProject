import { defineStore } from "pinia";
import { settingsApi } from "@/api/settings";
const defaultSettings = {
  theme: "light",
  systemName: "\u996E\u54C1\u7BA1\u7406\u7CFB\u7EDF",
  contactEmail: "ops@example.com"
};
const useSettingsStore = defineStore("settings", {
  state: () => ({
    settings: defaultSettings,
    loading: false
  }),
  getters: {
    theme: (state) => state.settings.theme
  },
  actions: {
    async fetchSettings() {
      this.loading = true;
      try {
        this.settings = await settingsApi.getSettings();
      } finally {
        this.loading = false;
      }
    },
    async saveSettings(payload) {
      this.loading = true;
      try {
        this.settings = await settingsApi.updateSettings(payload);
      } finally {
        this.loading = false;
      }
    },
    async toggleTheme() {
      const nextTheme = this.settings.theme === "light" ? "dark" : "light";
      await this.saveSettings({
        ...this.settings,
        theme: nextTheme
      });
    }
  }
});
export {
  useSettingsStore
};
