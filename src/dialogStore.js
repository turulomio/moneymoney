import { defineStore } from 'pinia'

export const useDialogStore = defineStore('dialog', {
  state: () => ({
    messageBox: {
      show: false,
      title: '',
      message: '',
      resolve: null
    },
    confirmBox: {
      show: false,
      title: '',
      message: '',
      resolve: null
    },
    inputBox: {
      show: false,
      title: '',
      message: '',
      label: '',
      type: 'text',
      initialValue: '',
      resolve: null
    }
  }),
  actions: {
    alert(message, title = '') {
      return new Promise((resolve) => {
        this.messageBox = {
          show: true,
          title,
          message,
          resolve
        }
      })
    },
    confirm(message, title = '') {
      return new Promise((resolve) => {
        this.confirmBox = {
          show: true,
          title,
          message,
          resolve
        }
      })
    },
    prompt(message, label = '', title = '', type = 'text', initialValue = '') {
      return new Promise((resolve) => {
        this.inputBox = {
          show: true,
          title,
          message,
          label,
          type,
          initialValue,
          resolve
        }
      })
    }
  }
})
