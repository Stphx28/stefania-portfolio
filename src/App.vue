<template>
  <div class="app-layout">
    <Sidebar />
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue'
</script>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
}

.content {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
}
</style>