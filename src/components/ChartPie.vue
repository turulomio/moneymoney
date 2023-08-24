<template>
    <div class="ma-4">
        <p v-if="items.length==0">No data to show</p>
        <v-card v-if="items.length>0">
            <v-row :style="styleheight()">
                <v-col>
                    <v-chart ref="chart" autoresize :option="options" :key="key" @finished="on_finished"/>
                </v-col>
                <v-col v-if="new_show_data" >
                    <v-data-table density="compact" :headers="tableHeaders"  :items="items" class="elevation-1" :sort-by="[{key:'value',order:'desc'}]" :items-per-page="10000" >
                        <template #item.percentage="{item}">
                            <div class="text-right">{{ getPercentage(item.raw) }}</div>
                        </template>
                        <template #item.value="{item}">
                            <div class="text-right">{{ item.raw.value }}</div>
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
                </v-col>
            </v-row>       
            <v-row>
                <v-col align="center">
                    <v-btn  color="primary" @click="buttonClick">{{buttontext}}</v-btn>
                </v-col>
            </v-row>
        </v-card>  
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        props: {
            name: {
                required: true,
            },
            items: {
                required: true
            },
            height: {
                type: Number,
                required: false,
                default:600
            },
            save_name:{
                required:false,
                default:null,
            },
            show_data:{
                type: Boolean,
                required:false,
                default:false,
            },
        },
        data: function () {
            return {
                new_show_data: this.show_data, //To avoid prop mutation
                key:0,
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
            }
        },
        methods: {
            buttonClick(){
                this.new_show_data=!this.new_show_data
                this.key=this.key+1
            },
            getPercentage(item){
                return `${(item.value/this.total*100).toFixed(2)} %`
                
            },
            on_finished(){
                if (this.save_name!=null){
                    var data=this.$refs.chart.getDataURL({pixelRatio: 6, backgroundColor: '#fff'})
                    axios.post(`${this.store().apiroot}/storefile/`, {filename:this.save_name,data:data,}, this.myheaders())
                    .then(() => {
                        this.$emit("finished")
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                }
                
            },
            styleheight: function(){
                return `height: ${this.height}px`
            },

        },
    }
</script>
