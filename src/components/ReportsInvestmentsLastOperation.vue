<template>
    <div>
       <h1 class="mb-3">{{ $t("Last operation investments list") }}</h1>
 
        <v-layout style="justify-content: center;">
            <v-card width="40%" class="pa-6">
                <v-select :label="$t('Select the way to show results')" v-model="method" :items="method_results" item-value="id" item-text="name"></v-select>
                <v-text-field v-model="limit"  type="number" :label="$t('Percentage gains of the last operation to highlight')"  :placeholder="$t('Enter a number')"></v-text-field>
            </v-card>
        </v-layout>
        <p></p>
        <v-data-table dense :headers="tableHeaders" :items="tableData" class="elevation-1 ma-4" disable-pagination  hide-default-footer item-key="id" :key="refreshKey"  :sort-by="['percentage_last']" :sort-desc="[true]" >        
            <template v-slot:[`item.datetime`]="{ item}">
                    {{ localtime(item.datetime)  }} 
            </template>  
            <template v-slot:[`item.balance`]="{ item }">
                <div v-html="localcurrency_html(item.balance)"></div>
            </template> 
            <template v-slot:[`item.gains`]="{ item }">
                <div v-html="localcurrency_html(item.gains)"></div>
            </template>
            <template v-slot:[`item.percentage_last`]="{ item }">
                <div  :class="item.percentage_last<limit/100 ? 'spanchildred' : ''" v-html="percentage_html(item.percentage_last)"></div>
            </template>
            <template v-slot:[`item.percentage_invested`]="{ item }">
                <div v-html="percentage_html(item.percentage_invested)"></div>
            </template>
            <template v-slot:[`item.percentage_sellingpoint`]="{ item }">
                <div v-html="percentage_html(item.percentage_sellingpoint)"></div>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small @click="viewItem(item)">mdi-pencil</v-icon>   
                <v-icon small @click="orderAtPercentage(item)">mdi-cart</v-icon>   
            </template>
        </v-data-table>
    </div>
</template>

<script>
    import axios from 'axios'
    import {localtime} from '../functions.js'
    export default {
        data(){ 
            return{
                tableHeaders: [
                    { text: this.$t('Name'), value: 'name', sortable: true},
                    { text: this.$t('Date and time'), value: 'datetime', sortable: true, align:"right"},
                    { text: this.$t('Last shares'), value: 'last_shares', sortable: true, align:"right", width:"7%" },
                    { text: this.$t('Total shares'), value: 'shares', sortable: true, align:"right", width:"7%" },
                    { text: this.$t('Balance'), value: 'balance', sortable: true, align:"right", width:"7%" },
                    { text: this.$t('Gains'), value: 'gains', sortable: true, align:"right", width:"7%" },
                    { text: this.$t('% last'), value: 'percentage_last', sortable: true, align:"right", width:"7%" },
                    { text: this.$t('% invested'), value: 'percentage_invested', sortable: true, align:"right", width:"7%" },
                    { text: this.$t('% selling point'), value: 'percentage_sellingpoint', sortable: true, align:"right", width:"7%" },
                    { text: this.$t('Actions'), value: 'actions', sortable: true, cellClass: "text-nowrap" , width:"7%" },
                ],   
                tableData: [],
                method_results: [
                    { id:0, name:this.$t('Show separated investments')},
                    { id:1, name:this.$t('Show merging current investment operations')},
                    { id:2, name:this.$t('Show mergin all investment operations')},     
                ],
                limit: 40,
                method: 0,
                refreshKey: 0,
            }
        },
        watch:{
            method: function(){
                this.refreshTable()
            }
        },
        methods:{
            localtime,
            viewItem(item){
                window.location.href="{%url 'investment_view' pk=9999%}".replace("9999", item.id)
            },
            orderAtPercentage(item){
                return (item)
                // var price=my_round(item.last_price*(1+this.limit/100), item.decimals)
                // window.location.href="{% url 'order_new' }}"+`?price=${price}&investment=${item.id}`
            },
            refreshTable(){
                axios.get(`${this.$store.state.apiroot}/reports/investments/lastoperation/` , this.myheaders())
                .then( (response)=> {
                    this.tableData=response.data;
                    this.refreshKey=this.refreshKey+1;
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
