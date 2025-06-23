import { createRouter, createWebHistory } from 'vue-router'
import EquiposView from '@/views/EquiposView.vue'
import TiposEquiposView from '@/views/TiposEquiposView.vue'
import MantenimientosView from '@/views/MantenimientosView.vue'

const routes = [
  { path: '/', name: 'equipos', component: EquiposView },
  { path: '/tipos', name: 'tipos', component: TiposEquiposView },
    {
    path: '/mantenimientos',
    name: 'Mantenimientos',
    component: MantenimientosView
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
