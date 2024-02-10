<template>
    <div>
        <h1>{{ f($t("Account details of '[0]'"), [account.localname]) }}<MyMenuInline :items="items" />  </h1>
        <DisplayValues :items="displayvalues"></DisplayValues>

        <v-tabs v-model="tab" bg-color="secondary" grow>
            <v-tab key="ao">{{ $t("Account operations")}}</v-tab>
            <v-tab data-test="AccountsView_TabCC" key="cc">{{ $t("Credit cards")}}</v-tab>
        </v-tabs>  
        <v-window v-model="tab">
            <v-window-item key="ao">     
                <v-card class="d-flex justify-center flex-column" outlined>
                    <MyMonthPicker v-model="ym" />
                    <TableAccountOperations ref="tao" showtotal showbalance :items="items_ao" :total_currency="account.currency" height="400" @cruded="on_TableAccountOperations_cruded()" />
                </v-card>
            </v-window-item>
            <v-window-item key="cc">
                <v-card outlined>
                    <v-checkbox data-test="AccountsView_ShowActiveCC" v-model="showActiveCC" :label="setCheckboxLabelCC()"></v-checkbox>
                    <v-data-table :headers="table_cc_headers" :items="table_cc"  class="elevation-1 cursorpointer"  :sort-by="[{key:'name',order:'asc'}]" density="compact" fixed-header max-height="400" :key="key" @click:row="viewCC"     :items-per-page="10000" >

                        <template #item.deferred="{item}">
                            <div class="text-center"><v-icon small v-if="item.deferred" >mdi-check-outline</v-icon></div>
                        </template>  

                        <template #item.maximumbalance="{item}">
                            <div v-html="currency_html(item.maximumbalance, item.account_currency )"></div>
                        </template>  

                        <template #item.balance="{item}">
                            <div v-html="currency_html(item.balance, item.account_currency )"></div>
                        </template>     

                        <template #item.actions="{item}">
                            <v-icon v-if="!item.deferred" small class="mr-2" @click.stop="CCONotDeferred(item)">mdi-plus</v-icon>
                            <v-icon :data-test="`AccountsView_Tablecc_ButtonEdit${item.id}`" small class="mr-2" @click.stop="editCC(item)">mdi-pencil</v-icon>
                            <v-icon :data-test="`AccountsView_Tablecc_ButtonDelete${item.id}`" small @click.stop="deleteCC(item)" v-if="item.is_deletable">mdi-delete</v-icon>
                        </template>
                        <template #bottom ></template>   
                    </v-data-table>   
                </v-card>
            </v-window-item>
        </v-window>
        <!-- DIALOG ACCOUNTSOPERATIONS ADD/UPDATE -->
        <v-dialog v-model="dialog_ao" max-width="700">
            <v-card class="pa-8">
                <AccountsoperationsCU :ao="ao" :mode="ao_mode" :key="key" @cruded="on_AccountsoperationsCU_cruded"></AccountsoperationsCU>
            </v-card>
        </v-dialog>
        <!-- DIALOG CREDIT CARD ADD/UPDATE -->
        <v-dialog v-model="dialog_cc" max-width="550">
            <v-card class="pa-4">
                <CreditcardsCU :cc="cc" :mode="cc_mode" @cruded="on_CreditcardsCU_cruded()" :key="key" />
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
    import { useStore } from "@/store"
    import AccountsoperationsCU from './AccountsoperationsCU.vue'
    import AccountsTransfer from './AccountsTransfer.vue'
    import DisplayValues from './DisplayValues.vue'
    import MyMenuInline from './MyMenuInline.vue'
    import MyMonthPicker from './MyMonthPicker.vue'
    import CreditcardsCU from './CreditcardsCU.vue'
    import CreditcardsView from './CreditcardsView.vue'
    import TableAccountOperations from './TableAccountOperations.vue'
    import {empty_account_operation,empty_credit_card,empty_account_transfer} from '../empty_objects.js'
    import { f} from 'vuetify_rules'
    export default {
        name:"AccountsView",
        components:{
            AccountsoperationsCU,
            AccountsTransfer,
            MyMenuInline,
            DisplayValues,
            TableAccountOperations,
            CreditcardsCU,
            CreditcardsView,
            MyMonthPicker,
        },
        props:{
            account:{
                required:true,
            }
        },
        data () {
            return {
                displayvalues:[
                    {title:this.$t('Bank'), value: this.useStore().banks.get(this.account.banks).name},
                    {title:this.$t('Number'), value: this.account.number},
                    {title:this.$t('Currency'), value: this.account.currency},
                    {title:this.$t('Active'), value: this.account.active},
                    {title:this.$t('Id'), value: this.account.id},
                ],
                ym: null,
                tab:0,
                key:0,
                items_ao: [],           
                items: [
                    { subheader:this.$t('Account orders'), children: [
                            { 
                                name:this.$t('Add an account transfer'), 
                                code: function(){
                                    this.key=this.key+1
                                    this.at=this.empty_account_transfer()
                                    this.at.account_origin=this.account.url
                                    this.dialog_transfer=true
                                }.bind(this),
                                icon: "mdi-plus" 
                            },
                        ]
                    },
                    { subheader:this.$t('Account operations orders'), children: [
                            { 
                                name:this.$t('Add an account operation'), 
                                code: function(){
                                    this.ao=this.empty_account_operation()
                                    this.ao_mode="C"
                                    this.ao.accounts=this.account.url
                                    this.key=this.key+1
                                    this.ao_deleting=false
                                    this.dialog_ao=true
                                }.bind(this),
                                icon: "mdi-plus" 
                            },

                        ]
                    },
                    { subheader:this.$t('Credit card orders'), children: [
                            { 
                                name:this.$t('Add a credit card'), 
                                code: function(){
                                    this.cc=this.empty_credit_card()
                                    this.cc.accounts=this.account.url
                                    this.cc_mode="C"
                                    this.key=this.key+1
                                    this.dialog_cc=true
                                }.bind(this),
                                icon: "mdi-plus" 
                            },
                        ]
                    },
                ],
                // DIALOG CREDIT CARDS
                table_cc_headers:[
                    { title: this.$t('Name'), key: 'name',sortable: true },
                    { title: this.$t('Number'), key: 'number',sortable: false},
                    { title: this.$t('Deferred'), key: 'deferred',sortable: false},
                    { title: this.$t('Maximum balance'), key: 'maximumbalance',sortable: false, align:'end'},
                    { title: this.$t('Balance'), key: 'balance',sortable: true ,align:'end'},
                    { title: this.$t('Actions'), key: 'actions', sortable: false },
                ],
                table_cc:[],
                showActiveCC:true,
                dialog_cc:false,
                cc: null,
                cc_mode: null,

                // DIALOG ACCOUNT TRANSFER
                at: null,

                // DIALOG CREDIT CARDS VIEW
                dialog_ccview:false,

                // DIALOG CREDIT CARDS VIEW
                dialog_transfer:false,

                // DIALOG ACCOUNT OPERATIONS
                dialog_ao:false,
                ao: null,
                ao_mode: null,
            }  
        },
        watch:{
            ym () {
                this.refreshTable()
            },
            showActiveCC(){
                this.on_chkActive_cc() 
            },
        },
        methods: {
            useStore,
            f,
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
                axios.get(`${this.account.url}monthoperations/?year=${this.ym.year}&month=${this.ym.month}`, this.myheaders())                
                .then((response) => {
                    this.items_ao=response.data;
                    if (this.$refs.tao) this.$refs.tao.gotoLastRow()
                }) 
                .catch((error) => {
                    this.parseResponseError(error)
                });
            },
            refreshTableCC(){
                axios.get(`${this.useStore().apiroot}/api/creditcards/withbalance/?account=${this.account.id}&active=${this.showActiveCC}`, this.myheaders())                
                .then((response) => {
                    this.table_cc=response.data;
                }) 
                .catch((error) => {
                    this.parseResponseError(error)
                });
            },
          
            editCC(item){
                this.cc=item
                this.cc_mode="U"
                this.key=this.key+1
                this.dialog_cc=true
            },
            viewCC(event,object){
                if (object.item.deferred==false){
                    alert(this.$t("This is a debit credit card. Your operations are added to account directly"))
                    return
                }
                this.cc=object.item
                this.key=this.key+1
                this.dialog_ccview=true
            },
            deleteCC(item){
                this.cc=item
                this.cc_mode="D"
                this.key=this.key+1
                this.dialog_cc=true
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
        mounted(){
            // this.refreshTable() Not needed due to a MyMonthPicker Input
            this.refreshTable()
            this.refreshTableCC()
        }
    }
</script>

