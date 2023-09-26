<template>
    <div>
        <v-data-table  ref="table_ao" :show-select="showselected" v-model="selected" density="compact" :headers="table_headers()" :items="items" class="elevation-1" :sort-by="[{ key: 'datetime', order: 'asc' }]" fixed-header :height="$attrs.height"  :items-per-page="items_per_page" fixed-footer>
            <template #item.datetime="{item}">
                {{ localtime(item.raw.datetime) }}
            </template>  
            <template #item.amount="{item}">
                <div class="text-right" v-html="currency_html(item.raw.amount,item.raw.currency)"></div>
            </template>   
            <template #item.balance="{item}">
                <div class="text-right" v-html="currency_html(item.raw.balance, item.raw.currency)"></div>
            </template>   
            <template #item.accounts="{item}">
                <div v-html="store().accounts.get(item.raw.accounts).fullname"></div>
            </template> 
            <template #item.concepts="{item}">
                <div class="cursorpointer" v-html="store().concepts.get(item.raw.concepts).localname" @click="viewHistoricalConcept(item.raw)"></div>
            </template>
            <template #item.actions="{item}">
                <v-icon small class="mr-2" @click="copyAO(item.raw)">mdi-content-copy</v-icon>
                <v-icon small class="mr-2" @click="editAO(item.raw)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteAO(item.raw)">mdi-delete</v-icon>
            </template>
            <template #tbody v-if="showtotal && items.length>0">
                <tr class="totalrow">
                    <td>{{ $t("Total ([0] registers)").format(items.length)}}</td>
                    <td></td>
                    <td v-if="showaccount"></td>
                    <td v-if="all_items_has_same_currency" class="text-right" v-html="currency_html(listobjects_sum(items,'amount'),total_currency)"></td>
                    <td v-if="!all_items_has_same_currency" >{{ $t("Can't sum amounts due to they have different currencies") }}</td>
                    <td></td>
                    <td></td>
                </tr>
                <div id="bottom"></div>
            </template>
            
         <template #bottom ></template>
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
    import {empty_account_transfer, empty_account_operation} from '../empty_objects.js'
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

            items_per_page:500000000,

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
        empty_account_operation,
        copyAO (item) {
            if(item.is_editable==false){
                alert (this.$t("You can't copy this account operation"))
                return
            }
            this.ao=this.empty_account_operation()
            this.ao_mode="C"
            this.ao.concepts=item.concepts
            this.ao.amount=item.amount
            this.ao.comment=item.comment
            this.ao.accounts=item.accounts
            this.key=this.key+1
            this.dialog_ao=true
        },
        editAO (item) {
            console.log(item.is_editable)
            if (item.is_editable==false){// Account operation is not editable
                if (item.comment.startsWith("10000,")){ //It's an investment operation 
                    var io_string= item.comment.split(",")[1]
                    //Gets
                    axios.get(`${this.store().apiroot}/api/investmentsoperations/${io_string}/`, this.myheaders())
                    .then((response) => {
                        this.io=response.data
                        this.io_mode="U"
                        this.key=this.key+1
                        this.dialog_io=true
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                } else if ( this.ao_to_find_transfer(item) && item.operationstypes==`${this.store().apiroot}/api/operationstypes/3/`){ // Try to find account transfer to edit it and operratinon type =transfer
                    this.at=this.ao_to_find_transfer(item)
                    this.at_deleting=false
                    this.key=this.key+1
                    this.dialog_transfer=true
                } else if ( item.comment.startsWith("10004,")){
                    var dividend_string=item.comment.split(",")[1]
                    axios.get(`${this.store().apiroot}/api/dividends/${dividend_string}/`, this.myheaders())
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
                at.ao_origin=`${this.store().apiroot}/api/accountsoperations/${arr[1]}/`
                at.ao_destiny=`${this.store().apiroot}/api/accountsoperations/${arr[2]}/`
                if (arr[3]>0)at.ao_commission=`${this.store().apiroot}/api/accountsoperations/${arr[3]}/`
                return at
            }
            return null
        },
        table_headers(){
            var r= [
                { title: this.$t('Date and time'), key: 'datetime', sortable: true, width:"12%" },
                { title: this.$t('Account'), key: 'accounts', sortable: true, width:"20%" },
                { title: this.$t('Concept'), key: 'concepts', sortable: true, width:"20%"},
                { title: this.$t('Amount'), key: 'amount', sortable: true, align:'end', width:"8%"},
                { title: this.$t('Balance'), key: 'balance', sortable: false, align:'end', width:"8%"},
                { title: this.$t('Comment'), key: 'comment_decoded', sortable: true},
            ]
            if (this.hideactions==false){
                r.push({ title: this.$t('Actions'), key: 'actions', sortable: false , width:"8%"})
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
            const element = document.getElementById("bottom")
            //const element= this.$refs.table_ao
            // console.log(element)
            const previous=element?.previousElementSibling
            // console.log("prev",previous,previous.childElementCount)
            // console.log(this.items.length)
            const last_tr=previous?.children.item(previous.childElementCount-1)
            console.log(last_tr)
            if (last_tr){ 
                console.log("Going")
                last_tr.scrollIntoView(false)
            }

            
            
        },
        on_AccountTransfer_cruded(){
            this.dialog_transfer=false
            this.$emit("cruded")
            this.gotoLastRow()
        },
        on_AccountsoperationsCU_cruded(){
            this.dialog_ao=false
            this.$emit("cruded")
        },
        on_DividendsCU_cruded(){
            this.dividends_cu_dialog=false
            this.$emit("cruded")
            this.gotoLastRow()
        },
        on_InvestmentsoperationsCU_cruded(){
            this.dialog_io=false
            this.$emit("cruded")
            this.gotoLastRow()
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
