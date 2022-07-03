<template>
    <div>
        <h1>{{ $t(`Account details of '{0}'`).format(account.localname) }}
        <MyMenuInline :items="items"  :context="this"></MyMenuInline>  </h1>
        <DisplayValues :items="displayvalues"></DisplayValues>
   
        <v-tabs v-model="tab"  background-color="primary" dark>
            <v-tab key="ao">{{ $t("Account operations")}}</v-tab>
            <v-tab key="cc">{{ $t("Credit cards")}}</v-tab>
            <v-tab-item key="ao">     
                <v-card class="pa-4 d-flex justify-center" outlined style="min-width: 100px; max-width: 100%;">
                    <v-date-picker dense no-title class="mymonthpicker " ref="monthpicker" v-model="monthpicker" type="month"></v-date-picker>
                    <v-divider class="mx-2" vertical ></v-divider>
                    <TableAccountOperations ref="tao" :homogeneous="true" :items="items_ao" :total_currency="account.currency" height="400" class=" flex-grow-1 flex-shrink-0" @cruded="on_TableAccountOperations_cruded()"></TableAccountOperations>
                </v-card>
            </v-tab-item>
            <v-tab-item key="cc">
                <v-card class="padding" outlined>
                    <v-checkbox v-model="showActiveCC" :label="setCheckboxLabelCC()" @click="on_chkActive_cc()" ></v-checkbox>
                    <v-data-table dense :headers="table_cc_headers" :items="table_cc"  class="elevation-1" disable-pagination  hide-default-footer sort-by="name" fixed-header max-height="400" :key="key">
                        <template v-slot:[`item.deferred`]="{ item }">
                            <v-simple-checkbox v-model="item.deferred" disabled></v-simple-checkbox>
                        </template>  
                        <template v-slot:[`item.maximumbalance`]="{ item }">
                            <div v-html="currency_html(item.maximumbalance, item.account_currency )"></div>
                        </template>  
                        <template v-slot:[`item.balance`]="{ item }">
                            <div v-html="currency_html(item.balance, item.account_currency )"></div>
                        </template>     
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-icon v-if="item.deferred" small class="mr-2" @click="viewCC(item)">mdi-eye</v-icon>
                            <v-icon v-if="!item.deferred" small class="mr-2" @click="CCONotDeferred(item)">mdi-plus</v-icon>
                            <v-icon small class="mr-2" @click="editCC(item)">mdi-pencil</v-icon>
                            <v-icon small @click="deleteCC(item)" v-if="item.is_deletable">mdi-delete</v-icon>
                        </template>
                    </v-data-table>   
                </v-card>
            </v-tab-item>
        </v-tabs>  
        <!-- DIALOG ACCOUNTSOPERATIONS ADD/UPDATE -->
        <v-dialog v-model="dialog_ao" max-width="700">
            <v-card class="pa-8">
                <AccountsoperationsCU :ao="ao" :key="key" @cruded="on_AccountsoperationsCU_cruded"></AccountsoperationsCU>
            </v-card>
        </v-dialog>
        <!-- DIALOG CREDIT CARD ADD/UPDATE -->
        <v-dialog v-model="dialog_cc" max-width="550">
            <v-card class="pa-4">
                <CreditcardsCU :cc="cc" @cruded="on_CreditcardsCU_cruded()" :key="key"></CreditcardsCU>
            </v-card>
        </v-dialog>

        <!-- DIALOG CREDIT CARD VIEW -->
        <v-dialog v-model="dialog_ccview">
            <v-card class="pa-4">
                <CreditcardsView :cc="cc" :account="account" @cruded="on_CreditcardsView_cruded()" :key="key"></CreditcardsView>
            </v-card>
        </v-dialog>

        <!-- DIALOG ACCOUNT TRANSFER -->
        <v-dialog v-model="dialog_transfer" width="550">
            <v-card class="pa-6">
                <AccountsTransfer :at="at" @cruded="on_AccountTransfer_cruded()" :key="key"></AccountsTransfer>
            </v-card>
        </v-dialog>

    </div>
