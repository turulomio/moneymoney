/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import 'vuetify/styles'
import * as labs from 'vuetify/labs/components'

// Composables
import { createVuetify } from 'vuetify'
// Vuetify

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
const vuetify = createVuetify({
  components: {
    ...labs,
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    }
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#546e7a',
          secondary: '#728c98',
          accent: '#8c9eff',
          error: '#b71c1c',
        },
      },
    },
  },
})

export default vuetify;
