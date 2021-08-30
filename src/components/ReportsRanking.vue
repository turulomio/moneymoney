<template>
    <div>    
        <h1>{{ $t('Ranking investments report') }}</h1>
        <v-card outlined class="ma-4 pa-4">
            <v-data-table dense :headers="headers" :items="data" class="elevation-1" hide-default-footer disable-pagination :loading="loading_table">
                <template v-slot:[`item.current_net_gains`]="{ item }">
                    <div v-html="localcurrency_html(item.current_net_gains )"></div>
                </template>  
                <template v-slot:[`item.historical_net_gains`]="{ item }">
                    <div v-html="localcurrency_html(item.historical_net_gains )"></div>
                </template>  
                <template v-slot:[`item.dividends`]="{ item }">
                    <div v-html="localcurrency_html(item.dividends )"></div>
                </template>  
                <template v-slot:[`item.total`]="{ item }">
                    <div v-html="localcurrency_html(item.total )"></div>
                </template>  
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small class="mr-2" @click="viewItem(item)">mdi-eye</v-icon>
                </template>    
                <template v-slot:[`body.append`]="{headers}">
                    <tr style="background-color: GhostWhite" ref="lr">
                        <td v-for="(header,i) in headers" :key="i" >
                            <div v-if="header.value == 'name'">
                                Total
                            </div>
                        
                            <div v-if="header.value == 'current_net_gains'" align="right">
                                <div v-html="localcurrency_html(listobjects_sum(data,'current_net_gains'))"></div>
                            </div>
                            <div v-if="header.value == 'historical_net_gains'" align="right">
                                <div v-html="localcurrency_html(listobjects_sum(data,'historical_net_gains'))"></div>
                            </div>
                            <div v-if="header.value == 'dividends'" align="right">
                                <div v-html="localcurrency_html(listobjects_sum(data,'dividends'))"></div>
                            </div>
                            <div v-if="header.value == 'total'" align="right">
                                <div v-html="localcurrency_html(listobjects_sum(data,'total'))"></div>
                            </div>

                        </td>
                    </tr>
                </template>                        
            </v-data-table>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    export default {
        components:{
        },
        data(){ 
            return{
                headers: [
                    { text: this.$t('Ranking'), sortable: true, value: 'ranking',  width: "3%"},
                    { text: this.$t('Name'), value: 'name'},
                    { text: this.$t('Current net gains'), value: 'current_net_gains', align:'right',  width: "10%"},
                    { text: this.$t('Historical net gains'), value: 'historical_net_gains', align:'right',  width: "10%"},
                    { text: this.$t('Net dividends'), value: 'dividends', align:'right',  width: "10%"},
                    { text: this.$t('Total'), value: 'total', align:'right',  width: "10%"},
                    { text: this.$t('Actions'), value: 'actions', sortable: false , width: "7%"},
                ],
                data:[],
                loading_table:false,
            }
        },
        methods: {
            viewItem (item) {
                this.key=this.key+1
                this.order=item
                this.dialog_view=true
            },
            update_table(){
                this.loading_table=true

                axios.get(`${this.$store.state.apiroot}/reports/ranking/`, this.myheaders())
                .then((response) => {
                    this.data=response.data
                    console.log(response);
                    this.loading_table=false
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
        },
        created(){
            this.update_table()
        }
    }
</script>

