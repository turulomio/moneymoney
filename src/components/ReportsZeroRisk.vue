<template>
    <div>    
        <h1>{{ $t('Zero risk assets') }}</h1>
        <v-data-table density="compact" :headers="investments_headers" :items="investments_items" class="elevation-1" :sort-by="[{key:'fullname',order:'asc'}]" fixed-header  :items-per-page="5000000" fixed-footer @click:row="viewItem" :loading="loading">
            <template #item.fullname="{item}">
                <v-icon :class="'fi fib fi-'+item.flag" small :title="this.getCountryNameByCode(item.flag)"></v-icon>
                <v-icon small class="ml-1" v-if="item.shares>=0" color="blue" :title="$t('Long position')">mdi-arrow-up-circle-outline</v-icon>
                <v-icon small class="ml-1" v-if="item.shares<0" color="orange" :title="$t('Short position')">mdi-arrow-down-circle-outline</v-icon>
                {{item.fullname}}
            </template>                  
 
            <template #item.balance_user="{item}">
                <div class="text-right" v-html="localcurrency_html(item.balance_user )"></div>
            </template>
            
         <template #bottom ></template>
            <template #tbody>
                <tr class="totalrow" v-if="investments_items.length>0" >
                    <td>{{ f($t("Total ([0] registers)"), [investments_items.length]) }}</td>
                    <td class="text-right" v-html="localcurrency_html(listobjects_sum(investments_items,'balance_user'))"></td>
                </tr>
            </template>
        </v-data-table>
        <!-- DIALOG  VIEW INVESTMERNT -->
        <v-dialog v-model="dialog_view" v-if="investment">
            <v-card class="pa-4">
                <InvestmentsView :investment_id="investment.id" :key="key" @cruded="on_InvestmentView_cruded"></InvestmentsView>
            </v-card>
        </v-dialog>

    </div>
</template>
<script>
    import axios from 'axios'
    import {f} from 'vuetify_rules'
    import InvestmentsView from './InvestmentsView.vue'
    export default {
        components:{
            InvestmentsView,
        },
        data(){ 
            return{
                investments_headers: [
                    { title: this.$t('Name'), sortable: true, key: 'fullname'},
                    { title: this.$t('Balance'), key: 'balance_user', align:'end',  width: "20%", sortable:true},
                ],
                investments_items:[],
                dialog:false,
                investment: null,
                investment_mode: null,
                loading:false,
                dialog_view:false,
                key:0,

            }
        },
        watch:{
            showActive () {
                this.update_table()
            },
        },
        methods: { 
            f,
            on_InvestmentView_cruded(){
                this.key=this.key+1
                this.update_table()
            },
            update_table(){
                this.loading=true
                axios.get(`${this.store().apiroot}/reports/zerorisk/`, this.myheaders())
                .then((response) => {
                    this.investments_items=response.data
                    this.loading=false
                    this.key=this.key+1
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            viewItem (event,object) {
                if (object.item.id==null) return //Accounts total balance
                this.investment=object.item
                this.key=this.key+1
                this.dialog_view=true
            },
        },
        mounted(){
            this.update_table()
        }
    }
</script>
