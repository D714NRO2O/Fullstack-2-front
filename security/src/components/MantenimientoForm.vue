<script setup lang="ts">
import { ref, watch } from 'vue'

type Mantenimiento = {
  id?: number
  equipmentId: number
  type: 'Corrective' | 'Preventive'
  date: string
  performedBy: string
  observations: string | null
}

type Equipo = { id: number; location: string }

const props = defineProps<{
  mantenimiento: Mantenimiento
  equipos: Equipo[]
  mode: 'crear' | 'editar'
}>()

const emit = defineEmits<{
  (e: 'guardar', mantenimiento: Mantenimiento): void
  (e: 'cancelar'): void
}>()

const formulario = ref<Mantenimiento>({ ...props.mantenimiento })

watch(
  () => props.mantenimiento,
  (nuevo) => {
    formulario.value = { ...nuevo }
  },
  { immediate: true }
)

const guardar = () => {
  emit('guardar', formulario.value)
}

const required = (v: any) => !!v || 'Campo requerido'
</script>

<template>
  <v-form @submit.prevent="guardar">
    <v-row dense>
      <!-- Equipo relacionado -->
      <v-col cols="12" sm="6">
        <v-select
          label="Equipo"
          v-model="formulario.equipmentId"
          :items="equipos"
          item-value="id"
          item-title="location"
          :rules="[required]"
          required
        />
      </v-col>

      <!-- Tipo de mantenimiento -->
      <v-col cols="12" sm="6">
        <v-select
          label="Tipo"
          v-model="formulario.type"
          :items="['Corrective', 'Preventive']"
          :rules="[required]"
          required
        />
      </v-col>

      <!-- Fecha -->
      <v-col cols="12" sm="6">
        <v-text-field
          label="Fecha"
          type="date"
          v-model="formulario.date"
          :rules="[required]"
          required
        />
      </v-col>

      <!-- Realizado por -->
      <v-col cols="12" sm="6">
        <v-text-field
          label="Responsable"
          v-model="formulario.performedBy"
          :rules="[required]"
          required
        />
      </v-col>

      <!-- Observaciones -->
      <v-col cols="12">
        <v-textarea
          label="Observaciones"
          v-model="formulario.observations"
          auto-grow
        />
      </v-col>
    </v-row>

    <!-- Acciones -->
    <v-row justify="end" class="mt-4">
      <v-btn text @click="$emit('cancelar')">Cancelar</v-btn>
      <v-btn color="primary" type="submit">
        {{ props.mode === 'crear' ? 'Crear' : 'Confirmar' }}
      </v-btn>
    </v-row>
  </v-form>
</template>
