import { createApp } from 'vue'
import { createPinia } from 'pinia'
import "@/assets/basic.css"
import "@/assets/theme.css"
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import '@arco-design/web-vue/dist/arco.css';
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(ArcoVue)
app.use(ArcoVueIcon);
app.use(router)

app.mount('#app')
