<template>
    <div>
        <h1>{{ $t("Assets Report") }}</h1>
        <div class="d-flex justify-center mb-4" width="20%">                
            <v-card width="20%" class="pa-4">      
    
                <v-select class="pa-4" density="compact" label="Select a format" v-model="format" :items="['pdf','odt','docx']"></v-select>       
                <v-alert density="compact" class=" px-10" outlined :type="(unogenerator_working) ? 'success':'error'"> {{ (unogenerator_working) ? $t("UnoGenerator is ready"): $t("UnoGenerator is not working. Please contact system administrator")}}</v-alert>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="pa-4" :loading="loading" color="primary" :disabled="!can_launch" @click="launch_report">{{ (can_launch)?  $t("Generate report"): $t("Report is being prepared. Please be patient...") }}</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>

            </v-card>
        </div>
        <div v-if="data">
            <ChartEvolutionAssets hidden v-if="unogenerator_working" reference="chart_assets" @finished="on_chart_finished" />
            <ChartPie name="Investments by product" hidden :items="echart_products_items" reference="chart_pie_product" :heigth="height" :show_data="false" @finished="on_chart_finished" />
            <ChartPie name="Investments by pci" hidden :items="echart_pci_items" reference="chart_pie_pci" :heigth="height" :show_data="false" @finished="on_chart_finished"/>
            <ChartPie name="Investments by variable percentage" hidden :items="echart_percentage_items" reference="chart_pie_percentage" :heigth="height" :show_data="false" @finished="on_chart_finished"/>
            <ChartPie name="Investments by product type" hidden :items="echart_producttype_items" reference="chart_pie_producttype" :heigth="height" :show_data="false" @finished="on_chart_finished"/>
            <ChartPie name="Investments by leverage" hidden :items="echart_leverage_items" reference="chart_pie_leverage" :heigth="height" :show_data="false" @finished="on_chart_finished"/>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { useStore } from "@/store"
    import ChartEvolutionAssets from './ChartEvolutionAssets.vue'
    import ChartPie from './ChartPie.vue'
    import { my_round } from 'vuetify_rules'
    export default {
        components:{
            ChartPie,
            ChartEvolutionAssets,
        },
        data(){
            return {
                loading:false,
                data:null,
                key:0,
                height:100,

                format:"pdf",
                unogenerator_working:false,
                method:"Current",

                payload:{
                    format: "pdf",
                    chart_pie_product: null,
                    chart_pie_pci: null,
                    chart_pie_percentage: null,
                    chart_pie_producttype: null,
                    chart_pie_leverage: null,
                    chart_assets: null,
                }
            }
        },       
        watch:{
            format(){
                this.payload.format=this.format
            }
        },
        computed:{
            /// COPIED FROM REPORTSINVESTMENTSCLASSES
            echart_products_items: function(){
                var products= this.data.by_product
                var adapted
                if (this.method=="Current"){
                    adapted= products.map(el => ({name: el.name, value: this.my_round(el.balance, 2)}))
                } else {//Invested
                    adapted= products.map(el => ({name: el.name, value: this.my_round(el.invested,2)}))
                }
                adapted=adapted.filter(o => o.value!=0)
                return adapted
            },
            echart_pci_items: function(){
                var products= this.data.by_pci
                var adapted
                if (this.method=="Current"){
                    adapted= products.map(el => ({name: el.name, value: this.my_round(el.balance, 2)}))
                } else {//Invested
                    adapted= products.map(el => ({name: el.name, value: this.my_round(el.invested,2)}))
                }
                adapted=adapted.filter(o => o.value!=0)
                return adapted
            },
            echart_percentage_items: function(){
                var products= this.data.by_percentage
                var adapted

                if (this.method=="Current"){
                    adapted= products.map(el => ({name: el.name, value: this.my_round(el.balance, 2)}))
                } else {//Invested
                    adapted= products.map(el => ({name: el.name, value: this.my_round(el.invested,2)}))
                }
                adapted=adapted.filter(o => o.value!=0)
                return adapted
            },
            echart_producttype_items: function(){
                var products= this.data.by_producttype
                var adapted
                if (this.method=="Current"){
                    adapted= products.map(el => ({name: el.name, value: this.my_round(el.balance, 2)}))
                } else {//Invested
                    adapted= products.map(el => ({name: el.name, value: this.my_round(el.invested,2)}))
                }
                adapted=adapted.filter(o => o.value!=0)
                return adapted
            },
            echart_leverage_items: function(){
                var products= this.data.by_leverage
                var adapted
                if (this.method=="Current"){
                    adapted= products.map(el => ({name: el.name, value: this.my_round(el.balance, 2)}))
                } else {//Invested
                    adapted= products.map(el => ({name: el.name, value: this.my_round(el.invested,2)}))
                }
                adapted=adapted.filter(o => o.value!=0)
                return adapted
            },
            can_launch(){
                for (let key in this.payload) {
                    if (this.payload[key]==null) return false
                }
                return true
            },
        },
        methods:{
            useStore,
            my_round,
            launch_report(){
                this.loading=true

                axios.post(`${this.useStore().apiroot}/assets/report/`, this.payload, this.myheaders())
                .then((response) => {
                    this.loading=false      
                    var link = window.document.createElement('a');

                    link.href = `data:${response.data.mime};base64,${response.data.data}`
                    link.download = response.data.filename
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }, (error) => {
                    this.parseResponseError(error)
                });
            },

            update_pies(){
                this.loading=true
                axios.get(`${this.useStore().apiroot}/investments/classes/`, this.myheaders())
                .then((response) => {
                    this.data=response.data
                    this.loading=false
                    this.key=this.key+1
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            check_unogenerator_server(){
                axios.get(`${this.useStore().apiroot}/unogenerator/working/`, this.myheaders())
                .then((response) => {
                    this.unogenerator_working=response.data
                    this.key=this.key+1
                }, (error) => {
                    this.unogenerator_working=false
                    this.parseResponseError(error)
                });

            },
            on_chart_finished(reference,image){
                this.payload[reference]=image
        },
    },
    created(){
        this.loading=true
        this.check_unogenerator_server()
        this.update_pies()
    }
}
</script>