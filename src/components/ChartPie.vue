<template>
    <div class="ma-4">
        <p v-if="items.length==0">No data to show</p>
        <v-card v-if="items.length>0">
            <v-row :style="styleheight()">
                <v-col>
                    <v-chart ref="chart" autoresize :option="options" :key="key" @finished="on_finished"/>
                </v-col>
                <v-col v-if="new_show_data" >
                    <v-data-table dense :headers="tableHeaders"  :items="items" class="elevation-1" disable-pagination  hide-default-footer :sort-by="['value']" :sort-desc="['value']">
                        <template v-slot:[`item.percentage`]="{ item }">
                            {{ getPercentage(item) }}
                        </template>
                        <template v-slot:[`body.append`]="{headers}">
                            <tr style="background-color: lightgrey">
                                <td v-for="(header,i) in headers" :key="i">
                                    <div v-if="header.value == 'name'" >
                                        Total
                                    </div>
                                    <div v-if="header.value == 'value'"  class="d-flex justify-end">
                                        {{total}}
                                    </div>
                                    <div v-if="header.value == 'percentage'" class="d-flex justify-end">
                                        100 %
                                    </div>
                                </td>
                            </tr>
                        </template>
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
                    { text: 'Name', value: 'name',sortable: true },
                    { text: 'Value', value: 'value',sortable: true, align: 'right'},
                    { text: 'Percentage', value: 'percentage',sortable: false, align: 'right'},
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
                    var data=this.$refs.chart.getDataURL({pixelRatio: 6, backgroundColor: '#fff'}).replace('data:image/png;base64,','')
                    axios.post(`${this.$store.state.apiroot}/binary/to/global/`, {global:this.save_name,data:data,}, this.myheaders())
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
