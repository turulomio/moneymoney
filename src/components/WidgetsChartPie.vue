<template>
    <div class="paragraph">
        <h1>{{ $t("Widgets") }}</h1>
        <h2>ChartPie</h2>
        <div class="ma-5">                
            <v-tabs  bg-color="secondary" dark v-model="tab" next-icon="mdi-arrow-right-bold-box-outline" prev-icon="mdi-arrow-left-bold-box-outline" show-arrows>
                    <v-tab key="product">{{ $t("By investment product") }}</v-tab>
                    <v-tab data-test="ReportsInvestmentsClasses_TabPCI" key="pci">{{ $t("By Put / Call / Inline") }}</v-tab>

                </v-tabs>
                <v-window v-model="tab">
                    <v-window-item key="product" >
                         <ChartPie v-if="show1" ref="chart1" name="ChartPie" :items="items"/>
                    </v-window-item>
                    <v-window-item key="pci">
                        <ChartPie  v-if="show2" ref="chart2" name="ChartPie" :items="items2"/>
                    </v-window-item>

                </v-window>
        </div>
    </div>
</template>

<script>
    import ChartPie from './ChartPie.vue';
    export default { 
        components:{
            ChartPie
        },
        watch:{
            tab(val){
                if (val==0) setTimeout(() => {this.show1=true }, 300)
                if (val==1) setTimeout(() => {this.show2=true }, 300)
            },
        },
        data(){
            return {
                show1:true,
                show2:false,
                key:0,
                tab:0,
                items:[
                    {name:"First", value:1000},
                    {name:"Second", value:2000},
                    {name:"Third", value:7000},

                ],
                
                items2:[
                    {name:"First", value:1000},
                    {name:"Second", value:4000},
                    {name:"Third", value:5000},

                ]
            }
        },
    }
</script>
