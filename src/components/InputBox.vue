<template>
  <v-dialog v-model="show" max-width="500">
    <v-card class="pa-4">
      <v-card-title v-if="title">{{ title }}</v-card-title>
      <v-card-text>
        <p v-if="message" class="mb-4">{{ message }}</p>
        <v-text-field
          data-test="InputBox_TextField"
          v-model="inputValue"
          :label="label"
          :type="type"
          autofocus
          @keyup.enter="submit"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn data-test="InputBox_Cancel" color="error" variant="text" @click="cancel">{{ $t("Cancel") }}</v-btn>
        <v-btn data-test="InputBox_Submit" color="primary" @click="submit">{{ $t("Submit") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  title: String,
  message: String,
  label: String,
  type: {
    type: String,
    default: 'text'
  },
  initialValue: [String, Number]
})

const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

const show = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const inputValue = ref(props.initialValue || '')

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    inputValue.value = props.initialValue || ''
  }
})

const submit = () => {
  show.value = false
  emit('submit', inputValue.value)
}

const cancel = () => {
  show.value = false
  emit('cancel')
}
</script>
