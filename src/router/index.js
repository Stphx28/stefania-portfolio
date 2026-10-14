import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('../views/ProjectsView.vue'),
  },
  {
  path: '/projects',
  name: 'Projects',
  component: () => import('../views/ProjectsView.vue'),
},
{
  path: '/projects/:id',
  name: 'ProjectDetail',
  component: () => import('../views/ProjectDetailView.vue'),
},
  {
    path: '/writeups',
    name: 'Writeups',
    component: () => import('../views/WriteupsView.vue'),
  },


]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router