<template>
    <div v-show="this.useStore().logged">
        <h1>{{ $t("Statistics") }}</h1>
        <chart-pie :name="$t('Money Money registers')" :items="items" :key="key"></chart-pie>
    </div>
</template>

<script>
    import ChartPie from './ChartPie.vue'
    import axios from "axios"
    import { useStore  } from '@/store'

    export default {
        components: {
            ChartPie},
        data () {
            return {
                items:[],
                key:0}
        },
        methods: {
            useStore,



            async getStatistics(){
                const response = await axios.get(`${this.useStore().apiroot}/statistics/`)
                this.items=response.data
                this.key=this.key+1
            }

        },
        mounted(){
            this.getStatistics()
        }
    }
</script>
