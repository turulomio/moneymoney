<template>
    <div>
       <h1 class="mb-3">{{ $t("Last operation investments list") }}</h1>
 
        <v-layout style="justify-content: center;">
            <v-card width="60%" class="d-flex flex-row" flat>
                <v-select :label="$t('Select the way to show results')" v-model="method" :items="method_results" item-value="id" item-title="name"></v-select>
                <v-text-field v-model.number="limit" class="ml-4" :label="$t('Percentage gains of the last operation to highlight')"  :placeholder="$t('Enter a number')"></v-text-field>
            </v-card>
        </v-layout>
        <p></p>
        <v-data-table density="compact" :headers="tableHeaders" :items="tableData" class="elevation-1 ma-4" item-key="id" :key="refreshKey" :sort-by="[{key:'percentage_last',order:'desc'}]" @click:row="viewMerged" :items-per-page="10000" >
            <template #item.datetime="{item}">
                    {{ localtime(item.data.last_datetime)  }} 
            </template>            
            <template #item.name="{item}">
                    {{ item.data.name  }} 
            </template>
            <template #item.shares="{item}">
                <div class="text-right">{{ item.total_io_current.shares  }} </div>
            </template>
            <template #item.last_shares="{item}">
                <div class="text-right">{{ item.data.last_shares  }} </div>
            </template>

            <template #item.balance="{item}">
                <div class="text-right" v-html="localcurrency_html(item.total_io_current.balance_futures_user)"></div>
            </template>
            <template #item.gains="{item}">
                <div class="text-right" v-html="localcurrency_html(item.total_io_current.gains_gross_user)"></div>
            </template>
            <template #item.percentage_last="{item}">
                <div  :class="item.data.percentage_last<limit/100 ? 'boldred text-right' : 'text-right'" v-html="percentage_html(item.data.percentage_last)"></div>
            </template>
            <template #item.percentage_invested="{item}">
                <div class="text-right" v-html="percentage_html(item.data.percentage_invested)"></div>
            </template>
            <template #item.percentage_sellingpoint="{item}">
                <div class="text-right" v-html="percentage_html(item.data.percentage_sellingpoint)"></div>
            </template>
            <template #item.actions="{item}">                   
                <v-row class="text-nowrap" justify="center">
                    <v-icon small @click.stop="orderAtPercentage(item)">mdi-cart</v-icon>   
                    <div @click.stop="reinvestAtPercentage(item)"> <v-img color="#757575" :src="imgReinvest"  :height="16" :width="16" contain ></v-img></div>
                </v-row>
            </template>
                <template #bottom ></template>   
        </v-data-table>

        <!-- Order CU dialog -->
        <v-dialog v-model="dialog_cu" max-width="550">
            <v-card class="pa-4">
                <OrdersCU :order="order" mode="C" :key="refreshKey" @cruded="on_OrdersCU_cruded()"></OrdersCU>
            </v-card>
        </v-dialog>


        <!-- Reinvest dialog -->
        <v-dialog v-model="dialog_reinvest">
            <v-card class="pa-4">
                <InvestmentsoperationsReinvest :shares="reinvest_shares" :price="reinvest_price" :ios_id="ios_id" :key="refreshKey" />
            </v-card>
        </v-dialog>


        <!-- InvestmentMergedView dialog -->
        <v-dialog v-model="dialog_imv" max-width="100%">
            <v-card class="pa-4">
                <InvestmentsMergedView :ios_id="ios_id" :key="refreshKey" />
            </v-card>
        </v-dialog>

        <!-- InvestmentView dialog -->
        <v-dialog v-model="dialog_iv" max-width="100%">
            <v-card class="pa-4">
                <InvestmentsView :investment_id="investment_id" :key="refreshKey" />
            </v-card>
        </v-dialog>

    </div>
</template>

