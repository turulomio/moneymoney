<template>
        <v-data-table density="compact" :headers="table_headers()" :items="items" class="elevation-1" :sort-by="[{key:'dt_end',order:'asc'}]" fixed-header :height="$attrs.height" ref="table"
           :items-per-page="10000" >

            <template #item.dt_end="{item}">
                {{ localtime(item.raw.dt_end)}}
            </template>                       
        <template #item.investments="{item}">
            <div>{{ getMapObjectById("investments",item.raw.investments_id).fullname }}</div>
        </template>                    
        <template #item.operationstypes="{item}">
            <!-- <div v-html="store().operationstypes.get(item.operationstypes)"></div> -->
            <div>{{ getMapObjectById("operationstypes",item.raw.operationstypes_id).localname }}</div>
        </template>
            <template #item.gross_start_user="{item}">
                <div class="text-right" v-html="currency_html(item.raw.gross_start_user, item.raw.currency_user)"></div>
            </template>
            <template #item.gross_end_user="{item}">
                <div class="text-right" v-html="currency_html(item.raw.gross_end_user, item.raw.currency_user)"></div>
            </template>
            <template #item.gains_gross_user="{item}">
                <div class="text-right" v-html="currency_html(item.raw.gains_gross_user, item.raw.currency_user)"></div>
            </template>
            <template #item.commissions_user="{item}">
                <div class="text-right" v-html="currency_html(item.raw.commissions_user, item.raw.currency_user)"></div>
            </template>
            <template #item.taxes_user="{item}">
                <div class="text-right" v-html="currency_html(item.raw.taxes_user, item.raw.currency_user)"></div>
            </template>
            <template #item.gains_net_user="{item}">
                <div class="text-right" v-html="currency_html(item.raw.gains_net_user, item.raw.currency_user)"></div>
            </template>
            
            
            <template #item.gross_start_account="{item}">
                <div class="text-right" v-html="currency_html(item.raw.gross_start_account, item.raw.currency_account)"></div>
            </template>
            <template #item.gross_end_account="{item}">
                <div class="text-right" v-html="currency_html(item.raw.gross_end_account, item.raw.currency_account)"></div>
            </template>
            <template #item.gains_gross_account="{item}">
                <div class="text-right" v-html="currency_html(item.raw.gains_gross_account, item.raw.currency_account)"></div>
            </template>
            <template #item.commissions_account="{item}">
                <div class="text-right" v-html="currency_html(item.raw.commissions_account, item.raw.currency_account)"></div>
            </template>
            <template #item.taxes_account="{item}">
                <div class="text-right" v-html="currency_html(item.raw.taxes_account, item.raw.currency_account)"></div>
            </template>
            <template #item.gains_net_account="{item}">
                <div class="text-right" v-html="currency_html(item.raw.gains_net_account, item.raw.currency_account)"></div>
            </template>
            
            
            <template #item.gross_start_investment="{item}">
                <div class="text-right" v-html="currency_html(item.raw.gross_start_investment, item.raw.currency_product)"></div>
            </template>
            <template #item.gross_end_investment="{item}">
                <div class="text-right" v-html="currency_html(item.raw.gross_end_investment, item.raw.currency_product)"></div>
            </template>
            <template #item.gains_gross_investment="{item}">
                <div class="text-right" v-html="currency_html(item.raw.gains_gross_investment, item.raw.currency_product)"></div>
            </template>
            <template #item.commissions_investment="{item}">
                <div class="text-right" v-html="currency_html(item.raw.commissions_investment, item.raw.currency_product)"></div>
            </template>
            <template #item.taxes_investment="{item}">
                <div class="text-right" v-html="currency_html(item.raw.taxes_investment, item.raw.currency_product)"></div>
            </template>
            <template #item.gains_net_investment="{item}">
                <div class="text-right" v-html="currency_html(item.raw.gains_net_investment, item.raw.currency_product)"></div>
            </template>           
            <template #tbody>
                <tr class="totalrow" v-if="items.length>0 && showtotal">
                    <td>{{ $t("Total ([0] registers)").format(items.length)}}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td v-if="all_items_has_same_currency" class="text-right" v-html="currency_html(listobjects_sum(items,'gains_gross_' + output), total_currency)"></td>
                    <td v-if="all_items_has_same_currency" class="text-right" v-html="currency_html(listobjects_sum(items,'commissions_' + output), total_currency)"></td>
                    <td v-if="all_items_has_same_currency" class="text-right" v-html="currency_html(listobjects_sum(items,'taxes_' + output), total_currency)"></td>
                    <td v-if="all_items_has_same_currency" class="text-right" v-html="currency_html(listobjects_sum(items,'gains_net_' + output), total_currency)"></td>

                </tr>
            </template>
                <template #bottom ></template>   
        </v-data-table>  
