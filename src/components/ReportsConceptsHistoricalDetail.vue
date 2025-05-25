
<template>
    <div>    
        <h1>{{ title }}</h1>
        <v-card outlined class="ma-4 pa-4">
            <p class="bold">{{ $t("Accounts operations") }}</p>
            <TableAccountOperations showaccount showtotal :items="data.ao" height="250" class="flex-grow-1 flex-shrink-0" :key="'AO'+key" @cruded="on_TableAccountsoperations_cruded"/>
            <p class="mt-4 bold">{{ $t("Credit cards operations") }}</p>
            <TableCreditcardsOperations showcc showtotal :items="data.cco" height="250" class=" flex-grow-1 flex-shrink-0" :key="'CC'+key" @cruded="on_TableAccountsoperations_cruded"/>
            <p class="mt-4 bold"  v-html="total"></p>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import { useStore } from "@/store"
    import { defineAsyncComponent } from 'vue'
    import {f} from 'vuetify_rules'
    import TableCreditcardsOperations from './TableCreditcardsOperations.vue'
    import { parseResponseError, listobjects_sum, localcurrency_html, myheaders } from '@/functions'
    export default {
        name: "ReportsConceptsHistoricalDetail",
        components:{
            "TableAccountOperations": defineAsyncComponent(() => import('./TableAccountOperations.vue')), //To remove circular dependency
            TableCreditcardsOperations,
        },
        props:{
            concept: {//url
                required: true
            },
            year: {
                type: Number,
                required: true,
            },
            month:{ //Only hides account if true
                type: Number,
                required:false,
            },
        },
        data(){ 
            return {
                data: {ao: [],cco:[]},
                key:0,
            }
        },
        computed:{
            title: function(){
                var concept_object=this.useStore().concepts.get(this.concept)
                if (this.month==null){
                    return f(this.$t("'[0]' operations at year [1]"), [concept_object.localname,this.year])
                } else {
                    return f(this.$t("'[0]' operations at [1]-[2]"), [concept_object.localname,this.year,this.month])
                }

            },
            total: function(){
                if (this.data) return f(this.$t("Total: [0]"), [this.localcurrency_html(this.listobjects_sum(this.data.ao,"amount")+this.listobjects_sum(this.data.cco,"amount"))])
                return ""
            }
        },
        methods: {
            useStore,
            f,
            parseResponseError,
            listobjects_sum,
            localcurrency_html,
            myheaders,
            on_TableAccountsoperations_cruded(){
                this.update_table()
            },
            on_button_click(){
                this.update_table()
            },
            update_table(){
                axios.get(`${this.concept}historical_report_detail/?year=${this.year}&month=${this.month}` , this.myheaders())
                .then( (response)=> {
                    this.data=response.data
                    this.key=this.key+1
                }) 
                .catch((error) => {
                    this.parseResponseError(error)
                });
            },
        },
        async created(){
            await this.update_table()
        }
    }
</script>
