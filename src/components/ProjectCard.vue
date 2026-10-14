<template>
  <RouterLink :to="`/projects/${project.id}`" class="card">
    <img v-if="project.thumbnail" :src="project.thumbnail" :alt="project.title" class="card-thumbnail" />
    <div v-else class="card-thumbnail"></div>
    <div class="card-body">
      <h3>{{ project.title }}</h3>
      <p>{{ project.shortDescription }}</p>
      <div class="card-tags">
        <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
defineProps({
  project: {
    type: Object,
    required: true,
  },
})
</script>

<style scoped>
.card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  overflow: hidden;
  padding: 14px;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
}

.card-thumbnail {
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  background: var(--color-green-light);
  border-radius: 10px;
  object-fit: cover;
  display: block;
}

.card-body {
  padding: 0;
  flex: 1;
  min-width: 0;
}

.card-body h3 {
  font-size: 15px;
  margin-bottom: 8px;
  color: var(--color-text-primary);
}

.card-body p {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin-bottom: 14px;
}

.card-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  font-size: 11px;
  padding: 4px 10px;
  background: var(--color-green-light);
  border-radius: 6px;
  color: var(--color-green-primary);
}
</style>