</template>  
<script>     
    import axios from 'axios' 
    import AccountsoperationsCU from './AccountsoperationsCU.vue'
    import AccountsTransfer from './AccountsTransfer.vue'
    import DisplayValues from './DisplayValues.vue'
    import MyMenuInline from './MyMenuInline.vue'
    import CreditcardsCU from './CreditcardsCU.vue'
    import CreditcardsView from './CreditcardsView.vue'
    import TableAccountOperations from './TableAccountOperations.vue'
    import {empty_account_operation,empty_credit_card,empty_account_transfer} from '../empty_objects.js'
    export default {
        components:{
            AccountsoperationsCU,
            AccountsTransfer,
            MyMenuInline,
            DisplayValues,
            TableAccountOperations,
            CreditcardsCU,
            CreditcardsView,
        },
        props:{
            account:{
                required:true,
            }
        },
        data () {
            return {
                displayvalues:[
                    {title:this.$t('Number'), value: this.account.number},
                    {title:this.$t('Currency'), value: this.account.currency},
                    {title:this.$t('Active'), value: this.account.active},
                    {title:this.$t('Id'), value: this.account.id},
                ],
                monthpicker: new Date().toISOString().substr(0, 7),
                tab:0,
                key:0,
                items_ao: [],           
                items: [
                    { subheader:this.$t('Account orders'), children: [
                            { 
                                name:this.$t('Add an account transfer'), 
                                code: function(this_){
                                    this_.key=this_.key+1
                                    this_.at=this_.empty_account_transfer()
                                    this_.at.account_origin=this_.account.url
                                    this_.dialog_transfer=true
                                },
                                icon: "mdi-plus" 
                            },
                        ]
                    },
                    { subheader:this.$t('Account operations orders'), children: [
                            { 
                                name:this.$t('Add an account operation'), 
                                code: function(this_){
                                    this_.ao=this_.empty_account_operation()
                                    this_.ao.accounts=this_.account.url,
                                    this_.key=this_.key+1
                                    this_.ao_deleting=false
                                    this_.dialog_ao=true
                                },
                                icon: "mdi-plus" 
                            },

                        ]
                    },
                    { subheader:this.$t('Credit card orders'), children: [
                            { 
                                name:this.$t('Add a credit card'), 
                                code: function(this_){
                                    this_.editing_cc=false
                                    this_.cc=this_.empty_credit_card()
                                    this_.cc.accounts=this_.account.url,
                                    console.log(this_.cc)
                                    this_.key=this_.key+1
                                    this_.dialog_cc=true
                                },
                                icon: "mdi-plus" 
                            },
                        ]
                    },
                ],
                // DIALOG CREDIT CARDS
                table_cc_headers:[
                    { text: this.$t('Name'), value: 'name',sortable: true },
                    { text: this.$t('Number'), value: 'number',sortable: false},
                    { text: this.$t('Deferred'), value: 'deferred',sortable: false},
                    { text: this.$t('Maximum balance'), value: 'maximumbalance',sortable: false, align:"right"},
                    { text: this.$t('Balance'), value: 'balance',sortable: true ,align:"right"},
                    { text: this.$t('Actions'), value: 'actions', sortable: false },
                ],
                table_cc:[],
                showActiveCC:true,
                dialog_cc:false,
                cc: null,

                // DIALOG ACCOUNT TRANSFER
                at: null,

                // DIALOG CREDIT CARDS VIEW
                dialog_ccview:false,

                // DIALOG CREDIT CARDS VIEW
                dialog_transfer:false,

                // DIALOG ACCOUNT OPERATIONS
                dialog_ao:false,
                ao: null,
            }  
        },
        watch:{
            monthpicker: function (){
                this.refreshTable()
            }
        },
        methods: {
            CCONotDeferred(item){
                this.ao=this.empty_account_operation()
                this.ao.accounts=this.account.url
                this.ao.comment=item.name + ". "
                this.key=this.key+1
                this.dialog_ao=true
            },
            empty_account_operation,
            empty_account_transfer,
            empty_credit_card,
            refreshTable(){
                //var this_=this //Needs this inside axios seems with browser vue method
                axios.get(`${this.$store.state.apiroot}/accountsoperations/withbalance/?account=${this.account.id}&year=${this.monthpicker.slice(0,4)}&month=${this.monthpicker.slice(5,7)}`, this.myheaders())                
                .then((response) => {
                    this.items_ao=response.data;
                    if (this.$refs.tao) this.$refs.tao.gotoLastRow()
                }) 
                .catch((error) => {
                    this.parseResponseError(error)
                });
            },
            refreshTableCC(){
                axios.get(`${this.$store.state.apiroot}/creditcards/withbalance/?account=${this.account.id}&active=${this.showActiveCC}`, this.myheaders())                
                .then((response) => {
                    this.table_cc=response.data;
                }) 
                .catch((error) => {
                    this.parseResponseError(error)
                });
            },
          
            editCC(item){
                this.cc=item
                this.dialog_cc=true
                this.key=this.key+1
            },
            viewCC(item){
                this.cc=item
                this.key=this.key+1
                this.dialog_ccview=true
            },
            deleteCC(item){
                var r = confirm(this.$t("Do you want to delete this credit card?"))
                if(r == false) {
                    return
                }  
                r = confirm(this.$t("Are you sure?. If you used this credit card you should mark it as inactive"))
                if(r == false) {
                    return
                }  
                axios.delete(item.url, this.myheaders())
                .then((response) => {
                    console.log(response);
                    this.refreshTableCC()
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            on_AccountsoperationsCU_cruded(following){
                this.dialog_ao=following
                this.refreshTable()
                this.$emit('cruded')
            },
            on_CreditcardsCU_cruded(){
                this.dialog_cc=false
                this.refreshTableCC()
            },
            on_CreditcardsView_cruded(){
                this.refreshTable()//Due to payments, must refresh account operations
                this.refreshTableCC()
                this.$emit('cruded')
            },
            on_chkActive_cc(){
                this.refreshTableCC()
            },
            on_AccountTransfer_cruded(){
                this.dialog_transfer=false 
                this.refreshTable()    
                this.$emit('cruded')
            },
            on_TableAccountOperations_cruded(){
                this.refreshTable()
                this.$emit('cruded')
            },
            setCheckboxLabelCC(){
                if (this.showActiveCC == true){
                    return this.$t("Uncheck to see inactive credit cards")
                } else {
                    return this.$t("Check to see active credit cards")
                }
            },
        },
        created(){
            this.refreshTable()
            this.refreshTableCC()
        }
    }
</script>

