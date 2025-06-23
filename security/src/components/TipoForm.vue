<script setup lang="ts">
import { ref, watch } from 'vue'

type Tipo = {
  id?: number
  name: string
  description: string | null
}

const props = defineProps<{
  tipo?: Tipo
  mode: 'crear' | 'editar'
}>()

const emit = defineEmits<{
  (e: 'guardar', tipo: Tipo): void
  (e: 'cancelar'): void
}>()

const formRef = ref()
const formulario = ref<Tipo>({
  name: '',
  description: ''
})

watch(
  () => props.tipo,
  (nuevo) => {
    if (nuevo) formulario.value = { ...nuevo }
  },
  { immediate: true }
)

const guardar = () => {
  if (formRef.value?.validate()) {
    emit('guardar', formulario.value)
  }
}
</script>

<template>
  <v-form ref="formRef" @submit.prevent="guardar">
    <v-text-field
      v-model="formulario.name"
      label="Nombre del tipo"
      :rules="[v => !!v || 'Este campo es obligatorio']"
      required
    />
    <v-textarea
      v-model="formulario.description"
      label="Descripción"
      auto-grow
    />
    <v-row justify="end" class="mt-4">
      <v-btn text @click="$emit('cancelar')">Cancelar</v-btn>
      <v-btn color="primary" type="submit">
        {{ props.mode === 'crear' ? 'Crear' : 'Actualizar' }}
      </v-btn>
    </v-row>
  </v-form>
</template>
