<template>
    <div>    
        <h1>{{ $t('Ranking investments report') }}</h1>
        <v-card flat class="ma-4 pa-4">
            <v-card flat class="d-flex flex-row mb-4 mx-auto">
                <v-checkbox  v-model="only_current_investments" :label="$t('Show only current investments?')" />
                <v-text-field  v-model="search" append-icon="mdi-magnify" :label="$t('Filter')" single-line hide-details :placeholder="$t('Add a string to filter table')"></v-text-field>
            </v-card>
            <v-data-table density="compact" :headers="headers" :search="search" :items="data" class="elevation-1" :loading="loading_table" height="75vh" fixed-header :items-per-page="10000" :sort-by="[{key:'ranking',order:'asc'}]" @click:row="viewInvestmentsMerged">
                <template #item.ranking="{item}">
                    {{ item.ranking }}
                </template>  
                <template #item.name="{item}">
                    {{ item.name }}
                </template>  
                <template #item.current_net_gains="{item}">
                    <div class="text-right" v-html="localcurrency_html(item.current_net_gains )"></div>
                </template>  
                <template #item.historical_net_gains="{item}">
                    <div class="text-right" v-html="localcurrency_html(item.historical_net_gains )"></div>
                </template>  
                <template #item.dividends="{item}">
                    <div class="text-right" v-html="localcurrency_html(item.dividends )"></div>
                </template>  
                <template #item.total="{item}">
                    <div class="text-right" v-html="localcurrency_html(item.total )"></div>
                </template>  
                <template #tbody v-if="data.length>0">
                    <tr class="totalrow" ref="lr" v-if="search==''">
                        <td>{{ $t("Total") }}</td>          
                        <td></td>
                        <td class="text-right" v-html="localcurrency_html(listobjects_sum(data,'current_net_gains'))"></td>
                        <td class="text-right" v-html="localcurrency_html(listobjects_sum(data,'historical_net_gains'))"></td>
                        <td class="text-right" v-html="localcurrency_html(listobjects_sum(data,'dividends'))"></td>
                        <td class="text-right" v-html="localcurrency_html(listobjects_sum(data,'total'))"></td>
                        <td></td>
                    </tr>
                </template>            
                <template #bottom ></template>               
            </v-data-table>
        </v-card>
        <!-- Investments merged View dialog -->
        <v-dialog v-model="dialog_investments_merged_view">
            <v-card class="pa-4">
                <InvestmentsMergedView :ios_id="ios_id" :key="key" />
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import axios from 'axios'
    import { useStore } from "@/store"
    import InvestmentsMergedView from './InvestmentsMergedView.vue'
    import { parseResponseError, listobjects_sum, localcurrency_html } from '@/functions'
    export default {
        components:{
            InvestmentsMergedView,
        },
        data(){ 
            return{
                headers: [
                    { title: this.$t('Ranking'), sortable: true, key: 'ranking',  width: "3%"},
                    { title: this.$t('Name'), key: 'name'},
                    { title: this.$t('Current net gains'), key: 'current_net_gains', align:'end',  width: "10%"},

                    { title: this.$t('Historical net gains'), key: 'historical_net_gains', align:'end',  width: "10%"},
                    { title: this.$t('Net dividends'), key: 'dividends', align:'end',  width: "10%"},
                    { title: this.$t('Total'), key: 'total', align:'end',  width: "10%"},
                ],
                data:[],
                ios:null,
                loading_table:false,
                search:"",
                only_current_investments:false,

                // Investments merged view
                dialog_investments_merged_view:false,
                ios_id:null,
                key:0,
            }
        },
        watch: {
            only_current_investments(){
                this.filter_data()
            }
        },
        methods: {
            useStore,
            parseResponseError,
            listobjects_sum,
            localcurrency_html,
            viewInvestmentsMerged (event,object) {
                this.ios_id=this.ios[object.item.products_id]
                this.key=this.key+1
                this.dialog_investments_merged_view=true
            },
            update_table(){
                this.loading_table=true

                axios.get(`${this.useStore().apiroot}/reports/ranking/`, this.myheaders())
                .then((response) => {
                    this.ios=response.data
                    this.filter_data()
                    this.loading_table=false
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            filter_data(){
                this.data=[]
                this.ios.entries.forEach(o=>{
                    var e=this.ios[o]
                    if (this.only_current_investments){
                        if (e.total_io_current.gains_net_user!=0){
                            this.data.push(this.entry_to_data(e))
                        }
                    } else {
                        this.data.push(this.entry_to_data(e))
                    }
                })

            },
            entry_to_data(e){
                return {
                    ranking: e.data.ranking,
                    name: e.data.name,
                    current_net_gains:e.total_io_current.gains_net_user,
                    historical_net_gains: e.total_io_historical.gains_net_user,
                    dividends: e.data.dividends,
                    total: e.total_io_current.gains_net_user+ e.total_io_historical.gains_net_user + e.data.dividends,
                    products_id: e.data.products_id,
                }
            }
        },
        created(){
            this.update_table()
        }
    }
</script>

