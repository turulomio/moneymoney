<template>
    <div>
        <h1>{{ $t("Concepts report") }}</h1>
        <div class="d-flex justify-center mb-4">
            <v-card  class="pa-2 mt-4">             
                <v-date-picker landscape dense no-title label="Select a month" class="mymonthpicker " v-model="monthpicker" type="month"></v-date-picker>
            </v-card>
        </div>
        <div class="ma-4">
            <v-tabs  background-color="primary" dark v-model="tab" next-icon="mdi-arrow-right-bold-box-outline" prev-icon="mdi-arrow-left-bold-box-outline" show-arrows>
                <v-tab key="positive">{{ $t("Positive balance concepts") }}</v-tab>
                <v-tab key="negative">{{ $t("Negative balance concepts") }}</v-tab>
                <v-tabs-slider color="yellow"></v-tabs-slider>
            </v-tabs>
            <v-tabs-items v-model="tab">
                <v-tab-item key="positive">
                    <v-card outlined>
                        <v-data-table dense :headers="itemsHeaders" :items="itemsPositive"  class="elevation-1" disable-pagination  hide-default-footer :loading="loading" height="300">
                            <template v-slot:[`item.concept`]="{ item }">
                                <div v-html="$store.getters.getObjectPropertyByUrl('concepts',item.concept,'name')"></div>
                            </template> 
                            <template v-slot:[`item.total`]="{ item }">
                                <div v-html="localcurrency_html(item.total)"></div>
                            </template>   
                            <template v-slot:[`item.median`]="{ item }">
                                <div v-html="localcurrency_html(item.median)"></div>
                            </template>  
                            <template v-slot:[`item.percentage_total`]="{ item }">
                                <div v-html="percentage_html(item.percentage_total)"></div>
                            </template>              
                            <template v-slot:[`item.actions`]="{ item }">
                                <v-icon small @click="viewHistoricalReport(item)">mdi-eye</v-icon>   
                            </template>             
                            <template v-slot:[`body.append`]="{headers}">
                                <tr style="background-color: GhostWhite" ref="lr">
                                    <td v-for="(header,i) in headers" :key="i" >
                                        <div v-if="header.value == 'concept'">
                                            Total
                                        </div>
                                        <div v-if="header.value == 'total'" class="d-flex justify-end">
                                            <div v-html="localcurrency_html(listobjects_sum(itemsPositive,'total'))"></div>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                        </v-data-table>   
                    </v-card>
                </v-tab-item>
                <v-tab-item key="negative">     
                    <v-card outlined>
                        <v-data-table dense :headers="itemsHeaders" :items="itemsNegative"  class="elevation-1" disable-pagination  hide-default-footer :sort-by="['year']" :loading="loading">
                            <template v-slot:[`item.concept`]="{ item }">
                                <div v-html="$store.getters.getObjectPropertyByUrl('concepts',item.concept,'name')"></div>
                            </template> 
                            <template v-slot:[`item.total`]="{ item }">
                                <div v-html="localcurrency_html(item.total)"></div>
                            </template>   
                            <template v-slot:[`item.median`]="{ item }">
                                <div v-html="localcurrency_html(item.median)"></div>
                            </template>  
                            <template v-slot:[`item.percentage_total`]="{ item }">
                                <div v-html="percentage_html(item.percentage_total)"></div>
                            </template>          
                            <template v-slot:[`item.actions`]="{ item }">
                                <v-icon small @click="viewHistoricalReport(item)">mdi-eye</v-icon>   
                            </template>                    
                            <template v-slot:[`body.append`]="{headers}">
                                <tr style="background-color: GhostWhite" ref="lr">
                                    <td v-for="(header,i) in headers" :key="i" >
                                        <div v-if="header.value == 'concept'">
                                            Total
                                        </div>
                                        <div v-if="header.value == 'total'" class="d-flex justify-end">
                                            <div v-html="localcurrency_html(listobjects_sum(itemsNegative,'total'))"></div>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                        </v-data-table>  
                    </v-card>
                </v-tab-item>
            </v-tabs-items>    
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
    import ReportsConceptsHistorical from './ReportsConceptsHistorical'
    export default {
        components:{
            ReportsConceptsHistorical,
        },
        data(){
            return {
                tab:1,
                monthpicker: new Date().toISOString().slice(0,7),
                itemsHeaders: [
                    { text: this.$t('Concept'), value: 'concept',sortable: true },
                    { text: this.$t('Total'), value: 'total',sortable: true, align:'right'},
                    { text: this.$t('Total percentage'), value: 'percentage_total',sortable: true, align:'right'},
                    { text: this.$t('Median'), value: 'median',sortable: true, align:'right'},
                    { text: 'Actions', value: 'actions', sortable: false },
                ],   
                itemsPositive: [],
                itemsNegative: [],
                loading:false,
                key: 0,
                dialog_historical: false,
                concept:null,
            }
        },
        watch:{
            monthpicker: function (){
                this.refreshTables()
            }
        },
        methods:{
            refreshTables(){
                this.loading=true
                var mp=this.monthpicker.split("-")
                console.log(this.monthpicker)
                console.log(mp)
                axios.get(`${this.$store.state.apiroot}/reports/concepts/?year=${mp[0]}&month=${mp[1]}`, this.myheaders())
                .then((response) => {
                    console.log(response.data)
                    this.itemsPositive=response.data.positive
                    this.itemsNegative=response.data.negative
                    this.loading=false
                    this.key=this.key+1
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            viewHistoricalReport(item){
                this.dialog_historical=true
                this.concept=item.concept
                this.key=this.key+1
            }
        },
        mounted(){

            this.refreshTables()

        }
    }
</script>
