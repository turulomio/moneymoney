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
    devServer: {
        open: process.platform === 'darwin',
        host: '0.0.0.0',
        port: 8080, 
        hotOnly: false,    
    },

    publicPath: process.env.VUE_APP_PUBLIC_PATH

}

