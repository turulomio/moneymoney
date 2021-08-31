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
                    <v-icon small @click="addEstimation(item)" v-if="showAlarm(item)">mdi-alarm</v-icon> {{ if_null_script(item.dps)}}
                </template>    
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small class="mr-2" @click="addEstimation(item)">mdi-pencil</v-icon>
                </template> 
                <template v-slot:[`item.percentage`]="{ item }">
                    {{ `${my_round(item.percentage*100, 2)} %`}}
                </template>
            </v-data-table>
            <p class="mt-4 ">{{ total() }}</p>
        </div>
        
        <v-dialog v-model="dialog" max-width="450">
            <v-card>
                <v-card-title class="headline">{{ $t("Post an estimation") }}</v-card-title>
                <v-form ref="form" v-model="form_valid" lazy-validation>
                    <v-col>
                        <v-text-field v-model="year" type="text" :counter="4" :label="$t('Year')" :placeholder="$t('Enter a year')" :rules="RulesIntegerRequired4"></v-text-field>
                        <v-text-field v-model="estimation" type="text" :label="$t('Estimation')" :counter="10" :placeholder="$t('Enter a estimation')" autofocus @focus="$event.target.select()" :rules="RulesNumberRequired10"></v-text-field>
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
    import moment from 'moment'
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
                
                products_id: null,
                year:new Date().getFullYear(),
                estimation: 0,
                
                dialog:false,
                form_valid:false,
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
                this.products_id=item.products_id
                console.log(item)
            },
            submit(){
                let data = new FormData(); // 2
                console.log(data)
                // data.append("products_id", this.products_id)  
                // data.append("estimation", this.estimation)  
                // data.append("year", this.year)
                // data.append("csrfmiddlewaretoken", '{{csrf_token}}')
    
                // axios.post( action="{% url 'estimation_dps_new') , data)
                // .then(function (response) {
                //     if (response.data=="True"){
                //         location.reload()
                //     } else {
                //         alert("Something is wrong")
                //     }
                // })
                // .catch(function (error) {
                //     alert("Something is wrong")
                // });
            },
            total(){
                var total=this.items.reduce((accum,item) => accum + item.estimated, 0)
                return this.$t(`If I kept the investments for a year I would get ${this.localcurrency_string(total)}`)
            }
            
        }
    }
</script>

<style>

</style>