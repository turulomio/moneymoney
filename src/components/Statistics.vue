<template>
    <div v-show="this.store().logged">
        <h1>{{ $t("Statistics") }}</h1>
        <chart-pie :name="$t('Money Money registers')" :items="items" :key="key"></chart-pie>
    </div>
</template>

<script>
    import ChartPie from './ChartPie.vue'
    import axios from "axios"
    export default {
        components: {
            ChartPie,
        },
        data () {
            return {
                items:[],
                key:0,
            }
        },
        methods: {
            getStatistics(){
                axios.get(`${this.store().apiroot}/statistics/`, this.myheaders())
                .then((response) => {
                    this.parseResponse(response)
                    this.items=response.data 
                    this.key=this.key+1
                }, (error) => {
                    this.parseResponseError(error)
                })
            }
        },
        mounted(){
            this.getStatistics()
        }
    }
</script>
