<template>
    <div v-show="this.useStore().logged">
        <h1>{{ $t("Statistics") }}</h1>
        <chart-pie :name="$t('Money Money registers')" :items="items" :key="key"></chart-pie>
    </div>
</template>

<script>
    import ChartPie from './ChartPie.vue'
    import axios from "axios"
    import { useStore, parseResponse, parseResponseError, myheaders } from '@/store'

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
            useStore,
            parseResponse,
            parseResponseError,
            myheaders,
            async getStatistics(){
                try {
                    const response = await axios.get(`${this.useStore().apiroot}/statistics/`, this.myheaders())
                    if (await this.parseResponse(response)){
                        this.items=response.data
                        this.key=this.key+1
                    }
                } catch (error) {
                    await this.parseResponseError(error)
                }
            }

        },
        mounted(){
            this.getStatistics()
        }
    }
</script>
