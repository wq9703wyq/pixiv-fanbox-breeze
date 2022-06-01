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