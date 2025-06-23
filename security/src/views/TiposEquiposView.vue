<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TipoForm from '@/components/TipoForm.vue'

type Tipo = {
  id?: number
  name: string
  description: string | null
}

const tipos = ref<Tipo[]>([])
const dialog = ref(false)
const modoFormulario = ref<'crear' | 'editar'>('crear')
const tipoSeleccionado = ref<Tipo | null>(null)
const dialogEliminar = ref(false)
const tipoAEliminar = ref<Tipo | null>(null)

const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref<'success' | 'error'>('success')
const loadingEliminar = ref(false)

function showSnackbar(msg: string, color: 'success' | 'error' = 'success') {
  snackbarMessage.value = msg
  snackbarColor.value = color
  snackbar.value = true
}

const getTipos = async () => {
  const res = await fetch('http://localhost:3333/equipment-types')
  tipos.value = await res.json()
}

const nuevoTipo = () => {
  tipoSeleccionado.value = { name: '', description: '' }
  modoFormulario.value = 'crear'
  dialog.value = true
}

const editarTipo = (tipo: Tipo) => {
  tipoSeleccionado.value = { ...tipo }
  modoFormulario.value = 'editar'
  dialog.value = true
}

const guardarTipo = async (tipo: Tipo) => {
  const method = modoFormulario.value === 'crear' ? 'POST' : 'PUT'
  const url = modoFormulario.value === 'crear'
    ? 'http://localhost:3333/equipment-types'
    : `http://localhost:3333/equipment-types/${tipo.id}`

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tipo)
  })

  dialog.value = false
  await getTipos()
  showSnackbar(modoFormulario.value === 'crear' ? 'Tipo creado' : 'Tipo actualizado')
}

const confirmarEliminar = (tipo: Tipo) => {
  tipoAEliminar.value = tipo
  dialogEliminar.value = true
}

const eliminarTipo = async () => {
  if (!tipoAEliminar.value) return

  loadingEliminar.value = true
  await fetch(`http://localhost:3333/equipment-types/${tipoAEliminar.value.id}`, {
    method: 'DELETE'
  })

  dialogEliminar.value = false
  await getTipos()
  showSnackbar('Tipo eliminado')
  loadingEliminar.value = false
}

onMounted(() => {
  getTipos()
})
</script>

<template>
  <v-container>
    <v-row justify="space-between" class="mb-4">
      <v-col cols="auto">
        <v-btn color="primary" @click="nuevoTipo">Nuevo tipo</v-btn>
      </v-col>
    </v-row>

    <v-data-table
      :headers="[
        { text: 'ID', value: 'id' },
        { text: 'Nombre', value: 'name' },
        { text: 'Descripción', value: 'description' },
        { text: 'Acciones', value: 'acciones', sortable: false }
      ]"
      :items="tipos"
      class="rounded-lg elevation-1"
    >
      <template #item.acciones="{ item }">
        <v-btn icon @click="editarTipo(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="confirmarEliminar(item)">
          <v-icon color="red">mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <!-- Modal formulario -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6">
          {{ modoFormulario === 'crear' ? 'Nuevo tipo de equipo' : 'Editar tipo de equipo' }}
        </v-card-title>
        <v-card-text>
          <TipoForm
            v-if="tipoSeleccionado"
            :tipo="tipoSeleccionado"
            :mode="modoFormulario"
            @guardar="guardarTipo"
            @cancelar="dialog = false"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Modal eliminar -->
    <v-dialog v-model="dialogEliminar" max-width="400">
      <v-card>
        <v-card-title>¿Eliminar tipo?</v-card-title>
        <v-card-text>Esto no se puede deshacer.</v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="dialogEliminar = false">Cancelar</v-btn>
          <v-btn color="red" @click="eliminarTipo" :loading="loadingEliminar">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>
