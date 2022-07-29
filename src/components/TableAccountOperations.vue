<template>
    <div>
        <v-data-table  ref="table_ao" :show-select="showselected" v-model="selected" dense :headers="table_headers()" :items="items" class="elevation-1" disable-pagination  hide-default-footer sort-by="datetime" fixed-header :single-select="false" :height="$attrs.height">
            <template v-slot:[`item.datetime`]="{ item,index }">
                <div :ref="index">{{ localtime(item.datetime)}}</div>
            </template>          
            <template v-slot:[`item.amount`]="{ item }">
                <div v-html="currency_html(item.amount,item.currency)"></div>
            </template>   
            <template v-slot:[`item.balance`]="{ item }">
                <div v-html="currency_html(item.balance, item.currency)"></div>
            </template>   
            <template v-slot:[`item.account`]="{ item }">
                <div v-html="$store.getters.getObjectPropertyByUrl('accounts', item.account, 'fullname')"></div>
            </template> 
            <template v-slot:[`item.concepts`]="{ item }">
                <div v-html="$store.getters.getObjectPropertyByUrl('concepts', item.concepts, 'localname')"></div>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editAO(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteAO(item)">mdi-delete</v-icon>
            </template>
            <template v-slot:[`body.append`]="{headers}" v-if="total_currency!=null">
                <tr style="background-color: GhostWhite">
                    <td v-for="(header,i) in headers" :key="`row${i}`" >
                        <div v-if="header.value == 'datetime'">
                            Total
                        </div>
                        <div v-if="header.value == 'amount'">
                            <div class="text-right" v-html="currency_html(listobjects_sum(items,'amount'),total_currency)"></div>
                        </div>
                    </td>
                </tr>
            </template>
        </v-data-table>   
        
        <!-- DIALOG ACCOUNTSOPERATIONS ADD/UPDATE -->
        <v-dialog v-model="dialog_ao" max-width="550">
            <v-card class="pa-8">
                <AccountsoperationsCU :ao="ao" :deleting="ao_deleting" :key="key" @cruded="on_AccountsoperationsCU_cruded"></AccountsoperationsCU>
            </v-card>
        </v-dialog>
        
        <!-- IO CU-->
        <v-dialog v-model="dialog_io" width="550" v-if="io">
            <v-card class="pa-3">
                <InvestmentsoperationsCU :io="io" :investment="io_investment" :key="key"  @cruded="on_InvestmentsoperationsCU_cruded()"></InvestmentsoperationsCU>
            </v-card>
        </v-dialog>

        <!-- DIALOG ACCOUNT TRANSFER -->
        <v-dialog v-model="dialog_transfer" width="35%">
            <v-card class="pa-6">
                <AccountsTransfer :at="at" :deleting="at_deleting" @cruded="on_AccountTransfer_cruded()" :key="key"></AccountsTransfer>
            </v-card>
        </v-dialog>

        <!-- DIVIDEND CU-->
        <v-dialog v-model="dividends_cu_dialog" width="35%">
            <v-card class="pa-3">
                <DividendsCU :dividend="dividend" :mode="dividends_cu_mode" :key="key"  @cruded="on_DividendsCU_cruded()"></DividendsCU>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>     
    import axios from 'axios'
    import {empty_account_transfer} from '../empty_objects.js'
    import AccountsoperationsCU from './AccountsoperationsCU.vue'
    import AccountsTransfer from './AccountsTransfer.vue'
    import DividendsCU from './DividendsCU.vue'
    import InvestmentsoperationsCU from './InvestmentsoperationsCU.vue'
    export default {
        components:{
            AccountsoperationsCU,
            AccountsTransfer,
            InvestmentsoperationsCU,
            DividendsCU,
        },
    props: {
        items: {
            required: true
        },
        total_currency: { // Only in homogeneous. Each item must have it's currency. This is only for totals.
                        // If null doesn't show total. Total can be showed in homogeneos or not. It depends on the query if has same currency
            required: false,
            default: null,
        },
        homogeneous:{ //Only hides account if true
            type: Boolean,
            required:false,
            default:false,
        },
        showselected:{
            required:false,
            default: false,
        },
        showactions:{
            required:false,
            default: true,
        }
    },

    data: function(){
        return {
            selected: [],
            key:0,

            // DIALOG ACCOUNT OPERATIONS
            dialog_ao:false,
            ao: null,
            ao_deleting:false,

            // DIALOG INVESTMENT OPERATIONS CU
            dialog_io:false,
            io: null,
            io_investment:null,

            // DIALOG ACCOUNT TRANSFER
            at:null,
            at_deleting: null,
            dialog_transfer: false,


            // DIALOG DIVIDENDS CU
            dividends_cu_dialog:false,
            dividends_cu_mode: null,
            dividend: null,
        }
    },
    watch: {
        selected(){
            this.$emit("changeSelected",this.selected)
        }
    },
    methods: {
        empty_account_transfer,
        editAO (item) {
            console.log(item)
            
            if (item.is_editable==false){// Account operation is not editable
            
                if (item.comment.startsWith("10000,")){ //It's an investment operation 
                    var io_string= item.comment.split(",")[1]
                    //Gets
                    axios.get(`${this.$store.state.apiroot}/api/investmentsoperations/${io_string}/`, this.myheaders())
                    .then((response) => {
                        this.io=response.data
                        this.io_investment={ url: response.data.investments, currency: response.data.currency }
                        this.key=this.key+1
                        this.dialog_io=true
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                } else if ( this.ao_to_find_transfer(item) && item.operationstypes==`${this.$store.state.apiroot}/api/operationstypes/3/`){ // Try to find account transfer to edit it and operratinon type =transfer
                    this.at=this.ao_to_find_transfer(item)
                    this.at_deleting=false
                    this.key=this.key+1
                    this.dialog_transfer=true
                } else if ( item.comment.startsWith("10004,")){
                    var dividend_string=item.comment.split(",")[1]
                    axios.get(`${this.$store.state.apiroot}/api/dividends/${dividend_string}/`, this.myheaders())
                    .then((response) => {
                        this.dividend=response.data
                        this.dividends_cu_mode="U"
                        this.key=this.key+1
                        this.dividends_cu_dialog=true
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else { //It's not a especial comment
                    alert(this.$t("You can't edit this account operation"))
                    return
                }
            } else { // Account operation is editable
                this.ao=item
                this.ao_deleting=false
                this.dialog_ao=true
                this.key=this.key+1
            }
        },
        deleteAO (item) {
            console.log(item)
            if (this.ao_to_find_transfer(item)){// Tries to find transfer to delete it
                this.at=this.ao_to_find_transfer(item)
                this.at_deleting=true
                this.key=this.key+1
                this.dialog_transfer=true
            } else if (item.is_editable==false){ //Rest of no editables
                alert(this.$t("You can't delete this account operation"))
                return
            } else { //Editables
                this.ao=item
                this.ao_deleting=true
                this.key=this.key+1
                this.dialog_ao=true
            }
        },
        ao_to_find_transfer(item){ //Returns an at object to call transfer dialog or null
            if (item.comment.startsWith("10001,") || item.comment.startsWith("10002,") || item.comment.startsWith("10003,") ){ //It's an account transfer
                var arr=item.comment.split(",") // code, ao_origin, ao_destiny, ao_commission
                var at=this.empty_account_transfer()
                at.datetime=item.datetime
                at.ao_origin=`${this.$store.state.apiroot}/api/accountsoperations/${arr[1]}/`
                at.ao_destiny=`${this.$store.state.apiroot}/api/accountsoperations/${arr[2]}/`
                if (arr[3]>0)at.ao_commission=`${this.$store.state.apiroot}/api/accountsoperations/${arr[3]}/`
                return at
            }
            return null
        },
        table_headers(){
            var r= [
                { text: this.$t('Date and time'), value: 'datetime', sortable: true, width:"12%" },
                { text: this.$t('Account'), value: 'account', sortable: true, width:"20%" },
                { text: this.$t('Concept'), value: 'concepts', sortable: true, width:"20%"},
                { text: this.$t('Amount'), value: 'amount', sortable: true, align:"right", width:"8%"},
                { text: this.$t('Balance'), value: 'balance', sortable: false, align:"right", width:"8%"},
                { text: this.$t('Comment'), value: 'comment_decoded', sortable: true},
            ]
            if (this.showactions==true){
                r.push({ text: this.$t('Actions'), value: 'actions', sortable: false , width:"6%"})
            }
            if (this.homogeneous==false){
                r.splice(4, 1);
            }
            if (this.homogeneous==true){
                r.splice(1, 1);
            }
            return r
        },
        gotoLastRow(){          
            
            if(this.$refs.table_ao) this.$vuetify.goTo(100000, { container:  this.$refs.table_ao.$el.childNodes[0]}) 

        },
        on_AccountTransfer_cruded(){
            this.dialog_transfer=false
            this.$emit("cruded")
        },
        on_AccountsoperationsCU_cruded(){
            this.dialog_ao=false
            this.$emit("cruded")
        },
        on_DividendsCU_cruded(){
            this.dividends_cu_dialog=false
            this.$emit("cruded")
        },
        on_InvestmentsoperationsCU_cruded(){
            this.dialog_io=false
            this.$emit("cruded")
        }
    },
    mounted(){
        this.gotoLastRow()
    }
}
</script>
