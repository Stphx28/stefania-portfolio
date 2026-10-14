<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-text">
        <h1>Hi, I'm <span class="highlight">Stefania</span>!</h1>
        <p>
          Aspiring cybersecurity analyst with a strong interest in networking,
          web security and system security. I enjoy exploring new technologies
          and learning about the latest trends in the field of cybersecurity.
        </p>
      </div>
      <div class="hero-illustration">
        <img src="/images/profile.jpg" alt="Stefania" class="profile-photo" />
      </div>
    </section>

    <!-- Featured Projects -->
    <section class="featured">
      <h2><Star :size="20" /> Featured Projects</h2>
      <div class="cards-grid">
        <ProjectCard
          v-for="project in featuredProjects"
          :key="project.id"
          :project="project"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { Star } from '@lucide/vue'
import ProjectCard from '../components/ProjectCard.vue'
import { projects } from '../data/projects.js'
const featuredProjects = projects.filter((p) => p.featured)
</script>

<style scoped>
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  margin-bottom: 60px;
}

.hero-text h1 {
  font-size: 32px;
  margin-bottom: 16px;
  color: var(--color-text-primary);
}

.highlight {
  color: var(--color-green-primary);
}

.hero-text p {
  font-size: 15px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.profile-photo {
  width: 220px;
  height: 220px;
  object-fit: cover;
  border-radius: 20px;
  display: block;
}

.featured h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  margin-bottom: 20px;
  color: var(--color-text-primary);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}
</style>