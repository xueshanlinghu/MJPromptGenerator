import { defineStore } from 'pinia'
import { darkTheme, type GlobalTheme } from 'naive-ui'

interface ThemeState {
  isDark: boolean
  naiveTheme: GlobalTheme | null
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    isDark: false,
    naiveTheme: null
  }),

  actions: {
    /**
     * 切换主题
     */
    toggleTheme() {
      this.isDark = !this.isDark
      this.naiveTheme = this.isDark ? darkTheme : null

      // 持久化主题设置
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light')

      // 更新 DOM 类名（用于自定义样式）
      if (this.isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },

    /**
     * 初始化主题（从 localStorage 加载）
     */
    initTheme() {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme === 'dark') {
        this.isDark = true
        this.naiveTheme = darkTheme
        document.documentElement.classList.add('dark')
      }
    }
  }
})
