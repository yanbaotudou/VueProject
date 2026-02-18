import { createApp } from "vue";
import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "element-plus/dist/index.css";
import App from "./App.vue";
import router from "./router";
import { pinia } from "./stores";
import { ensureDatabase } from "./mock/db";
import PageHeader from "./components/common/PageHeader.vue";
import SideMenu from "./layout/components/SideMenu.vue";
import TopBar from "./layout/components/TopBar.vue";
import OrderDetailDialog from "./views/orders/components/OrderDetailDialog.vue";
import "./styles/index.css";
ensureDatabase();
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.component("PageHeader", PageHeader);
app.component("SideMenu", SideMenu);
app.component("TopBar", TopBar);
app.component("OrderDetailDialog", OrderDetailDialog);
app.use(pinia);
app.use(router);
app.use(ElementPlus);
app.mount("#app");
