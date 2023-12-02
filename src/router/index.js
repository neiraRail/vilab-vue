// Composables
import { createRouter, createWebHistory } from 'vue-router'
import Default from '@/layouts/default/Default.vue'
import Home from '@/views/Home.vue'
import Graficos from '@/views/Graficos.vue'
import Nodos from '@/views/Nodos.vue'

const routes = [
  {
    path: '/',
    component: Default,
    children: [
      {
        path: '',
        name: 'Home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: Home,
      },
    ],
  },
  {
    path: '/LiveData',
    component: Default,
    children: [
      {
        path: '',
        name: 'LiveData',
        component: Graficos,
        props: true
      },
    ],
  },
  {
    path: '/Nodos',
    component: Default,
    children: [
      {
        path: '',
        name: 'Nodos',
        component: Nodos,
      },
    ],
  },
  {
    path: '/Test',
    component: Default,
    children: [
      {
        path: '',
        name: 'Test',
        component: () => import("@/views/Dashboard.vue"),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
