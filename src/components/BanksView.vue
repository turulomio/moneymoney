
<template>
    <div>    
        <h1>{{ f($t("Bank details of '[0]'"), [bank.name]) }}</h1>

        <DisplayValues :items="displayvalues()" :minimized_items="1"></DisplayValues>

        <v-card outlined class="ma-4 pa-4">
            <v-card-title class="headline">{{$t('Accounts')}}</v-card-title>
            <v-data-table density="compact" :headers="accounts_headers" :items="accounts_items" :sort-by="[{key:'name',order:'asc'}]" class="elevation-1" :loading="loading_accounts" :key="key"     :items-per-page="10000" >
                <template #item.name="{item}">
                    {{ useStore().accounts.get(item.url)?.fullname }}
                </template>  
                <template #item.active="{item}">
                    <div class="text-center" ><v-icon small v-if="item.active" >mdi-check-outline</v-icon></div>
                </template>  
                <template #item.balance_user="{item}">
                    <div class="text-right" v-html="localcurrency_html(item.balance_user )"></div>
                </template>
                <template #tbody>
                    <tr class="totalrow pa-6">
                        <td>{{ $t("Total") }}</td>
                        <td></td>
                        <td class="text-right" v-html="localcurrency_html(listobjects_sum(accounts_items,'balance_user'))"></td>
                    </tr>
                </template>
                <template #bottom ></template>
            </v-data-table>
        </v-card>        
        <v-card outlined class="ma-4 pa-4">
            <v-card-title class="headline">{{$t('Investments')}}</v-card-title>
            <v-data-table density="compact" :headers="investments_headers" :items="investments_items" :sort-by="[{key:'name',order:'asc'}]" class="elevation-1" :loading="loading_investments" :key="key"    :items-per-page="10000" >
                <template #item.active="{item}">
                    <div class="text-center" ><v-icon small v-if="item.active" >mdi-check-outline</v-icon></div>
                </template>  
                <template #item.balance_user="{item}">
                    <div class="text-right" v-html="localcurrency_html(item.balance_user )"></div>
                </template>
                <template #tbody>
                    <tr class="totalrow pa-6">
                        <td>{{ $t("Total") }}</td>
                        <td></td>
                        <td class="text-right" v-html="localcurrency_html(listobjects_sum(investments_items,'balance_user'))"></td>
                    </tr>
                </template>
                <template #bottom ></template>
            </v-data-table>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import { useStore } from "@/store"
    import DisplayValues from './DisplayValues.vue'
    import {f} from "vuetify_rules"
    export default {
        components: {
            DisplayValues,
        },
        props: {
            bank: {
                required: true
            },
        },
        data(){ 
            return{
                showActive:true,
                accounts_headers: [
                    { title: this.$t('Name'), sortable: true, key: 'name'},
                    { title: this.$t('Active'), key: 'active',  width: "12%"},
                    { title: this.$t('Balance'), key: 'balance_user', align:'end',  width: "12%"},
                ],
                investments_headers: [
                    { title: this.$t('Name'), sortable: true, key: 'fullname'},
                    { title: this.$t('Active'), key: 'active',  width: "12%"},
                    { title: this.$t('Balance'), key: 'balance_user', align:'end',  width: "12%"},
                ],
                accounts_items:[],
                investments_items:[],
                loading_accounts:false,
                loading_investments:false,
                key:0,
            }
        },
        methods: {    
            useStore,    
            f,    
            displayvalues(){
                return [
                    {title:this.$t('Active'), value: this.bank.active},
                    {title:this.$t('Id'), value: this.bank.id},
                ]
            },
            update_accounts(){
                this.loading_accounts=true
                axios.get(`${this.useStore().apiroot}/api/accounts/withbalance/?bank=${this.bank.id}`, this.myheaders())
                .then((response) => {
                    this.loading_accounts=false
                    this.accounts_items=response.data
                    this.key=this.key+1
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            update_investments(){
                this.loading_investments=true
                axios.get(`${this.useStore().apiroot}/api/investments/withbalance/?bank=${this.bank.id}&active=true`, this.myheaders())
                .then((response) => {
                    this.key=this.key+1
                    this.loading_investments=false
                    this.investments_items=response.data
                    this.key=this.key+1
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
        },
        mounted(){
            this.update_accounts()
            this.update_investments()
        }
    }
</script>

