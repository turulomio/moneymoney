
<template>
    <div>    
        <h1>{{ $t("Bank details of '{0}'").format(bank.name) }}</h1>

        <DisplayValues :items="displayvalues()" :minimized_items="1"></DisplayValues>

        <v-card outlined class="ma-4 pa-4">
            <v-card-title class="headline">{{$t('Accounts')}}</v-card-title>
            <v-data-table dense :headers="accounts_headers" :items="accounts_items" sort-by="name" class="elevation-1" hide-default-footer :loading="loading_accounts" :key="key">
                <template v-slot:[`item.active`]="{ item }">
                    <v-icon small v-if="item.active" >mdi-check-outline</v-icon>
                </template>  
                <template v-slot:[`item.balance_user`]="{ item }">
                    <div v-html="localcurrency_html(item.balance_user )"></div>
                </template>                          
                <template v-slot:[`body.append`]="{headers}">
                    <tr class="totalrow">
                        <td v-for="(header,i) in headers" :key="i">
                            <div v-if="header.value == 'name'">
                                Total
                            </div>
                            <div v-if="header.value == 'balance_user'" class="d-flex justify-end" v-html="localcurrency_html(listobjects_sum(accounts_items,'balance_user'))">
                            </div>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>        
        <v-card outlined class="ma-4 pa-4">
            <v-card-title class="headline">{{$t('Investments')}}</v-card-title>
            <v-data-table dense :headers="investments_headers" :items="investments_items" sort-by="name" class="elevation-1" hide-default-footer :loading="loading_investments" :key="key">
                <template v-slot:[`item.active`]="{ item }">
                    <v-icon small v-if="item.active" >mdi-check-outline</v-icon>
                </template>  
                <template v-slot:[`item.balance_user`]="{ item }">
                    <div v-html="localcurrency_html(item.balance_user )"></div>
                </template>                          
                <template v-slot:[`body.append`]="{headers}">
                    <tr class="totalrow">
                        <td v-for="(header,i) in headers" :key="i">
                            <div v-if="header.value == 'name'">
                                Total
                            </div>
                            <div v-if="header.value == 'balance_user'" class="d-flex justify-end" v-html="localcurrency_html(listobjects_sum(investments_items,'balance_user'))">
                            </div>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import DisplayValues from './DisplayValues.vue'
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
                    { text: this.$t('Name'), sortable: true, value: 'name'},
                    { text: this.$t('Active'), value: 'active',  width: "12%"},
                    { text: this.$t('Balance'), value: 'balance_user', align:'right',  width: "12%"},
                ],
                investments_headers: [
                    { text: this.$t('Name'), sortable: true, value: 'name'},
                    { text: this.$t('Active'), value: 'active',  width: "12%"},
                    { text: this.$t('Balance'), value: 'balance_user', align:'right',  width: "12%"},
                ],
                accounts_items:[],
                investments_items:[],
                loading_accounts:false,
                loading_investments:false,
                key:0,
            }
        },
        methods: {            
            displayvalues(){
                return [
                    {title:this.$t('Active'), value: this.bank.active},
                    {title:this.$t('Id'), value: this.bank.id},
                ]
            },
            update_accounts(){
                this.loading_accounts=true
                axios.get(`${this.$store.state.apiroot}/api/accounts/withbalance/?bank=${this.bank.id}`, this.myheaders())
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
                axios.get(`${this.$store.state.apiroot}/api/investments/withbalance/?bank=${this.bank.id}`, this.myheaders())
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

