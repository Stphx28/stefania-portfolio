<template>
  <div v-if="project" class="project-detail">
    <RouterLink to="/projects" class="back-link">
      <ArrowLeft :size="16" />
      Back to Projects
    </RouterLink>

    <h1>{{ project.title }}</h1>

    <div class="tags-row">
      <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
    </div>

    <div class="links-row" v-if="project.links.github || project.links.demo">
      <a v-if="project.links.github" :href="project.links.github" target="_blank" class="link-btn">
        View on GitHub
      </a>
      <a v-if="project.links.demo" :href="project.links.demo" target="_blank" class="link-btn">
        Live Demo
      </a>
    </div>

    <p class="short-desc">{{ project.shortDescription }}</p>

    <div v-for="(section, index) in project.sections" :key="index" class="section">
      <h2>{{ section.heading }}</h2>
      <p class="section-body">{{ section.body }}</p>

      <div v-if="section.screenshots && section.screenshots.length" class="screenshots">
        <img
          v-for="(shot, shotIndex) in section.screenshots"
          :key="shotIndex"
          :src="shot"
          :alt="`${section.heading} screenshot ${shotIndex + 1}`"
          class="screenshot"
        />
      </div>
    </div>
  </div>

  <div v-else class="not-found">
    <p>Project not found.</p>
    <RouterLink to="/projects">Back to Projects</RouterLink>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft } from '@lucide/vue'
import { projects } from '../data/projects.js'

const route = useRoute()

const project = computed(() =>
  projects.find((p) => p.id === route.params.id)
)
</script>

<style scoped>
.project-detail {
  max-width: 800px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--color-text-secondary);
  text-decoration: none;
  margin-bottom: 24px;
}

.back-link:hover {
  color: var(--color-green-primary);
}

.project-detail h1 {
  font-size: 28px;
  margin-bottom: 16px;
  color: var(--color-text-primary);
}

.tags-row {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.tag {
  font-size: 12px;
  padding: 4px 12px;
  background: var(--color-green-light);
  border-radius: 6px;
  color: var(--color-green-primary);
}

.links-row {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.link-btn {
  padding: 10px 18px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text-primary);
  text-decoration: none;
  font-size: 13px;
  transition: all 0.15s ease;
}

.link-btn:hover {
  background: var(--color-green-light);
  border-color: var(--color-green-primary);
}

.short-desc {
  font-size: 15px;
  line-height: 1.7;
  color: var(--color-text-secondary);
  margin-bottom: 32px;
}

.screenshots {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
}

.screenshots {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
}

.screenshot-placeholder {
  padding: 60px 20px;
  text-align: center;
  background: var(--color-green-light);
  border-radius: 12px;
  color: var(--color-text-secondary);
  font-size: 13px;
  margin-bottom: 40px;
}

.section {
  margin-bottom: 36px;
}

.section h2 {
  font-size: 18px;
  margin-bottom: 12px;
  color: var(--color-text-primary);
}

.section-body {
  font-size: 14px;
  line-height: 1.8;
  color: var(--color-text-secondary);
  white-space: pre-line;
}

.not-found {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-text-secondary);
}
</style>