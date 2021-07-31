
<template>
    <div>    
        <h1>{{ $t('Accounts list') }}
            <MyMenuInline :items="menuinline_items" @selected="MyMenuInlineSelection"></MyMenuInline>

        </h1>
        <v-card outlined class="ma-4 pa-4">
            <v-checkbox v-model="showActive" :label="setCheckboxLabel()" @click="on_chkActive()" ></v-checkbox>
            <v-data-table dense :headers="accounts_headers" :items="accounts_items" sort-by="percentage_selling_point" class="elevation-1" hide-default-footer disable-pagination :loading="loading_accounts" :key="key">
                <template v-slot:[`item.last_datetime`]="{ item }">
                    {{localtime(item.last_datetime)}}
                </template>  
                <template v-slot:[`item.balance_user`]="{ item }">
                    <div v-html="localcurrency_html(item.balance_user)"></div>
                </template>     
                <template v-slot:[`item.balance_account`]="{ item }">
                    <div v-html="currency_html(item.balance_account, item.currency )"></div>
                </template>                   
                <template v-slot:[`item.active`]="{ item }">
                    <v-icon small v-if="item.active" >mdi-check-outline</v-icon>
                </template>         

                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small class="mr-2" @click="viewItem(item)">mdi-eye</v-icon>
                    <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                    <v-icon small @click="deleteItem(item)" v-if="item.is_deletable">mdi-delete</v-icon>
                </template>                  
                <template v-slot:[`body.append`]="{headers}">
                    <tr style="background-color: WhiteSmoke">
                        <td v-for="(header,i) in headers" :key="i">
                            <div v-if="header.value == 'name'">
                                Total
                            </div>
                            <div v-if="header.value == 'balance_user'" align="right" v-html="localcurrency_html(listobjects_sum(accounts_items,'balance_user'))">
                            </div>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog v-model="dialog" max-width="550">
            <v-card class="pa-4">
                <v-card-title class="headline">{{dialog_title()}}</v-card-title>
                <v-form ref="form" v-model="form_valid" >
                    <v-text-field v-model="account.name" type="text" :label="$t('Account name')" required :placeholder="$t('Account name')" autofocus :rules="RulesString(200,false)" counter="200"/>
                    <v-checkbox v-model="account.active" :label="$t('Is active?')" ></v-checkbox>
                    <v-text-field v-model="account.number" type="text" :label="$t('Account number')" required :placeholder="$t('Account number')" :rules="RulesString(30,true)" counter="30"/>
                    <v-autocomplete :items="$store.state.catalogs.currencies" v-model="account.currency" :label="$t('Select a currency')" item-text="fullname" item-value="id" required :rules="RulesSelection(false)"></v-autocomplete>
                    <v-autocomplete ref="autocompleteBanks" :items="$store.state.catalogs.banks.filter(v =>v.active==true)" v-model="account.banks" :label="$t('Select a bank')" item-text="name" item-value="url" required :rules="RulesSelection(false)"></v-autocomplete>
                </v-form>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="acceptDialog()" :disabled="!form_valid">{{ $t("Log in") }}</v-btn>
                    <v-btn color="error" @click="dialog = false">{{ $t("Cancel") }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialog_view">
            <v-card class="pa-4">
                <AccountsView :account="account" :key="key"></AccountsView>
            </v-card>
        </v-dialog>

    </div>
</template>
<script>
    import axios from 'axios'
    import MyMenuInline from './MyMenuInline.vue'
    import AccountsView from './AccountsView.vue'
    import {localtime} from '../functions.js'
    export default {
        components:{
            MyMenuInline,
            AccountsView,
        },
        data(){ 
            return{
                showActive:true,
                accounts_headers: [
                    { text: this.$t('Name'), sortable: true, value: 'name'},
                    { text: this.$t('Bank'), sortable: true, value: 'banks__name'},
                    { text: this.$t('Active'), value: 'active',  width: "8%"},
                    { text: this.$t('Number'), value: 'number',  width: "8%", align:'right'},
                    { text: this.$t('Balance'), value: 'balance_account',  width: "8%", align:'right'},
                    { text: this.$t('Balance user currency'), value: 'balance_user',  width: "8%", align:'right'},
                    { text: this.$t('Actions'), value: 'actions', sortable: false , width: "8%"},
                ],
                accounts_items:[],
                menuinline_items: [
                    {
                        subheader: this.$t("Bank options"),
                        children: [
                            {
                                name:"Add a new account",
                                icon: "mdi-pencil",
                                code: function(this_){
                                    this_.editing=false
                                    this_.account=this_.empty_account()
                                    this_.dialog=true
                                },
                            },
                        ]
                    },
                ],
                dialog:false,
                form_valid: false,
                account: this.empty_account(),
                editing:false,
                loading_accounts:false,

                dialog_view:false,
                key:0,
            }
        },
        methods: {
            localtime,
            dialog_title(){
                if(this.editing==true){
                    return this.$t("Updating account")
                } else {
                    return this.$t("Creating a new account")
                }
            },
            empty_account(){
                return {
                    name: "",
                    active: true,
                    number: "",
                    currency: "EUR",    
                    banks:null,
                }
            },
            MyMenuInlineSelection(item){
                item.code(this)
            },
            editItem (item) {
                this.account=item
                this.editing=true
                this.dialog=true
            },
            viewItem (item) {
                this.key=this.key+1
                this.account=item
                this.dialog_view=true
            },
            deleteItem (item) {
               var r = confirm(this.$t("Do you want to delete this item?"))
               if(r == false) {
                  return
               } 
               r = confirm(this.$t("This account will be deleted. Do you want to continue?"))
               if(r == false) {
                  return
               } 
                axios.delete(item.url, this.myheaders())
                .then((response) => {
                    console.log(response);
                    this.update_table()
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            update_table(){
                this.loading_accounts=true
                axios.get(`${this.$store.state.apiroot}/accounts/withbalance?active=${this.showActive}`, this.myheaders())
                .then((response) => {
                    this.accounts_items=response.data
                    console.log(response.data);
                    this.loading_accounts=false
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            on_chkActive(){
                this.update_table()
            },
            setCheckboxLabel(){
                if (this.showActive== true){
                    return this.$t("Uncheck to see inactive accounts")
                } else {
                    return this.$t("Check to see active accounts")
                }
            },
            acceptDialog(){
                console.log(this.account)
                console.log(this.$refs)
                if (this.editing==true){               
                    axios.put(this.account.url, this.account, this.myheaders())
                    .then((response) => {
                            console.log(response.data)
                            this.update_table()     
                            this.dialog=false
                            this.editing=false
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else{
                    axios.post(`${this.$store.state.apiroot}/api/accounts/`, this.account,  this.myheaders())
                    .then((response) => {
                            console.log(response.data)
                            this.update_table()     
                            this.dialog=false
                            this.editing=false
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
            },
        },
        mounted(){
            this.update_table()
        }
    }
</script>

