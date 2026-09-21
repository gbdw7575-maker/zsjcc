import { createApp } from 'vue'
import { createPinia } from 'pinia'
// D1: Element Plus 不再全量注册——由 vite 插件按需自动引入组件与 CSS
//   - 模板内 <el-xxx> 由 unplugin-vue-components 自动注册
//   - ElMessage / ElMessageBox 等 API 由 unplugin-auto-import 自动注入
//   - 主 bundle 预期 ↓ ~560 KB
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
