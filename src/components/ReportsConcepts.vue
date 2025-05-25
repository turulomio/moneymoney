<template>
    <div>
        <h1>{{ $t("Concepts report") }}</h1>
        <MyMonthPicker v-model="ym"/>


        <div class="mx-4">
            <v-tabs  bg-color="secondary" dark v-model="tab">
                <v-tab key="positivechart">{{ $t("Positive balance chart") }}</v-tab>
                <v-tab key="negativechart">{{ $t("Negative balance chart") }}</v-tab>
                <v-tab key="positive">{{ $t("Positive balance concepts") }}</v-tab>
                <v-tab key="negative">{{ $t("Negative balance concepts") }}</v-tab>
            </v-tabs>
            <v-window v-model="tab">
                <v-window-item key="positivechart">
                        <ChartPie v-if="showpie" name="Positive balance concepts" :items="piedataPositive" :key="`A${key}`" />
                </v-window-item>
                <v-window-item key="negativechart">
                        <ChartPie v-if="showpie" name="Negative balance concepts" :items="piedataNegative" :key="`B${key}`" />
                </v-window-item>
                <v-window-item key="positive">
                    <v-card>
                        <v-data-table density="compact" :headers="itemsHeaders" :items="itemsPositive"  class="elevation-1 cursorpointer" :loading="loading" height="300" @click:row="viewHistoricalReport" :sort-by="[{key:'percentage_total',order:'desc'}]"    :items-per-page="10000" >
                            <template #item.concept="{item}">
                                <div v-html="useStore().concepts.get(item.concept).localname"></div>
                            </template> 
                            <template #item.total="{item}">
                                <div v-html="localcurrency_html(item.total)"></div>
                            </template>   
                            <template #item.median="{item}">
                                <div v-html="localcurrency_html(item.median)"></div>
                            </template>  
                            <template #item.percentage_total="{item}">
                                <div v-html="percentage_html(item.percentage_total)"></div>
                            </template>       
                            <template #tbody v-if="itemsPositive.length>0">
                                <tr class="totalrow" ref="lr">
                                    <td>{{ $t("Total") }}</td>
                                    <td class="text-right" v-html="localcurrency_html(listobjects_sum(itemsPositive,'total'))"></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </template>
                            <template #bottom ></template>   
                        </v-data-table>   
                    </v-card>
                </v-window-item>
                <v-window-item key="negative">     
                    <v-card outlined>
                        <v-data-table density="compact" :headers="itemsHeaders" :items="itemsNegative"  class="elevation-1 cursorpointer" hide-default-footer :loading="loading" @click:row="viewHistoricalReport"  :sort-by="[{key:'percentage_total',order:'desc'}]"     :items-per-page="10000" >

                            <template #item.concept="{item}">
                                <div v-html="useStore().concepts.get(item.concept).localname"></div>
                            </template> 
                            <template #item.total="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.total)"></div>
                            </template>   
                            <template #item.median="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.median)"></div>
                            </template>  
                            <template #item.percentage_total="{item}">
                                <div class="text-right" v-html="percentage_html(item.percentage_total)"></div>
                            </template>
                            <template #tbody v-if="itemsNegative.length>0">
                                <tr class="totalrow" ref="lr">
                                    <td>{{ $t("Total") }}</td>
                                    <td class="text-right" v-html="localcurrency_html(listobjects_sum(itemsNegative,'total'))"></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </template>
                            <template #bottom ></template>   
                        </v-data-table>  
                    </v-card>
                </v-window-item>
            </v-window>    
        </div>
        <!-- VIEW HISTORICAL REPORT dialog -->
        <v-dialog v-model="dialog_historical">
            <v-card class="pa-4">
                <ReportsConceptsHistorical :concept="concept" :key="key" ></ReportsConceptsHistorical>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>     
    import axios from 'axios'
    import { useStore } from "@/store"
    import ReportsConceptsHistorical from './ReportsConceptsHistorical'
    import MyMonthPicker from './MyMonthPicker.vue'
    import ChartPie from './ChartPie.vue'
import { parseResponseError } from '@/functions'

    export default {
        components:{
            ReportsConceptsHistorical,
            MyMonthPicker,
            ChartPie,
        },
        data(){
            return {
                tab:0,
                ym: null,
                itemsHeaders: [
                    { title: this.$t('Concept'), key: 'concept',sortable: true },
                    { title: this.$t('Total'), key: 'total',sortable: true, align:'end'},
                    { title: this.$t('Total percentage'), key: 'percentage_total',sortable: true, align:'end'},
                    { title: this.$t('Median'), key: 'median',sortable: true, align:'end'},
                ],   
                showpie:false,
                itemsPositive: [],
                itemsNegative: [],
                piedataPositive: null,
                piedataNegative: null,
                loading:false,
                key: 0,
                dialog_historical: false,
                concept:null,
            }
        },
        watch:{
            ym(){
                this.refreshTables()
            },
            tab(){
                this.showpie=false
                setTimeout(() => {this.showpie=true }, 300)
            },
        },
        methods:{
            useStore,
            parseResponseError,
            refreshTables(){
                this.loading=true
                axios.get(`${this.useStore().apiroot}/reports/concepts/?year=${this.ym.year}&month=${this.ym.month}`, this.myheaders())
                .then((response) => {
                    this.itemsPositive=response.data.positive
                    this.itemsNegative=response.data.negative
                    this.piedataPositive=[]
                    this.piedataNegative=[]
                    this.itemsPositive.forEach(o=>{
                        this.piedataPositive.push({"name": useStore().concepts.get(o.concept).localname, "value":Math.abs(o.total)})
                    })
                    this.itemsNegative.forEach(o=>{
                        this.piedataNegative.push({"name": useStore().concepts.get(o.concept).localname, "value":Math.abs(o.total)})
                    })
                    console.log(this.piedataNegative, this.piedataPositive)
                    this.showpie=true
                    this.loading=false
                    this.key=this.key+1
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            viewHistoricalReport(event,object){
                this.dialog_historical=true
                this.concept=object.item.concept
                this.key=this.key+1
            }
        },
        mounted(){

            this.refreshTables()

        }
    }
</script>
