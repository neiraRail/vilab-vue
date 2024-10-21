// Composables
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Graficos from '@/views/Graficos.vue'
import Nodos from '@/views/Nodos.vue'
import Detalle from '@/views/Detalle.vue'
import Features from '@/views/Features.vue'
import Dashboard from '@/views/Dashboard.vue'
import Offline from '@/views/OfflineDashboard.vue'
import Jobs from '@/views/Jobs.vue'

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/LiveData',
    component: Graficos,
    props: true,
  },
  {
    path: '/Nodos',
    component: Nodos,
    name: "Nodos",
  },
  // Vista en detalle de un nodo
  {
    path: '/Detalle/:node',
    component: Detalle,
    name: "Detalle",
    props: true,
  },
  {
    path: '/Features/:node',
    component: Features,
    name: "Features",
    props: true,
  },
  {
    path: '/Dashboard/:node',
    component: Dashboard,
    name: "Dashboard",
    props: true,
  },
  {
    path: '/Offline/:node',
    component: Offline,
    name: "Offline",
    props: true,
  },
  {
    path: '/Jobs',
    component: Jobs,
    name: "Jobs",
    props: true,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
