import 'flag-icons/css/flag-icons.min.css'
import App from './App.vue'
import { createApp } from 'vue'
import { loadFonts } from '@/plugins/webfontloader'
import vuetify from '@/plugins/vuetify'
import i18n from './i18n'
import { createPinia } from 'pinia'
import { router } from './routes.js'
import { setupAxiosInterceptors } from './axios_interceptors.js'

document.title = import.meta.env.VITE_APP_TITLE

loadFonts()
const app = createApp(App)
app.use(i18n)
app.use(createPinia())
app.use(router)
app.use(vuetify)

setupAxiosInterceptors()

app.mount('#app')


console.log(import.meta.env.MODE)