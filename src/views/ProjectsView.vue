<template>
  <div class="projects-page">
    <h1>Projects</h1>
    <p class="subtitle">A collection of things I've built and broken.</p>

    <div class="cards-grid">
      <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
    </div>
  </div>
</template>

<script setup>
import ProjectCard from '../components/ProjectCard.vue'
import { projects } from '../data/projects.js'
</script>

<style scoped>
.projects-page h1 {
  font-size: 28px;
  margin-bottom: 8px;
  color: var(--color-text-primary);
}

.subtitle {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 32px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}
</style>