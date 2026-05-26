<template>
  <v-dialog v-model="show" max-width="500">
    <v-card class="pa-4">
      <v-card-title v-if="title">{{ title }}</v-card-title>
      <v-card-text>
        {{ message }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn data-test="ConfirmBox_Cancel" color="error" variant="text" @click="cancel">{{ $t("Cancel") }}</v-btn>
        <v-btn data-test="ConfirmBox_Confirm" color="primary" @click="confirm">{{ $t("Confirm") }}</v-btn>
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

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const show = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const confirm = () => {
  show.value = false
  emit('confirm')
}

const cancel = () => {
  show.value = false
  emit('cancel')
}
</script>
