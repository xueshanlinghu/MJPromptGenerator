<template>
  <n-button
    circle
    size="large"
    @click="handleToggle"
    :title="isDark ? '切换到亮色模式' : '切换到暗色模式'"
  >
    <template #icon>
      <n-icon>
        <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 18c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm0-10c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zM13 3h-2v3h2V3zm0 15h-2v3h2v-3zM6 11H3v2h3v-2zm15 0h-3v2h3v-2zM7.1 5.7L5.7 7.1 7.8 9.2l1.4-1.4-2.1-2.1zm11.8 11.8l-1.4 1.4 2.1 2.1 1.4-1.4-2.1-2.1zm-2.1-9.7l1.4-1.4 2.1 2.1-1.4 1.4-2.1-2.1zM5.7 16.9l1.4-1.4 2.1 2.1-1.4 1.4-2.1-2.1z"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
        </svg>
      </n-icon>
    </template>
  </n-button>
</template>

<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui'
import { computed } from 'vue'
import { useThemeStore } from '@/stores/themeStore'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const handleToggle = () => {
  themeStore.toggleTheme()
}

// 初始化主题
themeStore.initTheme()
</script>

<style scoped>
/* 自定义样式 */
</style>
