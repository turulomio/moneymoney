<template>
    <div>    
        <h1>{{ $t('Accounts list') }}
            <MyMenuInline :items="menuinline_items"/>
        </h1>
        <v-card outlined class="ma-4 pa-4">
            <v-checkbox v-model="showActive" :label="chkLabel" ></v-checkbox>
            <v-data-table :headers="accounts_headers" density="compact" :items="accounts_items" :sort-by="[{key:'datetime',order:'asc'}]" class="elevation-1 cursorpointer" fixed-header :loading="loading_accounts" :key="key" @click:row="viewItem" :items-per-page="1000000">
                <template  #item.last_datetime="{item}">
                    {{localtime(item.last_datetime)}}
                </template>             
                <template #item.banks="{item}">
                    <div v-html="useStore().banks.get(item.banks).localname"></div>
                </template>     
                <template #item.balance_user="{item}">
                    <div :data-test="`AccountsList_Table_Row${item.id}`" class="text-right" v-html="localcurrency_html(item.balance_user)"></div>
                </template>     
                <template #item.balance_account="{item}">
                    <div class="text-right" v-html="currency_html(item.balance_account, item.currency )"></div>
                </template>
                <template #item.active="{item}">
                    <div class="text-center"><v-icon small v-if="item.active" >mdi-check-outline</v-icon></div>
                </template>

                <template #item.actions="{item}">
                    <v-icon :data-test="`AccountsList_Table_ButtonUpdate${item.id}`" small class="mr-2" @click.stop="editItem(item)">mdi-pencil</v-icon>
                    <v-icon :data-test="`AccountsList_Table_ButtonDelete${item.id}`" small @click.stop="deleteItem(item)" v-if="item.is_deletable">mdi-delete</v-icon>
                </template>   
                <template #bottom ></template>        
                <template #tbody>
                    <tr class="totalrow" >
                        <td >{{ f($t("Total ([0] registers)"), [accounts_items.length]) }}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td class="text-right" v-html="localcurrency_html(listobjects_sum(accounts_items,'balance_user'))"></td>
                        <td></td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog v-model="dialog" width="35%">
            <v-card class="pa-4">
                <AccountsCU :account="account" :mode="account_mode" :key="key" @cruded="on_AccountsCU_cruded"></AccountsCU>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialog_view">
            <v-card class="pa-4">
                <AccountsView :account="account" :key="key" @cruded="on_AccountsView_cruded"></AccountsView>
            </v-card>
        </v-dialog>
        <!-- ACCOUNTS OPERATIONS SEARCH -->
        <v-dialog v-model="dialog_search">
            <v-card class="pa-4">
                <AccountsoperationsSearch :key="key"  @cruded="on_AccountsoperationsSearch_cruded"></AccountsoperationsSearch>
            </v-card>
        </v-dialog>

        <!-- DIALOG ACCOUNT TRANSFER -->
        <v-dialog v-model="dialog_transfer" width="35%">
            <v-card class="pa-6">
                <AccountsTransfer :at="at" mode="C" @cruded="on_AccountTransfer_cruded" :key="key"></AccountsTransfer>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import axios from 'axios'
    import { useStore } from "@/store"
    import MyMenuInline from './MyMenuInline.vue'
    import AccountsoperationsSearch from './AccountsoperationsSearch.vue'
    import AccountsCU from './AccountsCU.vue'
    import AccountsView from './AccountsView.vue'
    import AccountsTransfer from './AccountsTransfer.vue'
    import {empty_account,empty_account_transfer} from '../empty_objects.js'
    import { localtime,f } from 'vuetify_rules'
    export default {
        name:"AccountsList",
        components:{
            MyMenuInline,
            AccountsCU,
            AccountsView,
            AccountsTransfer,
            AccountsoperationsSearch,
        },
        data(){ 
            return{
                showActive:true,
                chkLabel:"",
                accounts_headers: [
                    { title: this.$t('Name'), sortable: true, key: 'localname', width:"21%"},
                    { title: this.$t('Bank'), sortable: true, key: 'banks', width:"21%"},
                    { title: this.$t('Active'), key: 'active',  width: "8%"},
                    { title: this.$t('Currency'), key: 'currency',  width: "8%"},
                    { title: this.$t('Number'), key: 'number',  width: "10%", align:'end'},
                    { title: this.$t('Balance'), key: 'balance_account',  width: "12%", align:'end'},
                    { title: this.$t('Balance user currency'), key: 'balance_user', width: "12%", align:'end'},
                    { title: this.$t('Actions'), key: 'actions', sortable: false , width: "7%"},
                ],
                accounts_items:[],
                menuinline_items: [
                    {
                        subheader: this.$t("Account options"),
                        children: [
                            {
                                name: this.$t("Add a new account"),
                                icon: "mdi-pencil",
                                code: function(){
                                    this.account=this.empty_account()
                                    this.account_mode="C"
                                    this.dialog=true
                                }.bind(this),
                            },
                            { 
                                name:this.$t('Add an account transfer'), 
                                code: function(){
                                    this.at=this.empty_account_transfer()
                                    this.key=this.key+1
                                    this.dialog_transfer=true
                                }.bind(this),
                                icon: "mdi-plus" 
                            },
                        ]
                    },
                    {
                        subheader: this.$t("Account operations options"),
                        children: [
                            {
                                name: this.$t("Search by string"),
                                icon: "mdi-magnify",
                                code: function(){
                                    this.key=this.key+1
                                    this.dialog_search=true
                                }.bind(this),
                            },
                        ]
                    },
                ],
                dialog:false,
                form_valid: false,
                account: null,
                account_mode: false,
                loading_accounts:false,

                dialog_view:false,
                key:0,

                // Accountsoperations search
                dialog_search:false,

                //AccountsTransfer
                at:null,
                dialog_transfer:false,
            }
        },
        watch:{
            showActive () {
                this.update_table()
            },
        },
        methods: {
            useStore,
            empty_account,
            empty_account_transfer,
            f,
            localtime,
            editItem (item) {
                this.account=item
                this.account_mode="U"
                this.key=this.key+1
                this.dialog=true
            },
            viewItem (event,object) {
                this.account=object.item
                this.key=this.key+1
                this.dialog_view=true
            },
            deleteItem (item) {
                this.account=item
                this.key=this.key+1
                this.account_mode="D"
                this.dialog=true
            },
            update_table(){
                if (this.showActive== true){
                    this.chkLabel=this.$t("Uncheck to see inactive accounts")
                } else {
                    this.chkLabel=this.$t("Check to see active accounts")
                }
                this.loading_accounts=true
                axios.get(`${this.useStore().apiroot}/api/accounts/withbalance/?active=${this.showActive}`, this.myheaders())
                .then((response) => {
                    this.accounts_items=response.data
                    this.loading_accounts=false
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            on_AccountsoperationsSearch_cruded(){
                this.update_table()
            },
            on_AccountsCU_cruded(){
                this.dialog=false
                this.update_table()
            },
            on_AccountsView_cruded(){
                this.update_table()
            },
            on_AccountTransfer_cruded(){
                this.dialog_transfer=false
                this.update_table()
            },
        },
        mounted(){
            this.update_table()
        }
    }
</script>

