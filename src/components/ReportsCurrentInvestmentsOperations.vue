<template>
    <div class="pa-4">
        <h1 class="mb-3">{{ $t("Current investments operations list") }}</h1>
        <TableInvestmentOperationsCurrent showinvestment showtotal height="80vh" :items="list_io_current" output="user" :key="key" />
                           
    </div>
</template>

<script>
    import axios from 'axios'
    import TableInvestmentOperationsCurrent from './TableInvestmentOperationsCurrent.vue'
    export default {
        components:{
            TableInvestmentOperationsCurrent,
        },
        data(){ 
            return{
                list_io_current: [],
                key: 0,
                loading:false,
            }
        },
        watch:{
        },
        methods:{
            refreshTable(){
                this.loading=true
                axios.get(`${this.store().apiroot}/reports/investmentsoperations/current/` , this.myheaders())
                .then( (response)=> {
                    this.list_io_current=response.data;
                    this.key=this.key+1;
                    this.loading=false
                }) 
                .catch((error) => {
                    this.parseResponseError(error)
                });
            }
        },
        mounted(){
            this.refreshTable()
        }
    }
</script>
