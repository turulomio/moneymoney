<template>
    <div>
        <h1>{{ $t("Dividends report") }}</h1>   
        <v-container  style="width:40%" elevation="1">
            <v-card>
                <v-col  justify="space-around">
                    <v-text-field v-model="alertdays" type="number" :label="$t('Max days to update dividends alert')" :placeholder="$t('Enter an integer number')"></v-text-field>
                </v-col>
            </v-card>
        </v-container>
        <div class="pa-6">
            <v-data-table dense :headers="tableHeaders"  :items="items" class="elevation-1" disable-pagination  hide-default-footer :sort-by="['percentage']" :sort-desc="['percentage']">
                <template v-slot:[`item.dps`]="{item}"  class="text-nowrap">
                    <div v-html="currency_html(item.dps,item.currency )"></div>
                </template>    
                <template v-slot:[`item.estimated`]="{item}"  class="text-nowrap">
                    <div v-html="currency_html(item.estimated,item.currency )"></div>
                </template>    
                <template v-slot:[`item.current_price`]="{item}"  class="text-nowrap">
                    <div v-html="currency_html(item.current_price,item.currency )"></div>
                </template>    
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small class="mr-2" @click="addEstimation(item)">mdi-pencil</v-icon>
                    <v-icon small @click="addEstimation(item)" v-if="showAlarm(item)" color="#9933ff">mdi-alarm</v-icon>
                </template> 
                <template v-slot:[`item.percentage`]="{ item }">
                    <div v-html="percentage_html(item.percentage )"></div>
                </template>
            </v-data-table>
            <p class="mt-4 ">{{ total() }}</p>
        </div>
        
        <v-dialog v-model="dialog" max-width="450">
            <v-card>
                <v-card-title class="headline">{{ $t("Post an estimation") }}</v-card-title>
                <v-form ref="form" v-model="form_valid" lazy-validation v-if='estimation!=null'>
                    <v-col>
                        <v-text-field v-model="estimation.year" type="text" :counter="4" :label="$t('Year')" :placeholder="$t('Enter a year')" :rules="RulesInteger(4,true)"></v-text-field>
                        <v-text-field v-model="estimation.estimation" type="text" :label="$t('Estimation')" :counter="10" :placeholder="$t('Enter a estimation')" autofocus @focus="$event.target.select()" :rules="RulesFloat(10, true)"></v-text-field>
                    </v-col>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="submit()" :disabled="!form_valid">{{ $t("Post an estimation") }}</v-btn>
                        <v-btn color="error" @click="dialog = false">{{ $t("Cancel") }}</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import axios from 'axios'
    import moment from 'moment'
    import {empty_estimation_dps} from '../empty_objects.js'
    export default {
        data(){ 
            return{
                alertdays:90,
                tableHeaders: [
                    { text: this.$t('Investment'), value: 'name',sortable: true },
                    { text: this.$t('Current price'), value: 'current_price',sortable: true, align: 'right'},
                    { text: this.$t('DPS'), value: 'dps',sortable: false, align: 'right', cellClass: "text-nowrap"},
                    { text: this.$t('Shares'), value: 'shares',sortable: false, align: 'right'},
                    { text: this.$t('Estimated balance'), value: 'estimated',sortable: false, align: 'right'},
                    { text: this.$t('Percentage'), value: 'percentage',sortable: false, align: 'right', },
                    { text: this.$t('Actions'), value: 'actions',sortable: false, align: 'right'},
                ],
                items:[],
                
                estimation: null,
                
                dialog:false,
                form_valid:false,
                loading_dividends:false
            }
        },
        methods:{
            showAlarm(item){
                var today= moment()
                var estimation= moment(item.date_estimation)
                if (item.dps==null || today.diff(estimation,"days") > this.alertdays ) {
                    return true
                }
                return false
            },
            addEstimation(item){
                this.dialog=true
                this.estimation=this.empty_estimation_dps()
                this.estimation.product=item.product
            },
            empty_estimation_dps,
            submit(){
                console.log(this.estimation)
                if (this.$refs.form.validate()==false) return
                axios.post(`${this.$store.state.apiroot}/estimations/dps/add/`, this.estimation, this.myheaders())
                .then((response) => {
                    console.log(response.data)
                    this.dialog=false
                    this.refreshTable()
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            refreshTable(){
                this.loading_dividends=true
                axios.get(`${this.$store.state.apiroot}/reports/dividends/`, this.myheaders())
                .then((response) => {
                    console.log(response.data)
                    this.items=response.data
                    this.loading_dividends=false
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            total(){
                var total=this.items.reduce((accum,item) => accum + item.estimated, 0)
                return this.$t(`If I kept the investments for a year I would get ${this.localcurrency_string(total)}`)
            }
            
        },
        mounted(){
            this.refreshTable()
        }
    }
</script>
