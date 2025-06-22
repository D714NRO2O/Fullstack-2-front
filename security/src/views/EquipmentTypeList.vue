<template>
  <v-container>
    <v-card>
      <v-card-title>
        Tipos de Equipos
        <v-spacer />
        <v-btn icon @click="loadTypes">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="equipmentTypes"
        :loading="loading"
        loading-text="Cargando tipos de equipo..."
        class="elevation-1"
      />
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getEquipmentTypes } from '@/services/equipmentTypes'

const equipmentTypes = ref([])
const loading = ref(false)

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nombre', key: 'name' },
  { title: 'Descripción', key: 'description' },
]

async function loadTypes() {
  loading.value = true
  try {
    equipmentTypes.value = await getEquipmentTypes()
  } catch (err) {
    console.error('Error cargando tipos de equipo', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTypes()
})
</script>
