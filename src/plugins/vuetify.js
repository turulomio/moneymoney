import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import es from 'vuetify/src/locale/es.ts'
import en from 'vuetify/src/locale/en.ts'
Vue.use(Vuetify);

export default new Vuetify({
    theme: {
      themes: {
        light: {
          primary: '#546e7a',
          secondary: '#b0bec5',
          accent: '#8c9eff',
          error: '#b71c1c',
        },
      },
    },
    lang: {
        locales: {es, en },
        current: 'en'
    },
});
