import { defineStore } from 'pinia'

/**
 * Global Pinia store holding the active dialog state (MessageBox, ConfirmBox, InputBox).
 */
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

/**
 * Composable for easy, programmatic usage of global dialogs (MessageBox, ConfirmBox, InputBox).
 *
 * @example
 * import { useDialogs } from '@/composables/useDialogs'
 *
 * const { alert, confirm, prompt } = useDialogs()
 *
 * // Usage in an async function:
 * const handleAction = async () => {
 *   if (await confirm("¿Estás seguro de que quieres borrar esto?")) {
 *     const reason = await prompt("Introduce el motivo:", "Motivo");
 *     if (reason) {
 *       await alert("Acción realizada con éxito");
 *     }
 *   }
 * }
 */
export function useDialogs() {
  const store = useDialogStore()

  return {
    /**
     * Shows a message box.
     * @param {string} message - The message to display (supports HTML).
     * @param {string} [title] - Optional title for the dialog.
     * @returns {Promise<void>} Resolves when the dialog is closed.
     */
    alert: (message, title = '') => store.alert(message, title),

    /**
     * Shows a confirmation box.
     * @param {string} message - The message to display.
     * @param {string} [title] - Optional title for the dialog.
     * @returns {Promise<boolean>} Resolves to true if confirmed, false otherwise.
     */
    confirm: (message, title = '') => store.confirm(message, title),

    /**
     * Shows an input box.
     * @param {string} message - The message to display above the input.
     * @param {string} [label] - Label for the text field.
     * @param {string} [title] - Optional title for the dialog.
     * @param {string} [type='text'] - Type of the input field (e.g., 'text', 'number', 'password').
     * @param {string|number} [initialValue=''] - Initial value for the input field.
     * @returns {Promise<string|number|null>} Resolves with the input value, or null if cancelled.
     */
    prompt: (message, label = '', title = '', type = 'text', initialValue = '') =>
      store.prompt(message, label, title, type, initialValue)
  }
}
