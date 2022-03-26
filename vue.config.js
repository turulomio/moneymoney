const fs = require('fs');

module.exports = {
    transpileDependencies: [
        'vuetify'
    ],

    pluginOptions: {
        i18n: {
            locale: 'en',
            fallbackLocale: 'en',
            localeDir: 'locales',
            enableInSFC: true
        }
    },  
    publicPath: process.env.VUE_APP_PUBLIC_PATH

}

