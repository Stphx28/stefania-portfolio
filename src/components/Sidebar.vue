<template>
  <aside class="sidebar">
    <!-- Profil / Logo -->
    <div class="profile">
      <div class="avatar">>_</div>
      <div class="profile-text">
        <h2>Huluba Stefania-Valentina</h2>
        <p>aspiring cybersecurity analyst</p>
      </div>
    </div>

    <!-- Contact -->
    <div class="contact-list">
      <a href="mailto:stefaniahuluba@yahoo.com" class="contact-item" title="Email">
        <Mail :size="16" />
        <span>stefaniahuluba@yahoo.com</span>
      </a>
      <a href="https://linkedin.com/in/stefania-huluba" target="_blank" class="contact-item" title="LinkedIn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
          <rect x="2" y="9" width="4" height="12"></rect>
          <circle cx="4" cy="4" r="2"></circle>
        </svg>
        <span>stefania-huluba</span>
      </a>
      <a href="https://github.com/Stphx28" target="_blank" class="contact-item" title="GitHub">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
        </svg>
        <span>Stphx28</span>
      </a>
    </div>

    <!-- Navigation -->
    <nav class="nav-section">
      <p class="section-label">NAVIGATION</p>
      <RouterLink to="/" class="nav-item">
        <Home :size="18" />
        <span>Home</span>
      </RouterLink>
      <RouterLink to="/projects" class="nav-item">
        <FolderOpen :size="18" />
        <span>Projects</span>
      </RouterLink>
      <RouterLink to="/writeups" class="nav-item">
        <FileText :size="18" />
        <span>Write-ups</span>

      </RouterLink>    
    </nav>

    <!-- Theme toggle -->
    <div class="theme-toggle" @click="toggleTheme">
      <component :is="isDark ? Sun : Moon" :size="16" />
      <span>{{ isDark ? 'Light mode' : 'Dark mode' }}</span>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  Home,
  FolderOpen,
  FileText,
  Info,
  Mail,
  Sun,
  Moon,
} from '@lucide/vue'

const isDark = ref(false)

function toggleTheme() {
  isDark.value = !isDark.value
  const theme = isDark.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

onMounted(() => {
  const saved = localStorage.getItem('theme') || 'light'
  isDark.value = saved === 'dark'
  document.documentElement.setAttribute('data-theme', saved)
})
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;  height: 100vh;
  padding: 24px 20px;
  background-color: var(--color-bg-sidebar);
  border-right: 1px solid var(--color-border);
}

.profile {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.avatar {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-green-light);
  border-radius: 10px;
  font-size: 20px;
}

.profile-text h2 {
  font-size: 15px;
  color: var(--color-text-primary);
}

.profile-text p {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 24px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 13px;
  transition: all 0.15s ease;
}

.contact-item span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.contact-item:hover {
  background: var(--color-green-light);
  color: var(--color-green-primary);
}

.section-label {
  font-size: 11px;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.nav-section {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 24px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 8px;
  color: var(--color-text-primary);
  text-decoration: none;
  font-size: 14px;
  transition: background-color 0.15s ease;
}

.nav-item:hover {
  background-color: var(--color-green-light);
}

.nav-item.router-link-exact-active {
  background-color: var(--color-green-light);
  color: var(--color-green-primary);
  font-weight: 600;
}

.theme-toggle {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text-secondary);
  font-size: 13px;
  cursor: pointer;
}

.theme-toggle:hover {
  background-color: var(--color-green-light);
}
</style>