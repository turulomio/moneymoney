<template>
    <div>
        <v-data-table dense :headers="table_headers()" :items="items" class="elevation-1" disable-pagination  hide-default-footer sort-by="datetime" fixed-header :height="$attrs.height" :ref="$vnode.tag">
            <template v-slot:[`item.datetime`]="{ item }" >
                <div>{{ localtime(item.datetime)}}</div>
            </template>         
           <template v-slot:[`item.concepts`]="{ item }">
               <div v-html="$store.getters.getObjectPropertyByUrl('concepts',item.concepts,'localname')"></div>
           </template>       
           <template v-slot:[`item.investments`]="{ item }">
               <div v-html="$store.getters.getObjectPropertyByUrl('investments',item.investments,'fullname')"></div>
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
                <tr class="totalrow" v-if="items.length>0">
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
        <v-dialog v-model="dividends_cu_dialog" width="35%">
            <v-card class="pa-3">
                <DividendsCU :dividend="dividend" :mode="dividends_cu_mode" :key="key"  @cruded="on_DividendsCU_cruded()"></DividendsCU>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import DividendsCU from './DividendsCU.vue'
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
            homogeneous:{ //Only hides account if true
                type: Boolean,
                required:false,
                default:false,
            },
        },
        data: function(){
            return {
                dividends_cu_dialog:false,
                dividend: null,
                dividends_cu_mode: null,
                key: 0,
            }
        },
        methods: {
            currency(value){
                return this.currency_html(value, this.currency_account)
            },
            editDividend(item){
                this.dividend=item
                this.dividends_cu_mode="U"
                this.key=this.key+1
                this.dividends_cu_dialog=true
            },
            deleteDividend(item){
                this.dividend=item
                this.dividends_cu_mode="D"
                this.key=this.key+1
                this.dividends_cu_dialog=true
            },
            table_headers(){
                var r= [
                    { text: this.$t('Date and time'), value: 'datetime', sortable: true },
                    { text: this.$t('Investment'), value: 'investments',sortable: true },
                    { text: this.$t('Concept'), value: 'concepts', sortable: true },
                    { text: this.$t('Gross'), value: 'gross', sortable: false, align:"right"},
                    { text: this.$t('Net'), value: 'net', sortable: false, align:"right"},
                    { text: this.$t('Commission'), value: 'commission', sortable: true , align:"right"},
                    { text: this.$t('Taxes'), value: 'taxes', sortable: true , align:"right"},
                    { text: this.$t('DPS'), value: 'dps', sortable: true , align:"right"},
                    { text: this.$t('Actions'), value: 'actions', sortable: false },
                ]
                if (this.homogeneous==true){
                    r.splice(1, 1)
                }
                return r
            },
            gotoLastRow(){
                if (this.$refs[this.$vnode.tag]) this.$vuetify.goTo(1000000, { container:  this.$refs[this.$vnode.tag].$el.childNodes[0] }) 
            },
            on_DividendsCU_cruded(){
                this.$emit("cruded")
            }
        },
        mounted(){
             this.gotoLastRow()
        }
    }
</script>