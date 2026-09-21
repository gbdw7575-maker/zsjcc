import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    // D1: Element Plus 按需引入
    // - AutoImport 自动注入 ElMessage / ElMessageBox 等 API 命名空间
    // - Components 自动注册模板中的 <el-xxx> 组件
    // - ElementPlusResolver 同步按需引入对应组件 CSS（不再全量引入 index.css）
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [ElementPlusResolver()],
      dts: 'src/types/auto-imports.d.ts'
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/types/components.d.ts'
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        // D4: 仅将稳定的 vue 全家桶独立成块以提升缓存命中率。
        //   element-plus 不在此处显式分块——按需引入 (AutoImport + Components + ElementPlusResolver)
        //   已让各组件按使用情况进入按需 chunk，强制分块反而会让整包进同一块破坏 tree-shaking。
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia']
        }
      }
    }
  }
})
