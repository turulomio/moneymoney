<template>
    <div>
       <h1 class="mb-3">{{ $t("Historical concepts report") }}</h1>
 
        <v-layout style="justify-content: center;">
            <v-card  class="pa-6">
                <v-select :label="$t('Select a concept')" v-model="selected_concept" :items="$store.state.concepts" item-value="url" item-text="name"></v-select>
            </v-card>
        </v-layout>
        <p></p>
        <v-data-table dense :headers="tableHeaders" :items="tableData" class="elevation-1 ma-4" disable-pagination  hide-default-footer fixed-header :key="key"  height="500">        
            <template v-slot:[`item.m1`]="{ item }">
                <div v-html="localcurrency_html(item.m1)" @click="showConceptsHistoricalDetail(item,1)"></div>
            </template> 
            <template v-slot:[`item.m2`]="{ item }">
                <div v-html="localcurrency_html(item.m2)" @click="showConceptsHistoricalDetail(item,2)"></div>
            </template> 
            <template v-slot:[`item.m3`]="{ item }">
                <div v-html="localcurrency_html(item.m3)" @click="showConceptsHistoricalDetail(item,3)"></div>
            </template> 
            <template v-slot:[`item.m4`]="{ item }">
                <div v-html="localcurrency_html(item.m4)" @click="showConceptsHistoricalDetail(item,4)"></div>
            </template> 
            <template v-slot:[`item.m5`]="{ item }">
                <div v-html="localcurrency_html(item.m5)" @click="showConceptsHistoricalDetail(item,5)"></div>
            </template> 
            <template v-slot:[`item.m6`]="{ item }">
                <div v-html="localcurrency_html(item.m6)" @click="showConceptsHistoricalDetail(item,6)"></div>
            </template> 
            <template v-slot:[`item.m7`]="{ item }">
                <div v-html="localcurrency_html(item.m7)" @click="showConceptsHistoricalDetail(item,7)"></div>
            </template> 
            <template v-slot:[`item.m8`]="{ item }">
                <div v-html="localcurrency_html(item.m8)" @click="showConceptsHistoricalDetail(item,8)"></div>
            </template> 
            <template v-slot:[`item.m9`]="{ item }">
                <div v-html="localcurrency_html(item.m9)" @click="showConceptsHistoricalDetail(item,9)"></div>
            </template> 
            <template v-slot:[`item.m10`]="{ item }">
                <div v-html="localcurrency_html(item.m10)" @click="showConceptsHistoricalDetail(item,10)"></div>
            </template> 
            <template v-slot:[`item.m11`]="{ item }">
                <div v-html="localcurrency_html(item.m11)" @click="showConceptsHistoricalDetail(item,11)"></div>
            </template> 
            <template v-slot:[`item.m12`]="{ item }">
                <div v-html="localcurrency_html(item.m12)" @click="showConceptsHistoricalDetail(item,12)"></div>
            </template> 
            <template v-slot:[`item.total`]="{ item }">
                <div v-html="localcurrency_html(item.total)" @click="showConceptsHistoricalDetail(item)"></div>
            </template> 
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
                console.log(this.selected_concept)
                this.refreshTable()
            }
        },
        data(){ 
            return{
                tableHeaders: [
                    { text: this.$t('Year'), value: 'year', sortable: true},
                    { text: this.$t('January'), value: 'm1', sortable: true, align:"right"},
                    { text: this.$t('February'), value: 'm2', sortable: true, align:"right" },
                    { text: this.$t('March'), value: 'm3', sortable: true, align:"right" },
                    { text: this.$t('April'), value: 'm4', sortable: true, align:"right" },
                    { text: this.$t('May'), value: 'm5', sortable: true, align:"right" },
                    { text: this.$t('June'), value: 'm6', sortable: true, align:"right" },
                    { text: this.$t('July'), value: 'm7', sortable: true, align:"right" },
                    { text: this.$t('August'), value: 'm8', sortable: true, align:"right" },
                    { text: this.$t('September'), value: 'm9', sortable: true, align:"right" },
                    { text: this.$t('October'), value: 'm10', sortable: true, align:"right" },
                    { text: this.$t('November'), value: 'm11', sortable: true, align:"right" },
                    { text: this.$t('December'), value: 'm12', sortable: true, align:"right" },
                    { text: this.$t('Total'), value: 'total', sortable: true, align:"right" },
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
                    this.tableData=response.data.data;
                    this.total=response.data.total
                    this.median=response.data.median
                    this.average=response.data.average
                    console.log(this.tableData)
                    this.key=this.key+1;
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
