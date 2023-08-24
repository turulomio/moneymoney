<!--
    Emits, @cruded when a dividend, investment or investment operation is cruded
-->
<template>
    <div>
        <h1>{{ $t("Annual incomes detail ([0]-[1])").format(this.year, this.month) }}</h1>
        <v-tabs class="mt-4" v-model="tab" bg-color="secondary" dark next-icon="mdi-arrow-right-bold-box-outline" prev-icon="mdi-arrow-left-bold-box-outline" show-arrows>
            <v-tab key="incomes">{{ $t('Incomes') }}</v-tab>
            <v-tab key="expenses">{{ $t('Expenses') }}</v-tab>
            <v-tab key="dividends">{{ $t('Dividends') }}</v-tab>
            <v-tab key="gains">{{ $t('Gains') }}</v-tab>
            <v-tab key="fast_operations">{{ $t('Fast operations') }}</v-tab>
        </v-tabs>
        <v-window v-model="tab">
            <v-window-item key="incomes">        
                <v-card class="pa-4">
                    <TableAccountOperations :items="incomes" showtotal hideactions showaccount height="600" class=" flex-grow-1 flex-shrink-0" :key="key" />
                </v-card>
            </v-window-item>
            <v-window-item key="expenses">       
                <v-card class="pa-4">
                    <TableAccountOperations :items="expenses" showtotal hideactions showaccount height="600" class=" flex-grow-1 flex-shrink-0" :key="key" />
                </v-card>
            </v-window-item>
            <v-window-item key="dividends">     
                <v-card class="pa-4">
                    <TableDividends :items="dividends" showinvestment height="600" :key="key" />
                </v-card>
            </v-window-item>
            <v-window-item key="gains">       
                <v-card class="pa-4">
                    <TableInvestmentOperationsHistorical :items="gains" height="600" output="user" :key="key" showtotal showinvestment/>
                    <p class="bold my-4" style="text-align:center" v-html='$t("Final gains = Gains + Fast operations gains= [0] + [1] = [2]").format(
                        localcurrency_html(listobjects_sum(gains,"gains_net_user")),
                        localcurrency_html(listobjects_sum(fast_operations,"amount")),
                        localcurrency_html(listobjects_sum(gains,"gains_net_user") +listobjects_sum(fast_operations,"amount"))
                    )'></p>

                </v-card>
            </v-window-item>
            <v-window-item key="fast_operations">       
                <v-card class="pa-4">
                    <TableAccountOperations :items="fast_operations" showtotal hideactions showaccount height="600" class=" flex-grow-1 flex-shrink-0" :key="key" />
                </v-card>
            </v-window-item>
        </v-window> 
    </div>  
</template>
<script>
    import axios from 'axios'
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
                fast_operations:[],
                key:0,
                tab:3,
            }  
        },
        watch:{
        },
        methods: {
            refreshTable(){
                this.loading=true
                axios.get(`${this.store().apiroot}/reports/annual/income/details/${this.year}/${this.month}/`, this.myheaders())
                .then((response) => {
                    this.expenses=response.data.expenses
                    this.gains=response.data.gains
                    this.incomes=response.data.incomes
                    this.dividends=response.data.dividends
                    this.fast_operations=response.data.fast_operations
                    this.key=this.key+1
                    this.loading=false
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

