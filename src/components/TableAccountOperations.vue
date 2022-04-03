<template>
    <div>
        <v-data-table  ref="table_ao" :show-select="showselected" v-model="selected" dense :headers="table_headers()" :items="items" class="elevation-1" disable-pagination  hide-default-footer sort-by="datetime" fixed-header v-bind="$attrs" :single-select="false">
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
                <div v-html="$store.getters.getObjectPropertyByUrl('accounts', item.account, 'localname')"></div>
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
    </div>
</template>

<script>     
    import axios from 'axios'
    import {listobjects_sum} from '../functions.js'
    import AccountsoperationsCU from './AccountsoperationsCU.vue'
    import InvestmentsoperationsCU from './InvestmentsoperationsCU.vue'
    export default {
        components:{
            AccountsoperationsCU,
            InvestmentsoperationsCU,
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
            required:true,
            default:true,
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
        }
    },
    watch: {
        selected(){
            this.$emit("changeSelected",this.selected)
        }
    },
    methods: {
        listobjects_sum,

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
            var r
            var ot_id=this.$store.getters.getObjectPropertyByUrl("operationstypes",item.operationstypes,"id")
            if (ot_id==3){// Delete transfer                
                r = confirm(this.$t("Do you want to delete this transfer?"))
                if(r == true) {
                    axios.post(`${this.$store.state.apiroot}/accounts/transfer/delete/`, {comment:item.comment,}, this.myheaders())
                    .then(() => {
                        this.following_ao=false
                        this.$emit('cruded', this.following_ao)
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                }
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
        table_headers(){
            var r= [
                { text: this.$t('Date and time'), value: 'datetime', sortable: true, width:"12%" },
                { text: this.$t('Account'), value: 'account', sortable: true, width:"20%" },
                { text: this.$t('Concept'), value: 'concepts', sortable: true, width:"20%"},
                { text: this.$t('Amount'), value: 'amount', sortable: false, align:"right", width:"8%"},
                { text: this.$t('Balance'), value: 'balance', sortable: false, align:"right", width:"8%"},
                { text: this.$t('Comment'), value: 'comment_decoded', sortable: true},
            ]
            if (this.showactions==true){
                r.push({ text: this.$t('Actions'), value: 'actions', sortable: false     , width:"6%"})
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
           //this.$vuetify.goTo(100000, { container:  this.$refs[this.$vnode.tag].$el.children[0].children[0].children[2].children ,duration: 500}) 
            //console.log(this.$refs.table_ao.$el.childNodes[0])
            //this.$vuetify.goTo(this.$refs[this.items.length-1], { container:  this.$refs.table_ao.$el.childNodes[0]}) 

        },
        on_AccountsoperationsCU_cruded(){
            this.dialog_ao=false
            this.$emit("cruded")
        },
        on_InvestmentsoperationsCU_cruded(){
            this.dialog_io=false
            this.$emit("cruded")
        }
    },
    mounted(){
        console.log(this.items)
        this.gotoLastRow()
    }
}
</script>
