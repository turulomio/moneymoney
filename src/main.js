import { createApp } from 'vue'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import {i18n} from './i18n.js'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(vuetify)
app.use(i18n)

app.mount('#app')
