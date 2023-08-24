<template>
    <div>
        <h1>{{ $t("Derivatives report") }}
        <MyMenuInline :items="menuinline_items"  :context="this"></MyMenuInline>  </h1>

        <div class="pa-6" v-if="items && coverage_items">
            <v-tabs  bg-color="secondary" dark v-model="tab" grow>
                <v-tab key="evolution">{{ $t("Evolution") }}</v-tab>
                <v-tab key="coverage">{{ $t("Fast operations coverage") }}</v-tab>
                <v-tab key="balance">{{ $t("Balance") }}</v-tab>
            </v-tabs>
            <v-window v-model="tab">
                <v-window-item key="evolution">    
                    <p class="boldcenter my-4">{{$t("This report sums the following accounts operations: 'Derivatives. Daily adjustment', 'Derivatives. Operation commission', 'Derivatives. Swaps' and 'Fast investment operations'")}}</p>
                    <v-card class="pa-4" outlined >
                        <v-data-table density="compact" :headers="derivatives_headers" :items="items.derivatives" class="elevation-1"  fixed-header :loading="loading"    :items-per-page="10000" >
                            <template #item.m1="{item}"><div class="text-right" v-html="localcurrency_html(item.raw.m1 )"></div></template>  
                            <template #item.m2="{item}"><div class="text-right" v-html="localcurrency_html(item.raw.m2 )"></div></template>  
                            <template #item.m3="{item}"><div class="text-right" v-html="localcurrency_html(item.raw.m3 )"></div></template>  
                            <template #item.m4="{item}"><div class="text-right" v-html="localcurrency_html(item.raw.m4 )"></div></template>  
                            <template #item.m5="{item}"><div class="text-right" v-html="localcurrency_html(item.raw.m5 )"></div></template>  
                            <template #item.m6="{item}"><div class="text-right" v-html="localcurrency_html(item.raw.m6 )"></div></template>  
                            <template #item.m7="{item}"><div class="text-right" v-html="localcurrency_html(item.raw.m7 )"></div></template>  
                            <template #item.m8="{item}"><div class="text-right" v-html="localcurrency_html(item.raw.m8 )"></div></template>  
                            <template #item.m9="{item}"><div class="text-right" v-html="localcurrency_html(item.raw.m9 )"></div></template>  
                            <template #item.m10="{item}"><div class="text-right" v-html="localcurrency_html(item.raw.m10 )"></div></template>  
                            <template #item.m11="{item}"><div class="text-right" v-html="localcurrency_html(item.raw.m11 )"></div></template>  
                            <template #item.m12="{item}"><div class="text-right" v-html="localcurrency_html(item.raw.m12 )"></div></template> 
                            <template #item.total="{item}"><div class="text-right" v-html="localcurrency_html(item.raw.total )"></div></template>  
                <template #bottom ></template>   
                        </v-data-table>   
                    </v-card>
                    <p class="boldcenter my-4" v-html="$t('Total derivatives: [0]').format(localcurrency_html(listobjects_sum(items.derivatives,'total')))"></p>
                </v-window-item>                
                <v-window-item key="coverage">    
                    <MyMonthPicker v-model="ym" />
                    <v-card class="pa-4" outlined >
                        <TableFastOperationsCoverage density="compact" :items="coverage_items" @cruded="on_TableFastOperationsCoverage_cruded" />
                    </v-card>
                </v-window-item>                
                <v-window-item key="balance">    
                    <p class="boldcenter my-4">{{$t("This report sums the following accounts operations: 'Derivatives. Daily adjustment', 'Derivatives. Operation commission', 'Derivatives. Swaps', 'Fast investment operations' and 'Fast investment operations coverage'")}}</p>
                    <v-card class="pa-4" outlined >
                        <v-data-table density="compact" :headers="derivatives_headers" :items="items.balance" class="elevation-1"  fixed-header :loading="loading"    :items-per-page="10000" >
                            <template #item.m1="{item}"><div class="text-right" v-html="localcurrency_html(item.raw.m1 )"></div></template>  
                            <template #item.m2="{item}"><div class="text-right" v-html="localcurrency_html(item.raw.m2 )"></div></template>  
                            <template #item.m3="{item}"><div class="text-right" v-html="localcurrency_html(item.raw.m3 )"></div></template>  
                            <template #item.m4="{item}"><div class="text-right" v-html="localcurrency_html(item.raw.m4 )"></div></template>  
                            <template #item.m5="{item}"><div class="text-right" v-html="localcurrency_html(item.raw.m5 )"></div></template>  
                            <template #item.m6="{item}"><div class="text-right" v-html="localcurrency_html(item.raw.m6 )"></div></template>  
                            <template #item.m7="{item}"><div class="text-right" v-html="localcurrency_html(item.raw.m7 )"></div></template>  
                            <template #item.m8="{item}"><div class="text-right" v-html="localcurrency_html(item.raw.m8 )"></div></template>  
                            <template #item.m9="{item}"><div class="text-right" v-html="localcurrency_html(item.raw.m9 )"></div></template>  
                            <template #item.m10="{item}"><div class="text-right" v-html="localcurrency_html(item.raw.m10 )"></div></template>  
                            <template #item.m11="{item}"><div class="text-right" v-html="localcurrency_html(item.raw.m11 )"></div></template>  
                            <template #item.m12="{item}"><div class="text-right" v-html="localcurrency_html(item.raw.m12 )"></div></template> 
                            <template #item.total="{item}"><div class="text-right" v-html="localcurrency_html(item.raw.total )"></div></template>  
                <template #bottom ></template>   
                        </v-data-table>   
                    </v-card>
                    <p class="boldcenter my-4" v-html="$t('Total balance: [0]').format(localcurrency_html(listobjects_sum(items.balance,'total')))"></p>
                </v-window-item>
            </v-window>     
        </div>
        <!-- DIALOG FAST OPERATIONS COVERAGE CU  -->
        <v-dialog v-model="dialog_foc" width="40%">
            <v-card class="ma-6">
                <FastOperationsCoverageCU :foc="foc" mode="C" @cruded="on_FastOperationsCoverageCU_cruded" :key="key" />
            </v-card>
        </v-dialog>
    </div>
