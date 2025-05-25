<template>
    <div>
        <v-data-table  ref="table_ao" :show-select="showselected" v-model="selected" density="compact" :headers="table_headers()" :items="items" class="elevation-1" :sort-by="[{ key: 'datetime', order: 'asc' }]" fixed-header :height="$attrs.height"  :items-per-page="items_per_page" fixed-footer>
            <template #item.datetime="{item}">
                {{ localtime(item.datetime) }}
            </template>  
            <template #item.amount="{item}">
                <div class="text-right" v-html="currency_html(item.amount,item.currency)"></div>
            </template>   
            <template #item.balance="{item}">
                <div class="text-right" v-html="currency_html(item.balance, item.currency)"></div>
            </template>   
            <template #item.accounts="{item}">
                <div v-html="useStore().accounts.get(item.accounts).fullname"></div>
            </template> 
            <template #item.concepts="{item}">
                <div class="cursorpointer" v-html="useStore().concepts.get(item.concepts).localname" @click="viewHistoricalConcept(item)"></div>
            </template>
            <template #item.actions="{item}">
                <v-icon :data-test="`TableAccountOperations_ButtonCopy${item.id}`" small class="mr-2" @click="copyAO(item)">mdi-content-copy</v-icon>
                <v-icon small class="mr-2" @click="editAO(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteAO(item)">mdi-delete</v-icon>
            </template>
            <template #body.append v-if="showtotal && items.length>0">
                <tr id="bottom" class=" v-data-table__tr totalrow">
                    <td>{{ f($t("Total ([0] registers)"), [items.length])}}</td>
                    <td></td>
                    <td v-if="showaccount"></td>
                    <td v-if="all_items_has_same_currency" class="text-right" v-html="currency_html(listobjects_sum(items,'amount'),total_currency)"></td>
                    <td v-if="!all_items_has_same_currency" >{{ $t("Can't sum amounts due to they have different currencies") }}</td>
                    <td v-if="showbalance"></td>
                    <td></td>
                    <td></td>
                </tr>
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
        <v-dialog v-model="dialog_io" width="40%" v-if="io">
            <v-card class="pa-3">
                <InvestmentsoperationsCU :io="io" :mode="io_mode" :key="key" @cruded="on_InvestmentsoperationsCU_cruded()" />
            </v-card>
        </v-dialog>

        <!-- DIALOG ACCOUNT TRANSFER -->
        <v-dialog v-model="dialog_transfer" width="35%">
            <v-card class="pa-6">
                <AccountsTransfer :at="at" :mode="at_mode" @cruded="on_AccountTransfer_cruded()" :key="key" />
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
    import { useStore } from "@/store"
    import {empty_account_transfer, empty_account_operation} from '../empty_objects.js'
    import AccountsoperationsCU from './AccountsoperationsCU.vue'
    import AccountsTransfer from './AccountsTransfer.vue'
    import DividendsCU from './DividendsCU.vue'
    import InvestmentsoperationsCU from './InvestmentsoperationsCU.vue'
    import ReportsConceptsHistorical from './ReportsConceptsHistorical.vue'
    import { localtime, f } from 'vuetify_rules'
    import { useGoTo } from 'vuetify'
    import { parseResponseError, listobjects_sum, currency_html } from '@/functions.js'
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
            at_mode: null,
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
            useStore,
        f,
        useGoTo,
        listobjects_sum,
        currency_html,
        localtime,
        parseResponseError,
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
            if (item.is_editable==false){// Account operation is not editable
                if (item.associated_io){ //It's an investment operation 
                    //Gets
                    axios.get(item.associated_io, this.myheaders())
                    .then((response) => {
                        this.io=response.data
                        this.io_mode="U"
                        this.key=this.key+1
                        this.dialog_io=true
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                } else if ( item.associated_transfer){ // Try to find account transfer to edit it and operratinon type =transfer
                    axios.get(item.associated_transfer, this.myheaders())
                    .then((response) => {
                        this.at=response.data
                        this.at_mode="U"
                        this.key=this.key+1
                        this.dialog_transfer=true
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if ( item.associated_dividend){
                    axios.get(item.associated_dividend, this.myheaders())
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
            if ( item.associated_transfer){// Tries to find transfer to delete it
                axios.get(item.associated_transfer, this.myheaders())
                .then((response) => {
                    this.at=response.data
                    this.at_mode="D"
                    this.key=this.key+1
                    this.dialog_transfer=true
                }, (error) => {
                    this.parseResponseError(error)
                })
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
        table_headers(){
            var r= [
                { title: this.$t('Date and time'), key: 'datetime', sortable: true, width:"12%" },
                { title: this.$t('Account'), key: 'accounts', sortable: true, width:"20%" },
                { title: this.$t('Concept'), key: 'concepts', sortable: true, width:"20%"},
                { title: this.$t('Amount'), key: 'amount', sortable: true, align:'end', width:"8%"},
                { title: this.$t('Balance'), key: 'balance', sortable: false, align:'end', width:"8%"},
                { title: this.$t('Comment'), key: 'nice_comment', sortable: true},
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
        async gotoLastRow(){ 
            const bottom = document.getElementById("bottom")
            await this.$nextTick();
            if (bottom){ 
                bottom.scrollIntoView({ behavior: "auto", block: "end", inline: "nearest" })
            }       
        },
        on_AccountTransfer_cruded(){
            this.dialog_transfer=false
            this.$emit("cruded")
            this.gotoLastRow()
        },
        on_AccountsoperationsCU_cruded(following){
            this.dialog_ao=following
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
    created(){
        this.gotoLastRow()
    }
}
</script>
