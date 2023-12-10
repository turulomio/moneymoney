<template>
    <div>
        <v-data-table density="compact" :headers="table_headers()" :items="items" class="elevation-1" :sort-by="[{key:'datetime',order:'asc'}]" fixed-header :height="$attrs.height"     :items-per-page="10000" >
            <template #item.datetime="{item}">
                <div>{{ localtime(item.datetime)}}</div>
            </template>         
            <template #item.concepts="{item}">
               <div v-html="store().concepts.get(item.concepts).localname"></div>
           </template>       
            <template #item.investments="{item}">
               <div v-html="store().investments.get(item.investments).fullname"></div>
           </template> 
            <template #item.gross="{item}">
                <div v-html="currency_html(item.gross,item.currency)"></div>
            </template>   
            <template #item.net="{item}">
                <div v-html="currency_html(item.net,item.currency)"></div>
            </template>   
            <template #item.commission="{item}">
                <div v-html="currency_html(item.commission,item.currency)"></div>
            </template>   
            <template #item.taxes="{item}">
                <div v-html="currency_html(item.taxes,item.currency)"></div>
            </template>   
            <template #item.actions="{item}">
                <v-icon small class="mr-2" @click="copyDividend(item)">mdi-content-copy</v-icon>
                <v-icon small class="mr-2" @click="editDividend(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteDividend(item)">mdi-delete</v-icon>
            </template>
            <template #tbody>
                <tr class="totalrow" v-if="items.length>0">
                    <td>{{ f($t("Total ([0] registers)"), [items.length])}}</td>
                    <td></td>
                    <td v-if="all_items_has_same_currency" class="text-right" v-html="currency_html(listobjects_sum(items,'gross'),total_currency)"></td>
                    <td v-if="all_items_has_same_currency" class="text-right" v-html="currency_html(listobjects_sum(items,'net'), total_currency)"></td>
                    <td v-if="all_items_has_same_currency" class="text-right" v-html="currency_html(listobjects_sum(items,'commission'), total_currency)"></td>
                    <td v-if="all_items_has_same_currency" class="text-right" v-html="currency_html(listobjects_sum(items,'taxes'), total_currency)"></td>
                    <td></td>
                    <td></td>
                </tr>
            </template>
            <template #bottom ></template>   
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
    import { empty_dividend } from '../empty_objects.js'
    import { localtime, f } from 'vuetify_rules'
    export default {
        components:{
            DividendsCU,
        },
        props: {
            items: {
                required: true
            },
            showinvestment:{ //Only hides account if true
                type: Boolean,
                required:false,
                default:false,
            },
        },        
        computed:{
            // To sum amounts
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
            },
            total_currency: function(){
                if (this.items.length==0) return "Bad currency"
                return this.items[0].currency
            }
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
            f,
            localtime,
            copyDividend(item){
                this.dividend=this.empty_dividend()
                this.dividend.gross=item.gross
                this.dividend.net=item.net
                this.dividend.taxes=item.taxes
                this.dividend.commission=item.commission
                this.dividend.dps=item.dps
                this.dividend.investments=item.investments
                this.dividend.concepts=item.concepts
                this.dividend.currency_conversion=item.currency_conversion
                this.dividends_cu_mode="C"
                this.key=this.key+1
                this.dividends_cu_dialog=true
            },
            editDividend(item){
                this.dividend=item
                this.dividends_cu_mode="U"
                this.key=this.key+1
                this.dividends_cu_dialog=true
            },
            empty_dividend,
            deleteDividend(item){
                this.dividend=item
                this.dividends_cu_mode="D"
                this.key=this.key+1
                this.dividends_cu_dialog=true
            },
            table_headers(){
                var r= [
                    { title: this.$t('Date and time'), key: 'datetime', sortable: true },
                    { title: this.$t('Investment'), key: 'investments',sortable: true },
                    { title: this.$t('Concept'), key: 'concepts', sortable: true },
                    { title: this.$t('Gross'), key: 'gross', sortable: false, align:'end'},
                    { title: this.$t('Net'), key: 'net', sortable: false, align:'end'},
                    { title: this.$t('Commission'), key: 'commission', sortable: true , align:'end'},
                    { title: this.$t('Taxes'), key: 'taxes', sortable: true , align:'end'},
                    { title: this.$t('DPS'), key: 'dps', sortable: true , align:'end'},
                    { title: this.$t('Actions'), key: 'actions', sortable: false },
                ]
                if (this.showinvestment==false){
                    r.splice(1, 1)
                }
                return r
            },
            gotoLastRow(){
                //if (this.$refs[this.$vnode.tag]) this.$vuetify.goTo(1000000, { container:  this.$refs[this.$vnode.tag].$el.childNodes[0] }) 
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