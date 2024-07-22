<template>
    <div ref="div" class="ma-4">
        <div class="d-flex flex-row">
            <div ref="pieChart" :style="`width:100%; height:${height}px;`"></div>            
            <div ref="table" v-if="new_show_data" class="d-flex">
                <v-data-table density="compact" :headers="tableHeaders"  :items="items"  :sort-by="[{key:'value',order:'desc'}]" :items-per-page="10000">
                    <template #item.percentage="{item}">
                        <div class="text-right">{{ getPercentage(item) }}</div>
                    </template>
                    <template #item.value="{item}">
                        <div class="text-right">{{ item.value }}</div>
                    </template>
                    <template #tbody>
                        <tr class="totalrow">
                            <td>{{ $t("Total") }}</td>
                            <td class="text-right">{{total}}</td>
                            <td class="text-right">100 %</td>
                        </tr>
                    </template>
                    <template #bottom ></template>   
                </v-data-table>
            </div>
        </div>
        <div class="d-flex justify-center">
            <v-btn  color="primary" @click="buttonClick">{{buttontext}}</v-btn>
        </div>
    </div>
</template>

<script>
    import * as echarts from 'echarts';
    export default {
        props: {
            name: {
                required: true,
            },
            items: { // An array of objects [{name: "nombre", value: 1},...]
                required: true
            },
            height: {
                type: Number,
                required: false,
                default:600
            },
            show_data:{
                type: Boolean,
                required:false,
                default:false,
            },
            hidden:{ //Hide using visibility==hidden it will take up space
                type: Boolean,
                required:false,
                default:false,
            }
        },
        data: function () {
            return {
                chart:null,
                new_show_data: this.show_data, //To avoid prop mutation
                key:0,
                finished:false,
                tableHeaders: [
                    { title: 'Name', key: 'name',sortable: true },
                    { title: 'Value', key: 'value',sortable: true, align: 'end'},
                    { title: 'Percentage', key: 'percentage',sortable: false, align: 'end'},
                ],   
            }
        },
        computed:{
            options: function(){
                return {
                    tooltip: {
                        trigger: "item",
                        formatter: (params) => {
                            return `${params.marker} ${params.data.name}: ${params.data.value} (${this.getPercentage(params.data)})`;
                        },
                    },
                    series: [
                        {
                            name: this.name,
                            type: "pie",
                            radius: "80%",
                            center: ["50%", "50%"],
                            data: this.items,
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: "rgba(0, 0, 0, 0.5)"
                                }
                            }
                        }
                    ]
                }
            },
            buttontext: function(){
                if (this.new_show_data){
                    return this.$t("Hide table data")
                } else {
                    return this.$t("Show table data")
                }
            },
            total: function(){
                return this.items.reduce((accum,item) => accum + item.value, 0)
            },

        },
        methods: {
            buttonClick(){
                this.new_show_data=!this.new_show_data
                if (this.new_show_data){
                    this.$refs.pieChart.style.width="70%"
                    if (this.$refs.table) this.$refs.table.style.width="30%"
                } else {

                    this.$refs.pieChart.style.width="100%"
                    if (this.$refs.table) this.$refs.table.style.width="0%"
                }
                this.chart.resize()
            },
            getPercentage(item){
                return `${(item.value/this.total*100).toFixed(2)} %`
                
            },
            on_finished(){
                this.finished=true
                console.log(`Chart ${this.name} has finished`)
            },

            async downloadChart() {
                while (!this.finished) {
                    await new Promise(resolve => setTimeout(resolve, 100)); // Check every 100ms
                }
                return this.chart.getDataURL({ pixelRatio: 6, backgroundColor: '#fff' });
            },
        },
        mounted(){
            if (this.hidden){
                console.log(`Chart ${this.name} has been hidden`)
                this.$refs.div.style.visibility="hidden"
            } 
            this.chart = echarts.init(this.$refs.pieChart);
            this.chart.on('finished', this.on_finished);
            this.chart.setOption(this.options)

        }
    }
</script>
