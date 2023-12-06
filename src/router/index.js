// Composables
import { createRouter, createWebHistory } from 'vue-router'
import Default from '@/layouts/default/Default.vue'
import Home from '@/views/Home.vue'
import Graficos from '@/views/Graficos.vue'
import Nodos from '@/views/Nodos.vue'
import Detalle from '@/views/Detalle.vue'

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
    path: '/Dashboard',
    component: () => import("@/views/Dashboard.vue"),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
