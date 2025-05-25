<template>
    <div>
        <v-data-table density="compact" :headers="table_headers()" :items="items" class="elevation-1" :sort-by="[{key:'year',order:'asc'}]" fixed-header :height="$attrs.height"    :items-per-page="10000" >

            <template #item.estimation="{item}">
                <div v-html="currency(item.estimation)"></div>
            </template>          
            <template #item.manual="{item}">
                <v-icon small v-if="item.manual" >mdi-check-outline</v-icon>
            </template>      
            <template #item.actions="{item}">
                <v-icon small class="mr-2" @click="editEstimationDPS(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteEstimationDPS(item)">mdi-delete</v-icon>
            </template>
                <template #bottom ></template>   
        </v-data-table>   
        <!-- DIVIDEND CU-->
        <v-dialog v-model="dialog_estimation_dps" width="35%">
            <v-card class="pa-3">
                <EstimationsDpsCU :estimation="estimation_dps" :mode="estimation_dps_mode" :key="key"  @cruded="on_EstimationsDpsCU_cruded()" />
            </v-card>
        </v-dialog>
    </div>
</template>
<script>    
    import axios from 'axios'
    import { useStore } from "@/store"
    import EstimationsDpsCU from './EstimationsDpsCU.vue'
import { parseResponseError } from '@/functions'
    export default {
        components:{
            EstimationsDpsCU,
        },
        props: {
            product: {
                required: true
            },
        },
        data: function(){
            return {
                dialog_estimation_dps:false,
                estimation_dps: null,
                estimation_dps_mode: null,
                items:[],
                key: 0,
            }
        },
        methods: {
            useStore,
            parseResponseError,
            currency(value){
                return this.currency_html(value, this.product.currency)
            },
            editEstimationDPS(item){
                this.estimation_dps=item
                this.estimation_dps_mode="U"
                this.dialog_estimation_dps=true
                this.key=this.key+1
            },
            deleteEstimationDPS(item){
                this.estimation_dps=item
                this.estimation_dps_mode="D"
                this.dialog_estimation_dps=true
                this.key=this.key+1
            },
            table_headers(){
                var r= [
                    { title: this.$t('Year'), key: 'year', sortable: true },
                    { title: this.$t('DPS estimation'), key: 'estimation', sortable: true,align:'end' },
                    { title: this.$t('Estimation date'), key: 'date_estimation', sortable: false},
                    { title: this.$t('Source'), key: 'source', sortable: false,},
                    { title: this.$t('Manual'), key: 'manual', sortable: true },
                    { title: this.$t('Actions'), key: 'actions', sortable: false },
                ]
                return r
            },
            gotoLastRow(){
                //this.$vuetify.goTo(this.$refs[this.items.length-1], { container:  this.$refs[this.$vnode.tag].$el.childNodes[0] }) 
            },
            on_EstimationsDpsCU_cruded(){
                this.dialog_estimation_dps=false
                this.refresh()
            },
            refresh(){
                this.loading=true
                axios.get(`${this.useStore().apiroot}/api/estimationsdps/?product=${this.product.url}`, this.myheaders())
                .then((response) => {
                    this.items=response.data
                    this.key=this.key+1
                    this.loading=false
                }, (error) => {
                    this.parseResponseError(error)
                });
            }
        },
        created(){
            this.refresh()
        }
    }
</script>