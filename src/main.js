import 'flag-icons/css/flag-icons.min.css'
import App from './App.vue'
import { createApp } from 'vue'
import { loadFonts } from '@/plugins/webfontloader'
import vuetify from '@/plugins/vuetify'
import i18n from './i18n'
import { createPinia } from 'pinia';
import {router} from './routes.js'
import mixin from '@/mixin'

import * as echarts from 'echarts';
import ECharts from 'vue-echarts'

import {transform} from 'echarts-stat'
echarts.registerTransform(transform.regression);

document.title=import.meta.env.VITE_APP_TITLE

loadFonts()
const app = createApp(App)
app.use(i18n)
app.use(createPinia())
app.use(router)
app.use(vuetify)
app.component('v-chart', ECharts)
app.mixin(mixin)
app.mount('#app')


console.log(import.meta.env.MODE)