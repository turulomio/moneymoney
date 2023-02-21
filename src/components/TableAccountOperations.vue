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
            <template v-slot:[`item.accounts`]="{ item }">
                <div v-html="$store.getters.getObjectPropertyByUrl('accounts', item.accounts, 'fullname')"></div>
            </template> 
            <template v-slot:[`item.concepts`]="{ item }">
                <div class="cursorpointer" v-html="$store.getters.getObjectPropertyByUrl('concepts', item.concepts, 'localname')" @click="viewHistoricalConcept(item)"></div>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editAO(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteAO(item)">mdi-delete</v-icon>
            </template>
            <template v-slot:[`body.append`]="{headers}" v-if="showtotal && items.length>0">
                <tr class="totalrow">
                    <td v-for="(header,i) in headers" :key="`row${i}`" >
                        <div v-if="header.value == 'datetime'">
                            {{ $t("Total ({0} registers)").format(items.length)}}
                        </div>
                        <div v-if="header.value == 'amount'">
                            <div v-if="all_items_has_same_currency" class="text-right" v-html="currency_html(listobjects_sum(items,'amount'),total_currency)"></div>
                        </div>
                        <div v-if="header.value == 'comment_decoded'">
                            <div v-if="!all_items_has_same_currency" >{{ $t("Can't sum amounts due to they have different currencies") }}</div>
                        </div>
                    </td>
                </tr>
            </template>
        </v-data-table>   
        
        <!-- DIALOG ACCOUNTSOPERATIONS ADD/UPDATE -->
        <v-dialog v-model="dialog_ao" max-width="550">
            <v-card class="pa-8">
                <AccountsoperationsCU ref="aocu" :ao="ao" :mode="ao_mode" :key="key" @cruded="on_AccountsoperationsCU_cruded"></AccountsoperationsCU>
            </v-card>
        </v-dialog>
        
        <!-- IO CU-->
        <v-dialog v-model="dialog_io" width="550" v-if="io">
            <v-card class="pa-3">
                <InvestmentsoperationsCU :io="io" :mode="io_mode" :key="key" @cruded="on_InvestmentsoperationsCU_cruded()" />
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


        <!-- VIEW HISTORICAL REPORT dialog -->
        <v-dialog v-model="dialog_historical_concepts">
            <v-card class="pa-4">
                <ReportsConceptsHistorical :concept="concept" :key="key" />
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
    import ReportsConceptsHistorical from './ReportsConceptsHistorical.vue'
    export default {
        name: "TableAccountOperations",
        components:{
            AccountsoperationsCU,
            AccountsTransfer,
            InvestmentsoperationsCU,
            DividendsCU,
            ReportsConceptsHistorical,
        },
    props: {
        items: {
            required: true
        },
        showtotal:{// Items must have currency attribute
            type: Boolean,
            required:false,
            default: false,
        },
        showaccount:{// Items must have accounts attribute
            type: Boolean,
            required:false,
            default: false,
        },
        showbalance:{// Items must have balance attribute
            type: Boolean,
            required:false,
            default: false,
        },
        showselected:{
            type: Boolean,
            required:false,
            default: false,
        },
        hideactions:{
            type: Boolean,
            required:false,
            default: false,
        }
    },
    computed:{
        total_currency(){
            if (this.items.length==0) return ""
            return this.items[0].currency
        },
        all_items_has_same_currency(){
            if (this.items.length==0) return false
            var first_currency=this.items[0].currency
            var r=true
            this.items.forEach(item => {//For Each doesn't allow to return false
                if (item.currency!=first_currency)  {
                    r=false
                }
            });
            return r
        }

    },
    data: function(){
        return {
            selected: [],
            key:0,

            // DIALOG ACCOUNT OPERATIONS
            dialog_ao:false,
            ao: null,
            ao_mode:null,

            // DIALOG INVESTMENT OPERATIONS CU
            dialog_io:false,
            io: null,
            io_mode:null,

            // DIALOG ACCOUNT TRANSFER
            at:null,
            at_deleting: null,
            dialog_transfer: false,


            // DIALOG DIVIDENDS CU
            dividends_cu_dialog:false,
            dividends_cu_mode: null,
            dividend: null,

            //DIALOG HISTORICAL CONECPTS
            dialog_historical_concepts:false,
            concept: null
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
            if (item.is_editable==false){// Account operation is not editable
                if (item.comment.startsWith("10000,")){ //It's an investment operation 
                    var io_string= item.comment.split(",")[1]
                    //Gets
                    axios.get(`${this.$store.state.apiroot}/api/investmentsoperations/${io_string}/`, this.myheaders())
                    .then((response) => {
                        this.io=response.data
                        this.io_mode="U"
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
                this.ao_mode='U'
                this.key=this.key+1
                this.dialog_ao=true
            }
        },
        deleteAO (item) {
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
                this.ao_mode='D'
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
                { text: this.$t('Account'), value: 'accounts', sortable: true, width:"20%" },
                { text: this.$t('Concept'), value: 'concepts', sortable: true, width:"20%"},
                { text: this.$t('Amount'), value: 'amount', sortable: true, align:"right", width:"8%"},
                { text: this.$t('Balance'), value: 'balance', sortable: false, align:"right", width:"8%"},
                { text: this.$t('Comment'), value: 'comment_decoded', sortable: true},
            ]
            if (this.hideactions==false){
                r.push({ text: this.$t('Actions'), value: 'actions', sortable: false , width:"6%"})
            }
            if (this.showbalance==false){
                r.splice(4, 1);
            }
            if (this.showaccount==false){
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
        },
        viewHistoricalConcept(item){
            this.concept=item.concepts
            this.key=this.key+1
            this.dialog_historical_concepts=true

        }
    },
    mounted(){
        this.gotoLastRow()
    }
}
</script>
