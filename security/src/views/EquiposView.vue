<script setup lang="ts">
import { ref, onMounted } from 'vue'
import EquipoForm from '@/components/EquipoForm.vue'

type Tipo = { id: number; name: string }
type Equipo = {
  id?: number
  equipmentTypeId: number
  location: string
  installationDate: string
  status: 'Active' | 'Inactive' | 'UnderMaintenance'
  description: string | null
  type?: Tipo
}

const equipos = ref<Equipo[]>([])
const tipos = ref<Tipo[]>([])

const equipoActual = ref<Equipo | null>(null)
const modoFormulario = ref<'crear' | 'editar'>('crear')
const modalForm = ref(false)
const modalEliminar = ref(false)
const equipoAEliminar = ref<Equipo | null>(null)

const rowsPerPage = ref(5)

const getEquipos = async () => {
  const res = await fetch('http://localhost:3333/security-equipments')
  equipos.value = await res.json()
}

const getTipos = async () => {
  const res = await fetch('http://localhost:3333/equipment-types')
  tipos.value = await res.json()
}

const nuevoEquipo = () => {
  equipoActual.value = {
    equipmentTypeId: tipos.value[0]?.id || 1,
    location: '',
    installationDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    description: null
  }
  modoFormulario.value = 'crear'
  modalForm.value = true
}

const editarEquipo = (equipo: Equipo) => {
  equipoActual.value = { ...equipo }
  modoFormulario.value = 'editar'
  modalForm.value = true
}

const guardarEquipo = async (equipo: Equipo) => {
  const metodo = equipo.id ? 'PUT' : 'POST'
  const url = equipo.id
    ? `http://localhost:3333/security-equipments/${equipo.id}`
    : 'http://localhost:3333/security-equipments'

  await fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(equipo)
  })

  modalForm.value = false
  await getEquipos()
}

const confirmarEliminar = (equipo: Equipo) => {
  equipoAEliminar.value = equipo
  modalEliminar.value = true
}

const eliminarEquipo = async () => {
  if (!equipoAEliminar.value) return
  await fetch(`http://localhost:3333/security-equipments/${equipoAEliminar.value.id}`, {
    method: 'DELETE'
  })
  modalEliminar.value = false
  await getEquipos()
}

onMounted(async () => {
  await getTipos()
  await getEquipos()
})
</script>

<template>
  <v-container>
    <!-- Barra superior -->
    <v-row justify="space-between" class="mb-4">
      <v-col cols="auto">
        <v-btn color="primary" @click="nuevoEquipo">Nuevo equipo</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <h2 class="text-h5 mb-2">Equipos</h2>
      </v-col>
    </v-row>

    <!-- Tabla -->
    <v-data-table class="rounded-lg"
      :headers="[
        { title: 'ID', value: 'id' },
        { title: 'Ubicación', value: 'location' },
        { title: 'Tipo de equipo', value: 'type.name' },
        { title: 'Estado', value: 'status' },
        { title: 'Descripción', value: 'description' },
        { title: 'Acciones', value: 'acciones', sortable: false }
      ]"
      :items="equipos"
      :items-per-page="rowsPerPage"
    >
      <template #item.acciones="{ item }">
        <v-btn icon @click="editarEquipo(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="confirmarEliminar(item)">
          <v-icon color="red">mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <!-- Modal de Formulario -->
    <v-dialog v-model="modalForm" max-width="600">
      <v-card>
        <v-card-title>{{ modoFormulario === 'crear' ? 'Nuevo equipo' : 'Editar equipo' }}</v-card-title>
        <v-card-text>
          <EquipoForm
            v-if="equipoActual"
            :equipo="equipoActual"
            :tipos="tipos"
            :mode="modoFormulario"
            @guardar="guardarEquipo"
            @cancelar="modalForm = false"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Modal Confirmación Eliminar -->
    <v-dialog v-model="modalEliminar" max-width="400">
      <v-card>
        <v-card-title class="text-h6">¿Estás seguro de eliminar este equipo?</v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="modalEliminar = false">Cancelar</v-btn>
          <v-btn color="red" text @click="eliminarEquipo">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
