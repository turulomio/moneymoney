<template>
    <div>
        <h1>{{ $t("Wellcome to Money Money") }}</h1>
        <h2>{{ `${useStore().version} (${useStore().versiondate.toISOString().slice(0,10)})` }}</h2>
        <v-img :src="imgUrl" height="200px" contain ></v-img>
        <v-alert density="compact" class="mx-15 px-10 mb-2" outlined type="warning" v-if="time_message.length>0"> {{time_message}}</v-alert>   
        <v-alert class="mx-15 px-10 mb-2" type="error" :key="i" variant="outlined" v-if="alerts?.orders_expired.length>0"> 
            <p>{{f($t("Orders expired in last [0] days :"), [alerts.expired_days])}}</p>
            <ul>    
                <li v-for="(order,i) in alerts.orders_expired" :key="i">      - {{ order.expiration }}. {{ useStore().investments.get(order.investments).fullname}}</li>
            </ul>
        </v-alert>
        <v-alert class="mx-15 px-10 mb-2" type="error" :key="i" variant="outlined" v-if="alerts?.investments_inactive_with_balance.length>0"> 
            <p>{{$t("Inactive investments with balance:")}}</p>
            <ul>    
                <li v-for="(investment,i) in alerts.investments_inactive_with_balance" :key="i">      - {{ 
                    useStore().investments.get(hyperlinked_url("investments",investment.data.investments_id)).fullname }}. {{ currency_generic_html(investment.total_io_current.balance_investment,investment.data.currency_product)}}</li>
            </ul>
        </v-alert>    
        <v-alert class="mx-15 px-10 mb-2" type="error" :key="i" variant="outlined" v-if="alerts?.accounts_inactive_with_balance.length>0"> 
            <p>{{$t("Inactive accounts with balance:")}}</p>
            <ul>    
                <li v-for="(account,i) in alerts.accounts_inactive_with_balance" :key="i">      -  {{ 
                    useStore().accounts.get(account.url).fullname }}. {{ currency_generic_html(account.balance_user, useStore().profile.currency)}}</li>
            </ul>
        </v-alert>            

    </div>
</template>

<script setup>
import axios from 'axios'
import { useStore } from "@/store"
import imgUrl from '@/assets/moneymoney.png'
import {f} from 'vuetify_rules'
import { ref,reactive } from 'vue'
import { parseResponseError,myheaders } from '@/functions'


const diff_time=ref()
const alerts

function get_alerts(){
    if (!useStore().logged) return
    axios.get(`${useStore().apiroot}/alerts/`, myheaders())
    .then((response) => {
        alerts=reactive(response.data)
        let local=new Date()
        let server= new Date(alerts.server_time)
        diff_time.value=local-server

        console.log(`Local time: ${local.toISOString()}`)
        console.log(`Server time: ${server.toISOString()}`)
        console.log(`Difference (ms): ${diff_time.value}`)
    }, (error) => {
        parseResponseError(error)
    });
}

function time_message(){
    return (this.diff_time.value>=Math.abs(1000)) ? f(this.$t("There is a time difference between the browser and the server of [0] ms. Please contact server administrator."), [this.diff_time]) : ""
}


get_alerts()
</script>
