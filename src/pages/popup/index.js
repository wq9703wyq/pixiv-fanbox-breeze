import { createApp } from 'vue';
import App from './index.vue';
import elementPlus from '/@/element-plus';
import "/@css/var.scss";
// import "/@css/element-plus.css"

const app = createApp(App);
elementPlus.forEach(item => app.use(item))
app.mount('#app');