<script>
    import imgReinvest from '@/assets/reinvest.png'
    import axios from 'axios'
    import {empty_order} from '../empty_objects.js'
    import OrdersCU from './OrdersCU.vue'
    import InvestmentsView from './InvestmentsView.vue'
    import InvestmentsMergedView from './InvestmentsMergedView.vue'
    import InvestmentsoperationsReinvest from './InvestmentsoperationsReinvest.vue'
    export default {
        components:{
            OrdersCU,
            InvestmentsoperationsReinvest,
            InvestmentsView,
            InvestmentsMergedView,
        },
        data(){ 
            return{
                tableHeaders: [
                    { title: this.$t('Name'), key: 'name', sortable: true},
                    { title: this.$t('Date and time'), key: 'datetime', sortable: true, align:'end'},
                    { title: this.$t('Last shares'), key: 'last_shares', sortable: true, align:'end', width:"7%" },
                    { title: this.$t('Total shares'), key: 'shares', sortable: true, align:'end', width:"7%" },
                    { title: this.$t('Balance'), key: 'balance', sortable: true, align:'end', width:"7%" },
                    { title: this.$t('Gains'), key: 'gains', sortable: true, align:'end', width:"7%" },
                    { title: this.$t('% last'), key: 'percentage_last', sortable: true, align:'end', width:"7%" },
                    { title: this.$t('% invested'), key: 'percentage_invested', sortable: true, align:'end', width:"7%" },
                    { title: this.$t('% selling point'), key: 'percentage_sellingpoint', sortable: true, align:'end', width:"7%" },
                    { title: this.$t('Actions'), key: 'actions', sortable: true, cellClass: "text-nowrap" , width:"6%" },
                ],   
                tableData: [],
                method_results: [
                    { id:0, name:this.$t('Show separated investments')},
                    { id:1, name:this.$t('Show merging current investment operations')},
                ],
                limit: -40,
                method: 0,
                refreshKey: 0,


                dialog_cu:false,
                order: null,
                loading:false,

                //Reinvest
                dialog_reinvest:false,
                ios_id:null,
                reinvest_shares:0,
                reinvest_price:0,
                imgReinvest:imgReinvest,

                //InvestmentsMergedView
                dialog_imv:false,

                //InvestmentsView,
                dialog_iv:false,
                investment_id:null,
            }
        },
        watch:{
            method: function(){
                this.refreshTable()
            }
        },
        methods:{
            empty_order,
            on_OrdersCU_cruded(){
                this.dialog_cu=false
            },
            viewMerged(event,object){                
                if (this.method==0){//Normal investment
                    this.investment_id=object.item.data.investments_id
                    this.key=this.key+1
                    this.dialog_iv=true
                } else if (this.method==1){//Merged
                    this.ios_id=object.item
                    this.key=this.key+1
                    this.dialog_imv=true
                }
            },
            orderAtPercentage(item){
                this.order=this.empty_order()
                this.order.price=this.my_round(item.data.last_price*(1+this.limit/100), item.decimals)
                this.order.investments=this.hyperlinked_url("investments",item.data.investments_id)
                this.refreshKey=this.refreshKey+1
                this.dialog_cu=true
            },
            reinvestAtPercentage(item){
                this.reinvest_price=this.my_round(item.data.last_price*(1+this.limit/100), item.decimals)
                this.reinvest_shares=0
                this.ios_id=item
                this.refreshKey=this.refreshKey+1
                this.dialog_reinvest=true
            },
            refreshTable(){
                this.loading=true
                axios.get(`${this.store().apiroot}/reports/investments/lastoperation/?method=${this.method}` , this.myheaders())
                .then( (response)=> {
                    this.tableData=[]
                    response.data.entries.forEach(e => {
                        this.tableData.push(response.data[e])
                    });
                    this.refreshKey=this.refreshKey+1;
                    this.loading=false
                }) 
                .catch((error) => {
                    this.parseResponseError(error)
                });
            }
        },
        mounted(){
            this.refreshTable()
        }
    }
</script>
