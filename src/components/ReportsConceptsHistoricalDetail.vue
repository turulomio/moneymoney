
<template>
    <div>    
        <h1>{{ title }}</h1>
        <v-card outlined class="ma-4 pa-4">
            <p class="bold">{{ $t("Account operations") }}</p>
            <TableAccountOperations showaccount showtotal :items="data.ao" height="250" class="flex-grow-1 flex-shrink-0" :key="'AO'+key" @cruded="on_TableAccountsoperations_cruded"/>
            <p class="mt-4 bold">{{ $t("Credit card operations") }}</p>
            <TableCreditcardsOperations showcc showtotal :items="data.cco" height="250" class=" flex-grow-1 flex-shrink-0" :key="'CC'+key" @cruded="on_TableAccountsoperations_cruded"/>
            <p class="mt-4 bold" v-html="total"></p>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import TableAccountOperations from './TableAccountOperations.vue'
    import TableCreditcardsOperations from './TableCreditcardsOperations.vue'
    export default {
        components:{
            TableAccountOperations,
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
                data:[],
                key:0,
            }
        },
        computed:{
            title: function(){
                var concept=this.$store.getters.getObjectByUrl("concepts",this.concept)
                if (this.month==null){
                    return this.$t("'{0}' operations at year {1}").format(concept.localname,this.year)
                } else {
                    return this.$t("'{0}' operations at {1}-{2}").format(concept.localname,this.year,this.month)
                }

            },
            total: function(){
                return this.$t("Total: {0}").format(this.localcurrency_html(this.listobjects_sum(this.data.ao,"amount")+this.listobjects_sum(this.data.cco,"amount")))
            }
        },
        methods: {
            on_TableAccountsoperations_cruded(){
                this.update_table()
            },
            on_button_click(){
                this.update_table()
            },
            update_table(){
                axios.get(`${this.concept}historical_report_detail/?year=${this.year}&month=${this.month}` , this.myheaders())
                .then( (response)=> {
                    this.data=response.data.data
                    this.key=this.key+1
                }) 
                .catch((error) => {
                    this.parseResponseError(error)
                });
            },
        },
        mounted(){
            this.update_table()
        }
    }
</script>
