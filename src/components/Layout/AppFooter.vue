<template>
  <footer class="app-footer">
    <div class="footer-container">
      <p class="footer-text">
        © 2026 MJ Prompt Generator | 作者：雪山凌狐 | Made with ❤️ for Midjourney enthusiasts
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
.app-footer {
  background: var(--bg-primary);
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
  text-align: center;
}

.footer-container {
  width: 100%;
}

.footer-text {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-footer {
    padding: 12px 20px;
  }

  .footer-text {
    font-size: 12px;
  }
}
</style>
