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
                    <v-window-item key="product">
                         <ChartPie ref="chart1" name="ChartPie" :items="items" :key="key"/>
                    </v-window-item>
                    <v-window-item key="pci" style="height:600px;">
                        <ChartPie ref="chart2" name="ChartPie" :items="items2" :key="key"/>
                    </v-window-item>

                </v-window>
        </div>
    </div>
</template>

<script>
    import ChartPie from './ChartPie.vue';
    export default {
        name: 'About',
        components:{
            ChartPie
        },
        watch:{
            tab(){
                this.key+=1
                // if (val==0) this.$refs.chart1.update()
                // if (val==1) this.$refs.chart2.update()
            }
        },
        data(){
            return {
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
