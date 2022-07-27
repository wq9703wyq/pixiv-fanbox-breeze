/*
 * @Descripttion:
 * @version:
 * @Author: 鹿角兔子
 * @Date: 2022-06-04 22:09:18
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2022-06-04 22:09:19
 */
import { createApp } from "vue";
import App from "./index.vue";
import { createPinia } from "pinia";
import elementPlus from "/@/element-plus";
import elementIcon from "/@/element-plus/icon";
import "/@css/var.scss";
import "/@css/element-plus.scss";
import "/@/utils/popupSender";
// import "/@css/element-plus.css"
const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
Object.values(elementPlus).forEach((item) => app.use(item));
Object.entries(elementIcon).forEach(([key, component]) => {
  app.component(key, component);
});
app.mount("#app");
