<!--
    Emits, @cruded when a dividend, investment or investment operation is cruded
-->
<template>
    <div>
        <h1>{{ $t(`Annual incomes detail (${this.year}-${this.month})`) }}</h1>
        <v-tabs class="mt-4" v-model="tab" background-color="primary" dark next-icon="mdi-arrow-right-bold-box-outline" prev-icon="mdi-arrow-left-bold-box-outline" show-arrows>
            <v-tab key="incomes">{{ $t('Incomes') }}</v-tab>
            <v-tab key="expenses">{{ $t('Expenses') }}</v-tab>
            <v-tab key="dividends">{{ $t('Dividends') }}</v-tab>
            <v-tab key="gains">{{ $t('Gains') }}</v-tab>
            <v-tabs-slider color="yellow"></v-tabs-slider>
            <v-tabs-items v-model="tab">
                <v-tab-item key="incomes">        
                    <v-card class="pa-4">
                    <TableAccountOperations :homogeneous="false" :items="incomes" :total_currency="$store.state.local_currency" :showactions="false" height="600" class=" flex-grow-1 flex-shrink-0" ></TableAccountOperations>
                    </v-card>
                </v-tab-item>
                <v-tab-item key="expenses">       
                    <v-card class="pa-4">
                    <TableAccountOperations :homogeneous="false" :items="expenses" :total_currency="$store.state.local_currency" :showactions="false" height="600" class=" flex-grow-1 flex-shrink-0" ></TableAccountOperations>
                    </v-card>
                </v-tab-item>
                <v-tab-item key="dividends">     
                    <v-card class="pa-4">
                        <TableDividends :items="dividends" currency_account="EUR"  height="600" output="user" :key="key" :homogeneus="false"></TableDividends>
                    </v-card>
                </v-tab-item>
                <v-tab-item key="gains">       
                    <v-card class="pa-4">
                        <TableInvestmentOperationsHistorical :items="gains" :homogeneus="false" height="600" output="user" :key="key"></TableInvestmentOperationsHistorical>

                    </v-card>
                </v-tab-item>
            </v-tabs-items> 
        </v-tabs>
    </div>  
</template>
<script>
    import axios from 'axios'
    // import {listobjects_sum, parseNumber,listobjects_average_ponderated} from '../functions.js'
    import TableAccountOperations from './TableAccountOperations.vue'
    import TableDividends from './TableDividends.vue'
    
    import TableInvestmentOperationsHistorical from './TableInvestmentOperationsHistorical.vue'
    export default {
        components:{
            TableAccountOperations,
            TableDividends,
            TableInvestmentOperationsHistorical,
        },
        props: {
            year: {
                required: true
            },
            month: {
                required:true,
            }
        },
        data () {
            return {
                loading:false,
                expenses:[],
                incomes:[],
                dividends:[],
                gains:[],
                key:0,
                tab:3,
            }  
        },
        watch:{
        },
        methods: {
            refreshTable(){
                this.loading=true
                axios.get(`${this.$store.state.apiroot}/reports/annual/income/details/${this.year}/${this.month}/`, this.myheaders())
                .then((response) => {
                    console.log(response.data)
                    this.expenses=response.data.expenses
                    this.gains=response.data.gains
                    this.incomes=response.data.incomes
                    this.dividends=response.data.dividends
                    this.key=this.key+1
                    this.loading=false
                    console.log(this.dividends)
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
        },
        created(){
            this.refreshTable()

        }
    }
</script>