</template>
<script>    
    export default {
        name: "TableInvestmentOperationsHistorical",
        props: {
            items: {
                required: true
            },
            output:{
                required:true,
            },
            showtotal:{// Items must have currency attribute
                type: Boolean,
                required:false,
                default: false,
            },
            showinvestment:{// Items must have accounts attribute
                type: Boolean,
                required:false,
                default: false,
            },
        },
        data: function(){
            return {
            }
        },        
        computed:{
            // To sum amounts
            all_items_has_same_currency(){
                if (this.items.length==0) return false
                var first_currency=this.currency(this.items[0])
                var r=true
                this.items.forEach(item => {//For Each doesn't allow to return false
                    if (this.currency(item)!=first_currency)  {
                        r=false
                    }
                });
                return r
            },
            total_currency: function(){
                if (this.items.length==0) return "Bad currency"
                return this.currency(this.items[0])
            }
        },
        methods: {
            // Currencies are part of the item
            currency(item){
                if (this.output=="account"){
                    return item.currency_account
                } else if (this.output=="investment"){
                    return item.currency_product
                } else if (this.output=="user"){
                    return item.currency_user
                }
            },
            table_headers(){
                var r
                if (this.output=="account"){
                    r= [
                        { title: this.$t('Date and time'), key: 'dt_end',sortable: true },
                        { title: this.$t('Years'), key: 'years',sortable: true },
                        { title: this.$t('Operation'), key: 'operationstypes',sortable: true },
                        { title: this.$t('Shares'), key: 'shares',sortable: false, align:'end'},
                        { title: this.$t('Gross start'), key: 'gross_start_account',sortable: false, align:'end'},
                        { title: this.$t('Gross end'), key: 'gross_end_account',sortable: false, align:'end'},
                        { title: this.$t('Gains gross'), key: 'gains_gross_account',sortable: false, align:'end'},
                        { title: this.$t('Commission'), key: 'commissions_account',sortable: false, align:'end'},
                        { title: this.$t('Taxes'), key: 'taxes_account',sortable: false, align:'end'},
                        { title: this.$t('Gains'), key: 'gains_net_account',sortable: false, align:'end'},
                    ]
                } else if (this.output=="investment"){
                    r= [
                        { title: this.$t('Date and time'), key: 'dt_end',sortable: true },
                        { title: this.$t('Years'), key: 'years',sortable: true },
                        { title: this.$t('Operation'), key: 'operationstypes',sortable: true },
                        { title: this.$t('Shares'), key: 'shares',sortable: false, align:'end'},
                        { title: this.$t('Gross start'), key: 'gross_start_investment',sortable: false, align:'end'},
                        { title: this.$t('Gross end'), key: 'gross_end_investment',sortable: false, align:'end'},
                        { title: this.$t('Gains gross'), key: 'gains_gross_investment',sortable: false, align:'end'},
                        { title: this.$t('Commission'), key: 'commissions_investment',sortable: false, align:'end'},
                        { title: this.$t('Taxes'), key: 'taxes_investment',sortable: false, align:'end'},
                        { title: this.$t('Gains'), key: 'gains_net_investment',sortable: false, align:'end'},
                    ]
                } else if (this.output=="user"){
                    r= [
                        { title: this.$t('Date and time'), key: 'dt_end',sortable: true },
                        { title: this.$t('Years'), key: 'years',sortable: true },
                        { title: this.$t('Operation'), key: 'operationstypes',sortable: true },
                        { title: this.$t('Shares'), key: 'shares',sortable: false, align:'end'},
                        { title: this.$t('Gross start'), key: 'gross_start_user',sortable: false, align:'end'},
                        { title: this.$t('Gross end'), key: 'gross_end_user',sortable: false, align:'end'},
                        { title: this.$t('Gains gross'), key: 'gains_gross_user',sortable: false, align:'end'},
                        { title: this.$t('Commission'), key: 'commissions_user',sortable: false, align:'end'},
                        { title: this.$t('Taxes'), key: 'taxes_user',sortable: false, align:'end'},
                        { title: this.$t('Gains'), key: 'gains_net_user',sortable: false, align:'end'},
                    ] 
                }
                if (this.showinvestment==true){
                    r.splice(2, 0, { title: this.$t('Investment'), key: 'investments',sortable: true });
                }
                return r
            },
            gotoLastRow(){
                // if (this.$refs.table) this.$vuetify.goTo(1000000, { container:  this.$refs.table.$el.childNodes[0] }) 
            },
        },
        mounted(){
            this.gotoLastRow()
        }
    }
</script>