</template>
<script>     
    import axios from 'axios'
    import FastOperationsCoverageCU from './FastOperationsCoverageCU.vue'
    import MyMenuInline from './MyMenuInline.vue'
    import MyMonthPicker from './MyMonthPicker.vue'
    import TableFastOperationsCoverage from './TableFastOperationsCoverage.vue'
    import {empty_fast_operations_coverage} from '../empty_objects.js'
    export default {
        components:{
            MyMonthPicker,
            TableFastOperationsCoverage,
            FastOperationsCoverageCU,
            MyMenuInline,
        },
        data(){
            return {
                tab:2,
                items: null,
                derivatives_headers: [
                    { title: this.$t('Year'), key: 'year', sortable: true },
                    { title: this.$t('January'), key: 'm1', sortable: true,align:'end' },
                    { title: this.$t('February'), key: 'm2', sortable: true, align:'end' },
                    { title: this.$t('March'), key: 'm3', sortable: true, align:'end' },
                    { title: this.$t('April'), key: 'm4', sortable: true, align:'end' },
                    { title: this.$t('May'), key: 'm5', sortable: true, align:'end' },
                    { title: this.$t('June'), key: 'm6', sortable: true, align:'end' },
                    { title: this.$t('July'), key: 'm7', sortable: true, align:'end' },
                    { title: this.$t('August'), key: 'm8', sortable: true, align:'end' },
                    { title: this.$t('September'), key: 'm9', sortable: true, align:'end' },
                    { title: this.$t('October'), key: 'm10', sortable: true, align:'end' },
                    { title: this.$t('November'), key: 'm11', sortable: true, align:'end' },
                    { title: this.$t('December'), key: 'm12', sortable: true, align:'end' },
                    { title: this.$t('Total'), key: 'total', sortable: true,align:'end' },
                ],
                loading: false,

                //Coverage                
                ym:{year:new Date().getFullYear(), month: new Date().getMonth()+1},
                coverage_items:null,                
                menuinline_items: [
                    { subheader:this.$t('Fast operations coverage orders'), children: [
                            { 
                                name:this.$t('Add an fast operations coverage'), 
                                code: function(){
                                    this.foc=this.empty_fast_operations_coverage()
                                    this.key=this.key+1
                                    this.dialog_foc=true
                                }.bind(this),
                                icon: "mdi-plus" 
                            },
                        ]
                    },
                ],

                //Dialog FOCCU
                dialog_foc:false,
                foc:null,

            }
        },
        computed:{
        },
        watch:{
            ym () {
                this.refreshTables()
            },
        },
        methods:{
            empty_fast_operations_coverage,
            refreshTables(){
                this.loading=true

                axios.all([
                    axios.get(`${this.store().apiroot}/derivatives/`, this.myheaders()),
                    axios.get(`${this.store().apiroot}/api/fastoperationscoverage/?year=${this.ym.year}&month=${this.ym.month}`, this.myheaders())
                ])
                .then(([resDerivatives, resFOC]) => {
                    this.items=resDerivatives.data
                    this.coverage_items=resFOC.data
                    this.loading=false

                })
            },
            on_TableFastOperationsCoverage_cruded(){
                this.refreshTables()

            },
            on_FastOperationsCoverageCU_cruded(){
                this.dialog_foc=false
                this.refreshTables()
            }
        },
        created(){
            this.refreshTables()

        }
    }
</script>
