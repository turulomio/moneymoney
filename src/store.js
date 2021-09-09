import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        token:null,
        logged:false,
        version: "0.1.0",
        versiondate: new Date(2021, 6, 25, 9, 22),
        apiroot: process.env.VUE_APP_DJANGO_MONEYMONEY_URL,
        publicPath: process.env.VUE_APP_PUBLIC_PATH,
        lastsearch: "",
        local_currency:"EUR",
        local_zone:"Europe/Madrid",
        investments: [],
        concepts:[],
    },    
    mutations: { // Only sincronous changes data
        updateInvestments: (state, payload) =>{
            state.investments=payload
            console.log("Updated investments")
            console.log(state.investments)
        }
    },
    actions: {// Can be asynchronous. Fetch data
        getInvestments({commit}){
            axios.get(`${store.state.apiroot}/api/investments/`, store.$app.myheaders())
            .then((response) => {
                commit('updateInvestments', response.data)
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        }
    }
})