import axios from 'axios'
import { useStore } from './store.js'
import { useDialogStore } from '@/composables/useDialogs'
import i18n from './i18n.js'

/**
 * Validates a successful HTTP response (2xx) and checks for application-level errors.
 * Shows an alert dialog if an error condition like "Wrong credentials" is met.
 *
 * @param {import('axios').AxiosResponse} response - The Axios response object.
 * @returns {Promise<boolean>} True if response is valid and error-free, false otherwise.
 */
export async function parseResponse(response) {
  const dialogStore = useDialogStore()
  const store = useStore()
  const { t } = i18n.global

  if (response.status === 200) {
    if (response.data === 'Wrong credentials') {
      store.setToken(null)
      await dialogStore.alert(t('Wrong credentials'))
      return false
    }
    return true
  } else if (response.status === 201) {
    return true
  } else if (response.status === 204) {
    return true
  } else {
    await dialogStore.alert(`${response.status}: ${response.data}`)
    return false
  }
}

/**
 * Handles HTTP error responses (4xx, 5xx, or network issues) and displays localized alert dialogs.
 *
 * @param {import('axios').AxiosError} error - The Axios error object.
 * @returns {Promise<void>}
 */
export async function parseResponseError(error) {
  const dialogStore = useDialogStore()
  const store = useStore()
  const { t } = i18n.global

  if (error.response) {
    if (error.response.status === 401) {
      if (!error.config?.headers?.Authorization) {
        // Request without authorization header (e.g. login or public endpoints)
        await dialogStore.alert(t('Wrong credentials'))
      } else if (store.token != null) {
        // Authenticated request whose session expired or lacked permission
        await dialogStore.alert(t("You aren't authorized to do this request"))
        store.setToken(null)
        const { router } = await import('./routes.js')
        if (router.currentRoute.value.name !== 'home' && router.currentRoute.value.name !== 'about') {
          router.push({ name: 'home' })
        }
        console.log(error.response)
      } else {
        // In-flight request finishing after user already logged out
        console.warn('401 Unauthorized for in-flight request after logout:', error.config?.url)
      }
    } else if (error.response.status === 400) {
      await dialogStore.alert(t('Something wrong with your request') + '\n' + JSON.stringify(error.response.data))
      console.log(error.response)
    } else if (error.response.status === 403) {
      await dialogStore.alert(t("You've done something forbidden"))
      store.setToken(null)
      const { router } = await import('./routes.js')
      if (router.currentRoute.value.name !== 'home' && router.currentRoute.value.name !== 'about') {
        router.push({ name: 'home' })
      }
      console.log(error.response)
    } else if (error.response.status === 500) {
      await dialogStore.alert(t('There is a server error'))
      console.log(error.response)
    }
  } else if (error.request) {
    console.log('The request was made but no response was received')
    await dialogStore.alert(t("Server couldn't answer this request"))
    console.log(error.request)
  } else {
    console.log('Error', error.message)
  }
}

/**
 * Registers global Axios request and response interceptors.
 *
 * - Request: automatically injects Authorization token, Accept-Language, and Content-Type unless noheaders: true.
 * - Response: runs parseResponse for successful responses and parseResponseError for errors unless noparse: true.
 */
export function setupAxiosInterceptors() {
  axios.interceptors.request.use((config) => {
    if (config.noheaders) return config
    const store = useStore()
    if (store.token && !config.headers.Authorization) {
      config.headers.Authorization = `Token ${store.token}`
    }
    if (!config.headers['Accept-Language']) {
      config.headers['Accept-Language'] = `${localStorage.locale}-${localStorage.locale}`
    }
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json'
    }
    return config
  })

  axios.interceptors.response.use(
    async (response) => {
      if (response.config?.noparse) return response
      const ok = await parseResponse(response)
      if (ok) return response
      return Promise.reject(response)
    },
    async (error) => {
      if (error.config && error.config.noparse) return Promise.reject(error)
      await parseResponseError(error)
      return Promise.reject(error)
    }
  )
}
