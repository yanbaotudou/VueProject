<template>
  <div v-loading.fullscreen.lock="uiStore.globalLoading" class="app-root">
    <RouterView />
  </div>
</template>

<script setup >
import { watchEffect } from "vue";
import { useUiStore } from "@/stores/ui";
import { useSettingsStore } from "@/stores/settings";
const uiStore = useUiStore();
const settingsStore = useSettingsStore();
settingsStore.fetchSettings();
watchEffect(() => {
  document.documentElement.classList.toggle("dark", settingsStore.theme === "dark");
});
</script>
