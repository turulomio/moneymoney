import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import es from 'vuetify/src/locale/es.ts'
import en from 'vuetify/src/locale/en.ts'
Vue.use(Vuetify);

export default new Vuetify({
    lang: {
        locales: {es, en },
        current: 'en'
    },
});
