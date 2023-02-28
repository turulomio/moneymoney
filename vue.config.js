
var wp
if (process.env.NODE_ENV==="production"){
  wp={
    mode: 'production',
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    }
  }
} else { //Development
  wp={
    mode: 'development',
    devtool: 'inline-source-map',

//    devServer: {
//        host: '127.0.0.1',
        //port: 8080,
        //public: 'localhost:8080',
//  },
  }
}
var common={
  resolve: {
    fallback: {
        path: false,
        fs:false,
    },
  },
}



module.exports = {
    configureWebpack: {...wp,...common},

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
