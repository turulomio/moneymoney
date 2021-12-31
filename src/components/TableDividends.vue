<template>
    <div>
        <v-data-table dense :headers="table_headers()" :items="items" class="elevation-1" disable-pagination  hide-default-footer sort-by="datetime" fixed-header :height="$attrs.height" :ref="$vnode.tag">
            <template v-slot:[`item.datetime`]="{ item, index}" >
                <div :ref="index">{{ localtime(item.datetime)}}</div>
            </template>         
           <template v-slot:[`item.concepts`]="{ item }">
               <div v-html="$store.getters.getObjectPropertyByUrl('concepts',item.concepts,'name')"></div>
           </template> 
            <template v-slot:[`item.gross`]="{ item }">
                <div v-html="currency(item.gross)"></div>
            </template>   
            <template v-slot:[`item.net`]="{ item }">
                <div v-html="currency(item.net)"></div>
            </template>   
            <template v-slot:[`item.commission`]="{ item }">
                <div v-html="currency(item.commission)"></div>
            </template>   
            <template v-slot:[`item.taxes`]="{ item }">
                <div v-html="currency(item.taxes)"></div>
            </template>   
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editDividend(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteDividend(item)">mdi-delete</v-icon>
            </template>
            <template v-slot:[`body.append`]="{headers}">
                <tr style="background-color: GhostWhite" v-if="items.length>0">
                    <td v-for="(header,i) in headers" :key="i" >
                        <div v-if="header.value == 'datetime'">
                            Total
                        </div>
                        <div v-if="header.value == 'gross'">
                            <div class="text-right" v-html="currency(listobjects_sum(items,'gross'))"></div>
                        </div>
                        <div v-if="header.value == 'net'">
                            <div class="text-right" v-html="currency(listobjects_sum(items,'net'))"></div>
                        </div>
                        <div v-if="header.value == 'commission'">
                            <div class="text-right" v-html="currency(listobjects_sum(items,'commission'))"></div>
                        </div>
                        <div v-if="header.value == 'taxes'">
                            <div class="text-right" v-html="currency(listobjects_sum(items,'taxes'))"></div>
                        </div>
                    </td>
                </tr>
            </template>
        </v-data-table>   
        <!-- DIVIDEND CU-->
        <v-dialog v-model="dialog_dividend" width="35%">
            <v-card class="pa-3">
                <DividendsCU :dividend="dividend" :investment="investment" :key="key"  @cruded="on_DividendsCU_cruded()"></DividendsCU>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>    
    import axios from 'axios'
    import DividendsCU from './DividendsCU.vue'
    import {localtime} from '../functions.js'
    export default {
        components:{
            DividendsCU,
        },
        props: {
            items: {
                required: true
            },
            currency_account: {
                required: true
            },
            homogeneous:{
                required:false,
                default:true,
            },
        },
        data: function(){
            return {
                dialog_dividend:false,
                dividend: null,
                investment: null,
                key: 0,
            }
        },
        methods: {
            localtime,
            currency(value){
                return this.currency_html(value, this.currency_account)
            },
            editDividend(item){
                this.dividend=item
                this.investment={url:this.dividend.investments}
                this.dialog_dividend=true
                this.key=this.key+1
            },
            deleteDividend(item){
               var r = confirm(this.$t("Do you want to delete this dividend?"))
               if(r == false) {
                  return
               } 
                axios.delete(item.url, this.myheaders())
                .then(() => {
                    this.$emit("cruded")
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            table_headers(){
                var r= [
                    { text: this.$t('Date and time'), value: 'datetime', sortable: true },
                    { text: this.$t('Concept'), value: 'concepts', sortable: true },
                    { text: this.$t('Gross'), value: 'gross', sortable: false, align:"right"},
                    { text: this.$t('Net'), value: 'net', sortable: false, align:"right"},
                    { text: this.$t('Commission'), value: 'commission', sortable: true , align:"right"},
                    { text: this.$t('Taxes'), value: 'taxes', sortable: true , align:"right"},
                    { text: this.$t('DPS'), value: 'dps', sortable: true , align:"right"},
                    { text: this.$t('Actions'), value: 'actions', sortable: false },
                ]
                if (this.heterogeneus==true){
                    r.splice(1, 0, { text: this.$t('Account'), value: 'account',sortable: true });
                }
                return r
            },
            gotoLastRow(){
                this.$vuetify.goTo(this.$refs[this.items.length-1], { container:  this.$refs[this.$vnode.tag].$el.childNodes[0] }) 
            },
            on_DividendsCU_cruded(){
                this.$emit("cruded")
            }
        },
        mounted(){
            // this.gotoLastRow()
            // this.key=this.key+1
            // console.log("DIVIDENDS TABLE")
        }
    }
</script>