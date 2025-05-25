<template>
    <div>
        <h1>{{ $t("Wellcome to Money Money") }}</h1>
        <h2>{{ `${useStore().version} (${useStore().versiondate.toISOString().slice(0,10)})` }}</h2>
        <v-img :src="imgUrl" height="200px" contain ></v-img>
        <div v-if="alerts">
            <v-alert density="compact" class="mx-15 px-10 mb-2" outlined type="warning" v-if="time_message().length>0"> {{time_message}}</v-alert>   
            <v-alert class="mx-15 px-10 mb-2" type="error" variant="outlined" v-if="alerts.orders_expired.length>0"> 
                <p>{{f($t("Orders expired in last [0] days :"), [alerts.expired_days])}}</p>
                <ul>    
                    <li v-for="(order,i) in alerts.orders_expired" :key="i">      - {{ order.expiration }}. {{ order.investmentsname}}</li>
                </ul>
            </v-alert>
            <v-alert class="mx-15 px-10 mb-2" type="error" variant="outlined" v-if="alerts.banks_inactive_with_balance.length>0"> 
                <p>{{$t("Inactive banks with balance:")}}</p>
                <ul>    
                    <li v-for="(bank,i) in alerts.banks_inactive_with_balance" :key="i">      - {{ f($t(`Bank '[0]' has a total balance of [1]`), [bank.localname, currency_string(bank.balance_total, useStore().profile.currency)]) }}.  </li>
                </ul>
            </v-alert>
            <v-alert class="mx-15 px-10 mb-2" type="error" variant="outlined" v-if="alerts.accounts_inactive_with_balance.length>0"> 
                <p>{{$t("Inactive accounts with balance:")}}</p>
                <ul>    
                    <li v-for="(account,i) in alerts.accounts_inactive_with_balance" :key="i">    - {{ f($t(`Account '[0]' has a total balance of [1]`), [account.localname, currency_string(account.balance_user, useStore().profile.currency)]) }}.  </li>
                </ul>
            </v-alert>
            <v-alert class="mx-15 px-10 mb-2" type="error" variant="outlined" v-if="alerts.investments_inactive_with_balance.length>0"> 
                <p>{{$t("Inactive investments with balance:")}}</p>
                <ul>    
                    <li v-for="(investment,i) in alerts.investments_inactive_with_balance" :key="i">    - {{ f($t(`Investment '[0]' has a total balance of [1]`), [investment.data.name, currency_string(investment.total_io_current.balance_user, useStore().profile.currency)]) }}.  </li> 
                </ul>
            </v-alert>
            <v-alert class="mx-15 px-10 mb-2" type="success" variant="outlined" v-if="(alerts.banks_inactive_with_balance.length + alerts.investments_inactive_with_balance.length + alerts.orders_expired.length + alerts.accounts_inactive_with_balance.length)==0"> 
                <p>{{$t("You haven't alerts, everything is fine")}}</p>
            </v-alert>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { useStore } from "@/store"
import imgUrl from '@/assets/moneymoney.png'
import { parseResponseError,myheaders, currency_string } from '@/functions'
import {f} from 'vuetify_rules'


export default {
    components: {
    },
    props: {
    },
    data(){ 
        return {
            diff_time: null,
            alerts: null,
            imgUrl:imgUrl
        }
    },
    watch:{
    },
    methods: {
        useStore,
        parseResponseError,
        myheaders,
        f,
        currency_string,  

        get_alerts(){
            if (!this.useStore().logged) return
            axios.get(`${this.useStore().apiroot}/alerts/`,this.myheaders())
            .then((response) => {
                console.log(response.data)
                this.alerts=response.data
                let local=new Date()
                let server= new Date(this.alerts.server_time)
                this.diff_time=local-server

                console.log(`Local time: ${local.toISOString()}`)
                console.log(`Server time: ${server.toISOString()}`)
                console.log(`Difference (ms): ${this.diff_time}`)
            }, (error) => {
                this.parseResponseError(error)
            });
        },
        time_message(){
            return (this.diff_time.value>=Math.abs(1000)) ? f(this.$t("There is a time difference between the browser and the server of [0] ms. Please contact server administrator."), [this.diff_time]) : ""
        }
    },
    created(){
        this.get_alerts()
    }
}
</script>