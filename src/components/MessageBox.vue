<template>
  <v-dialog v-model="show" max-width="500">
    <v-card class="pa-4">
      <v-card-title v-if="title">{{ title }}</v-card-title>
      <v-card-text>
        <div v-html="message"></div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn data-test="MessageBox_Close" color="primary" @click="close">{{ $t("Close") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  title: String,
  message: String
})

const emit = defineEmits(['update:modelValue', 'close'])

const show = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const close = () => {
  show.value = false
  emit('close')
}
</script>
