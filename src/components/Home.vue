<template>
    <div>
        <h1>{{ $t("Wellcome to Money Money") }}</h1>
        <h2>{{ `${store().version} (${store().versiondate.toISOString().slice(0,10)})` }}</h2>
        <v-img :src="imgUrl" height="200px" contain ></v-img>
        <v-alert density="compact" class="mx-15 px-10 mb-2" outlined type="warning" v-if="time_message.length>0"> {{time_message}}</v-alert>   
        <v-alert class="mx-15 px-10 mb-2" type="error" :key="i" variant="outlined" v-if="alerts?.orders_expired.length>0"> 
            <p>{{$t("Orders expired in last [0] days :").format(alerts.expired_days)}}</p>
            <ul>    
                <li v-for="(order,i) in alerts.orders_expired" :key="i">      - {{ localtime(order.expiration).slice(0,10) }}. {{ store().investments.get(order.investments).fullname}}</li>
            </ul>
        </v-alert>
        <v-alert class="mx-15 px-10 mb-2" type="error" :key="i" variant="outlined" v-if="alerts?.investments_inactive_with_balance.length>0"> 
            <p>{{$t("Inactive investments with balance:")}}</p>
            <ul>    
                <li v-for="(investment,i) in alerts.investments_inactive_with_balance" :key="i">      - {{ 
                    store().investments.get(hyperlinked_url("investments",investment.data.investments_id)).fullname }}. {{ currency_generic_html(investment.total_io_current.balance_investment,investment.data.currency_product)}}</li>
            </ul>
        </v-alert>    
        <v-alert class="mx-15 px-10 mb-2" type="error" :key="i" variant="outlined" v-if="alerts?.accounts_inactive_with_balance.length>0"> 
            <p>{{$t("Inactive accounts with balance:")}}</p>
            <ul>    
                <li v-for="(account,i) in alerts.accounts_inactive_with_balance" :key="i">      -  {{ 
                    store().accounts.get(account.url).fullname }}. {{ currency_generic_html(account.balance_user, store().profile.currency)}}</li>
            </ul>
        </v-alert>            

    </div>
</template>
<script>
    import axios from 'axios'
    import imgUrl from '@/assets/moneymoney.png'
    export default {
        components:{
        },
        data(){
            return {
                imgUrl:imgUrl,
                alerts:null,
                diff_time:null
            }
        },
        computed:{
            time_message(){
                return (this.diff_time>=Math.abs(1000)) ?  this.$t("There is a time difference between the browser and the server of [0] ms. Please contact server administrator.").format(this.diff_time): ""
            },
        },
        methods:{
            get_alerts(){
                if (!this.store().logged) return
                axios.get(`${this.store().apiroot}/alerts/`, this.myheaders())
                .then((response) => {
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
        },
        created(){
            this.get_alerts()
        }
    }
</script>
