<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MantenimientoForm from '@/components/MantenimientoForm.vue'

type Mantenimiento = {
  id?: number
  equipmentId: number
  type: 'Corrective' | 'Preventive'
  date: string
  performedBy: string
  observations: string | null
  equipment?: { id: number; location: string }
}

type Equipo = { id: number; location: string }

const mantenimientos = ref<Mantenimiento[]>([])
const equipos = ref<Equipo[]>([])

const dialog = ref(false)
const dialogEliminar = ref(false)
const mantenimientoSeleccionado = ref<Mantenimiento | null>(null)
const mantenimientoAEliminar = ref<Mantenimiento | null>(null)
const editando = ref(false)
const modoFormulario = ref<'crear' | 'editar'>('crear')

const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref<'success' | 'error'>('success')
const loadingGuardar = ref(false)
const loadingEliminar = ref(false)

const rowsPerPage = ref(5)

function showSnackbar(msg: string, color: 'success' | 'error' = 'success') {
  snackbarMessage.value = msg
  snackbarColor.value = color
  snackbar.value = true
}

const getMantenimientos = async () => {
  const res = await fetch('http://localhost:3333/maintenances')
  mantenimientos.value = await res.json()
}

const getEquipos = async () => {
  const res = await fetch('http://localhost:3333/security-equipments')
  equipos.value = await res.json()
}

const nuevoMantenimiento = () => {
  mantenimientoSeleccionado.value = {
    equipmentId: equipos.value[0]?.id || 0,
    type: 'Preventive',
    date: new Date().toISOString().split('T')[0],
    performedBy: '',
    observations: null
  }
  editando.value = false
  modoFormulario.value = 'crear'
  dialog.value = true
}

const editarMantenimiento = (mantenimiento: Mantenimiento) => {
  mantenimientoSeleccionado.value = { ...mantenimiento }
  editando.value = true
  modoFormulario.value = 'editar'
  dialog.value = true
}

const guardarMantenimiento = async (mantenimiento: Mantenimiento) => {
  const method = editando.value ? 'PUT' : 'POST'
  const url = editando.value
    ? `http://localhost:3333/maintenances/${mantenimiento.id}`
    : 'http://localhost:3333/maintenances'

  try {
    loadingGuardar.value = true
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mantenimiento)
    })

    dialog.value = false
    await getMantenimientos()
    showSnackbar(editando.value ? 'Mantenimiento actualizado' : 'Mantenimiento creado')
  } catch (err) {
    console.error(err)
    showSnackbar('Error al guardar', 'error')
  } finally {
    loadingGuardar.value = false
  }
}

const confirmarEliminar = (m: Mantenimiento) => {
  mantenimientoAEliminar.value = m
  dialogEliminar.value = true
}

const eliminarMantenimiento = async () => {
  if (!mantenimientoAEliminar.value) return

  try {
    loadingEliminar.value = true
    await fetch(`http://localhost:3333/maintenances/${mantenimientoAEliminar.value.id}`, {
      method: 'DELETE'
    })

    dialogEliminar.value = false
    await getMantenimientos()
    showSnackbar('Mantenimiento eliminado')
  } catch (err) {
    console.error(err)
    showSnackbar('Error al eliminar', 'error')
  } finally {
    loadingEliminar.value = false
  }
}

onMounted(async () => {
  await getEquipos()
  await getMantenimientos()
})
</script>

<template>
  <v-container>
    <v-row justify="space-between" class="mb-4">
      <v-col cols="auto">
        <v-btn color="primary" @click="nuevoMantenimiento">Nuevo mantenimiento</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <h2 class="text-h5 mb-2">Mantenimientos</h2>
      </v-col>
    </v-row>

    <v-data-table
      :headers="[
        { text: 'ID', value: 'id' },
        { text: 'Equipo', value: 'equipment.location' },
        { text: 'Tipo', value: 'type' },
        { text: 'Fecha', value: 'date' },
        { text: 'Responsable', value: 'performedBy' },
        { text: 'Observaciones', value: 'observations' },
        { text: 'Acciones', value: 'acciones', sortable: false }
      ]"
      :items="mantenimientos"
      :items-per-page="rowsPerPage"
      class="elevation-1 rounded-lg"
    >
      <template #item.acciones="{ item }">
  <div class="d-flex align-center gap-2">
    <v-btn icon @click="editarMantenimiento(item)">
      <v-icon>mdi-pencil</v-icon>
    </v-btn>
    <v-btn icon @click="confirmarEliminar(item)">
      <v-icon color="red">mdi-delete</v-icon>
    </v-btn>
  </div>
</template>

    </v-data-table>

    <!-- Modal de formulario -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title>{{ editando ? 'Editar mantenimiento' : 'Nuevo mantenimiento' }}</v-card-title>
        <v-card-text>
          <MantenimientoForm
            v-if="mantenimientoSeleccionado"
            :mantenimiento="mantenimientoSeleccionado"
            :equipos="equipos"
            :mode="modoFormulario"
            @guardar="guardarMantenimiento"
            @cancelar="dialog = false"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Modal de eliminación -->
    <v-dialog v-model="dialogEliminar" max-width="400">
      <v-card>
        <v-card-title class="text-h6">¿Eliminar mantenimiento?</v-card-title>
        <v-card-text>Esta acción no se puede deshacer.</v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="dialogEliminar = false">Cancelar</v-btn>
          <v-btn color="red" :loading="loadingEliminar" @click="eliminarMantenimiento">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>
