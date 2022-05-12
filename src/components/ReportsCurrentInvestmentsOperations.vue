<template>
    <div>
        <h1 class="mb-3">{{ $t("Current investments operations list") }}</h1>
        <TableInvestmentOperationsCurrent :items="list_io_current" heterogeneus currency_account="EUR" currency_investment="EUR" currency_user="EUR" output="user" height="600" :key="key"></TableInvestmentOperationsCurrent>
                           
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
                axios.get(`${this.$store.state.apiroot}/reports/investmentsoperations/current/` , this.myheaders())
                .then( (response)=> {
                    console.log(response.data)
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
