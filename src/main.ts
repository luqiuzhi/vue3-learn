import { createApp } from 'vue'
import { createPinia } from 'pinia'

import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import Antd from 'ant-design-vue'

import App from '@/pages/App.vue'
const app = createApp(App)

app.use(createPinia())
app.use(ElementPlus)
app.use(Antd)
app.use(router)

app.mount('#app')
