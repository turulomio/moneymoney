<template>
    <div>
       <h1 class="mb-3">{{ $t("Historical concepts report") }}</h1>
 
        <v-layout style="justify-content: center;">
            <v-card  class="pa-6">
                <v-select :label="$t('Select a concept')" v-model="selected_concept" :items="getArrayFromMap(store().concepts)" item-value="url" item-title="localname"></v-select>
            </v-card>
        </v-layout>
        <p></p>
        <v-data-table density="compact" :headers="tableHeaders" :items="tableData" class="elevation-1 ma-4" fixed-header :key="key"  height="500"    :items-per-page="10000" >        
            <template #item.m1="{item}">
                <div class="text-right" v-html="localcurrency_html(item.raw.m1)" @click="showConceptsHistoricalDetail(item.raw,1)"></div>
            </template> 
            <template #item.m2="{item}">
                <div class="text-right" v-html="localcurrency_html(item.raw.m2)" @click="showConceptsHistoricalDetail(item.raw,2)"></div>
            </template> 
            <template #item.m3="{item}">
                <div class="text-right" v-html="localcurrency_html(item.raw.m3)" @click="showConceptsHistoricalDetail(item.raw,3)"></div>
            </template> 
            <template #item.m4="{item}">
                <div class="text-right" v-html="localcurrency_html(item.raw.m4)" @click="showConceptsHistoricalDetail(item.raw,4)"></div>
            </template> 
            <template #item.m5="{item}">
                <div class="text-right" v-html="localcurrency_html(item.raw.m5)" @click="showConceptsHistoricalDetail(item.raw,5)"></div>
            </template> 
            <template #item.m6="{item}">
                <div class="text-right" v-html="localcurrency_html(item.raw.m6)" @click="showConceptsHistoricalDetail(item.raw,6)"></div>
            </template> 
            <template #item.m7="{item}">
                <div class="text-right" v-html="localcurrency_html(item.raw.m7)" @click="showConceptsHistoricalDetail(item.raw,7)"></div>
            </template> 
            <template #item.m8="{item}">
                <div class="text-right" v-html="localcurrency_html(item.raw.m8)" @click="showConceptsHistoricalDetail(item.raw,8)"></div>
            </template> 
            <template #item.m9="{item}">
                <div class="text-right" v-html="localcurrency_html(item.raw.m9)" @click="showConceptsHistoricalDetail(item.raw,9)"></div>
            </template> 
            <template #item.m10="{item}">
                <div class="text-right" v-html="localcurrency_html(item.raw.m10)" @click="showConceptsHistoricalDetail(item.raw,10)"></div>
            </template> 
            <template #item.m11="{item}">
                <div class="text-right" v-html="localcurrency_html(item.raw.m11)" @click="showConceptsHistoricalDetail(item.raw,11)"></div>
            </template> 
            <template #item.m12="{item}">
                <div class="text-right" v-html="localcurrency_html(item.raw.m12)" @click="showConceptsHistoricalDetail(item.raw,12)"></div>
            </template> 
            <template #item.total="{item}">
                <div class="text-right" v-html="localcurrency_html(item.raw.total)" @click="showConceptsHistoricalDetail(item.raw)"></div>
            </template> 
                <template #bottom ></template>   
        </v-data-table>

        <!-- VIEW HISTORICAL REPORT DETAIL dialog -->
        <v-dialog v-model="dialog_historical_concepts_detail">
            <v-card class="pa-4">
                <ReportsConceptsHistoricalDetail :concept="concept" :year="year" :month="month" :key="key" />
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import axios from 'axios'
    import ReportsConceptsHistoricalDetail from './ReportsConceptsHistoricalDetail.vue'
    export default {
        name:"ReportsConceptsHistorical",
        components:{
            ReportsConceptsHistoricalDetail,
        },
        props:{
            concept:{
                required:false,
                default:null,
            }
        },
        watch:{
            selected_concept: function(){
                this.refreshTable()
            }
        },
        data(){ 
            return{
                tableHeaders: [
                    { title: this.$t('Year'), key: 'year', sortable: true},
                    { title: this.$t('January'), key: 'm1', sortable: true, align:'end'},
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
                    { title: this.$t('Total'), key: 'total', sortable: true, align:'end' },
                ],   
                tableData: [],
                total:0,
                median:0,
                average:0,
                key: 0,
                selected_concept:null,
                loading:false,

                //Historical concept detail
                dialog_historical_concepts_detail:false,
                year:null,
                month:null,
            }
        },
        methods:{
            refreshTable(){
                this.loading=true
                axios.get(`${this.selected_concept}historical_report/`, this.myheaders())
                .then( (response)=> {
                    this.tableData=response.data.data
                    this.total=response.data.total
                    this.median=response.data.median
                    this.average=response.data.average
                    this.key=this.key+1
                    this.loading=false
                }) 
                .catch((error) => {
                    this.parseResponseError(error)
                });
            },
            showConceptsHistoricalDetail(item,month=null){
                this.year=item.year
                this.month=month
                this.key=this.key+1
                this.dialog_historical_concepts_detail=true
            }
        },
        created(){
            this.selected_concept=this.concept
            this.refreshTable()
        }
    }
</script>
