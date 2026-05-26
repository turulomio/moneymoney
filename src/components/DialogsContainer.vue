<template>
  <div>
    <MessageBox
      v-model="store.messageBox.show"
      :title="store.messageBox.title"
      :message="store.messageBox.message"
      @close="onMessageClose"
    />
    <ConfirmBox
      v-model="store.confirmBox.show"
      :title="store.confirmBox.title"
      :message="store.confirmBox.message"
      @confirm="onConfirm(true)"
      @cancel="onConfirm(false)"
    />
    <InputBox
      v-model="store.inputBox.show"
      :title="store.inputBox.title"
      :message="store.inputBox.message"
      :label="store.inputBox.label"
      :type="store.inputBox.type"
      :initialValue="store.inputBox.initialValue"
      @submit="onInputSubmit"
      @cancel="onInputCancel"
    />
  </div>
</template>

<script setup>
import { useDialogStore } from '@/dialogStore'
import MessageBox from './MessageBox.vue'
import ConfirmBox from './ConfirmBox.vue'
import InputBox from './InputBox.vue'

const store = useDialogStore()

const onMessageClose = () => {
  if (store.messageBox.resolve) {
    store.messageBox.resolve()
    store.messageBox.resolve = null
  }
}

const onConfirm = (result) => {
  if (store.confirmBox.resolve) {
    store.confirmBox.resolve(result)
    store.confirmBox.resolve = null
  }
  store.confirmBox.show = false
}

const onInputSubmit = (value) => {
  if (store.inputBox.resolve) {
    store.inputBox.resolve(value)
    store.inputBox.resolve = null
  }
  store.inputBox.show = false
}

const onInputCancel = () => {
  if (store.inputBox.resolve) {
    store.inputBox.resolve(null)
    store.inputBox.resolve = null
  }
  store.inputBox.show = false
}
</script>
