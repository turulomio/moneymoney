<template>
    <div v-show="this.$store.state.logged">
        <div class="login">
            <h1>{{ $t("Statistics") }}</h1>
            <v-card>
            <chart-pie :name="$t('Vip Contacts registers')" :items="items" height="600px" :key="key"></chart-pie>
            </v-card>
        </div>
    </div>
</template>

<script>
    import ChartPie from './ChartPie.vue'
    import axios from "axios"
    export default {
        name: 'Statistics',
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
                axios.get(`${this.$store.state.apiroot}/api/statistics/`, this.myheaders())
                .then((response) => {
                    this.parseResponse(response)
                    this.items=response.data 
                }, (error) => {
                    this.parseResponseError(error)
                })
                .finally(() => (this.isLoading = false));
            }
        },
        mounted(){
            this.getStatistics()
        }
    }
</script>
<style>
.login{
    padding:30px;
}
</style>
