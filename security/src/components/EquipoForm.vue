<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'

type Equipo = {
  id?: number
  equipmentTypeId: number
  location: string
  installationDate: string
  status: 'Active' | 'Inactive' | 'UnderMaintenance'
  description: string | null
}

type Tipo = {
  id: number
  name: string
}

const props = defineProps<{
  equipo: Equipo
  tipos: Tipo[]
  mode: 'crear' | 'editar'
}>()

const emit = defineEmits<{
  (e: 'guardar', equipo: Equipo): void
  (e: 'cancelar'): void
}>()

const formulario = ref<Equipo>({
  equipmentTypeId: 1,
  location: '',
  installationDate: '',
  status: 'Active',
  description: null
})

watch(
  () => props.equipo,
  (nuevo) => {
    if (nuevo) {
      formulario.value = { ...nuevo }
    }
  },
  { immediate: true }
)

const guardar = () => {
  emit('guardar', formulario.value)
}
</script>

<template>
  <v-form @submit.prevent="guardar">
    <v-row dense>
      <v-col cols="12" sm="6">
        <v-text-field
          label="Ubicación"
          v-model="formulario.location"
          :rules="[v => !!v || 'Campo requerido']"
          required
        />
      </v-col>

      <v-col cols="12" sm="6">
        <v-select
          label="Estado"
          :items="['Active', 'Inactive', 'UnderMaintenance']"
          v-model="formulario.status"
          :rules="[v => !!v || 'Campo requerido']"
          required
        />
      </v-col>

      <v-col cols="12" sm="6">
        <v-text-field
          label="Fecha de instalación"
          type="date"
          v-model="formulario.installationDate"
          :rules="[v => !!v || 'Campo requerido']"
          required
        />
      </v-col>

      <v-col cols="12" sm="6">
        <v-select
          label="Tipo de equipo"
          :items="tipos"
          item-title="name"
          item-value="id"
          v-model="formulario.equipmentTypeId"
          :rules="[v => !!v || 'Campo requerido']"
          required
        />
      </v-col>

      <v-col cols="12">
        <v-textarea
          label="Descripción"
          v-model="formulario.description"
          auto-grow
        />
      </v-col>
    </v-row>

    <v-row justify="end" class="mt-4">
      <v-btn text @click="$emit('cancelar')">Cancelar</v-btn>
      <v-btn type="submit" color="primary">
        {{ props.mode === 'crear' ? 'Crear' : 'Confirmar' }}
      </v-btn>
    </v-row>
  </v-form>
</template>
