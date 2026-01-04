import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // GitHub Pages 部署配置
  // 如果部署到 https://<USERNAME>.github.io/<REPO>/，则 base 为 '/<REPO>/'
  // 如果部署到自定义域名或根路径，则 base 为 '/'
  base: process.env.NODE_ENV === 'production' ? '/MJPromptGenerator/' : '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173,
    open: true
  }
})
