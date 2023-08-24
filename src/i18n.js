// import Vue from 'vue'
import { createI18n } from 'vue-i18n'
import json_es from './locales/es.json'

// Vue.use(VueI18n)

// function loadLocaleMessages () {
//   const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
//   const messages = {}
//   locales.keys().forEach(key => {
//     const matched = key.match(/([A-Za-z0-9-_]+)\./i)
//     if (matched && matched.length > 1) {
//       const locale = matched[1]
//       messages[locale] = locales(key)
//     }
//   })
//   return messages
// }

// export default new VueI18n({
//   locale: process.env.VUE_APP_I18N_LOCALE || 'en',
//   fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
//   silentTranslationWarn: true,
//   messages: loadLocaleMessages()
// })



// 2. Create i18n instance with options
const i18n=createI18n({
  globalInjection: true,
  legacy:true,
  locale: 'en', // set locale
  fallbackLocale: 'en', // set fallback locale
  silentFallbackWarn: true,

  silentTranslationWarn: true,

  messages:{
    es:json_es
  }
})

export default i18n