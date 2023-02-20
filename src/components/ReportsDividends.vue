<template>
    <div>
        <h1>{{ $t("Dividends report") }}</h1>   
        <v-container  style="width:40%" elevation="1">
            <v-card>
                <v-col  justify="space-around">
                    <v-text-field v-model="alertdays"  :label="$t('Max days to update dividends alert')" :placeholder="$t('Enter an integer number')"></v-text-field>
                </v-col>
            </v-card>
        </v-container>
        <div class="pa-6">
            <v-data-table dense :headers="tableHeaders"  :items="items" class="elevation-1" disable-pagination  hide-default-footer :sort-by="['percentage']" :sort-desc="['percentage']">
                <template v-slot:[`item.dps`]="{item}" >
                    <div v-html="currency_html(item.dps,item.currency )"></div>
                </template>    
                <template v-slot:[`item.estimated`]="{item}" >
                    <div v-html="currency_html(item.estimated,item.currency )"></div>
                </template>    
                <template v-slot:[`item.current_price`]="{item}" >
                    <div v-html="currency_html(item.current_price,item.currency )"></div>
                </template>    
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small class="mr-2" @click="addEstimation(item)">mdi-pencil</v-icon>
                    <v-icon small @click="addEstimation(item)" v-if="showAlarm(item)" color="#9933ff">mdi-alarm</v-icon>
                </template> 
                <template v-slot:[`item.percentage`]="{ item }">
                    <div v-html="percentage_html(item.percentage )"></div>
                </template>
            </v-data-table>
            <p class="mt-4 ">{{ total() }}</p>
        </div>
        

        <!-- ESTIMATIONS_DPS CU -->
        <v-dialog v-model="dialog" width="35%">
            <v-card class="pa-4">
                <EstimationsDpsCU :estimation="estimation" :mode="estimation_mode" @cruded="on_EstimationsDpsCU_cruded()" :key="key" />
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import axios from 'axios'
    import moment from 'moment'
    import EstimationsDpsCU from './EstimationsDpsCU.vue'
    import {empty_estimation_dps} from '../empty_objects.js'
    export default {
        components:{
            EstimationsDpsCU,
        },
        data(){ 
            return{
                alertdays:90,
                tableHeaders: [
                    { text: this.$t('Investment'), value: 'name',sortable: true },
                    { text: this.$t('Current price'), value: 'current_price',sortable: true, align: 'right'},
                    { text: this.$t('DPS'), value: 'dps',sortable: false, align: 'right', cellClass: "text-nowrap"},
                    { text: this.$t('Shares'), value: 'shares',sortable: false, align: 'right'},
                    { text: this.$t('Estimated balance'), value: 'estimated',sortable: false, align: 'right'},
                    { text: this.$t('Percentage'), value: 'percentage',sortable: false, align: 'right', },
                    { text: this.$t('Actions'), value: 'actions',sortable: false, align: 'right'},
                ],
                items:[],
                
                
                loading_dividends:false,

                //Estimations DPS CU
                dialog:false,
                estimation: null,
                estimation_mode: null,
                key: 0,
            }
        },
        methods:{
            showAlarm(item){
                var today= moment()
                var estimation= moment(item.date_estimation)
                if (item.dps==null || today.diff(estimation,"days") > this.alertdays ) {
                    return true
                }
                return false
            },
            addEstimation(item){
                this.estimation=this.empty_estimation_dps()
                this.estimation.products=item.product
                this.estimation_mode="C"
                this.key=this.key+1
                this.dialog=true
            },
            empty_estimation_dps,
            on_EstimationsDpsCU_cruded(){
                this.dialog=false
                this.refreshTable()
            },
            refreshTable(){
                this.loading_dividends=true
                axios.get(`${this.$store.state.apiroot}/reports/dividends/`, this.myheaders())
                .then((response) => {
                    this.items=response.data
                    this.loading_dividends=false
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            total(){
                var total=this.items.reduce((accum,item) => accum + item.estimated, 0)
                return this.$t("If I kept the investments for a year I would get {0}").format( this.localcurrency_string(total))
            }
            
        },
        mounted(){
            this.refreshTable()
        }
    }
</script>
