/*
 * @Descripttion: 
 * @version: 
 * @Author: 鹿角兔子
 * @Date: 2022-06-04 22:09:18
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2022-06-04 22:09:19
 */
import { createApp } from 'vue';
import App from './index.vue';
import elementPlus from '/@/element-plus';
import elementIcon from "/@/element-plus/icon"
import "/@css/var.scss";
import "/@css/element-plus.scss"
import "/@/utils/popupSender";
// import "/@css/element-plus.css"

const app = createApp(App);
Object.values(elementPlus).forEach(item => app.use(item))
for (const [key, component] of Object.entries(elementIcon)) {
  app.component(key, component)
}
app.mount('#app');