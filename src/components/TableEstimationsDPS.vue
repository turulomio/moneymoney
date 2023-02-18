<template>
    <div>
        <v-data-table dense :headers="table_headers()" :items="items" class="elevation-1" disable-pagination  hide-default-footer sort-by="datetime" fixed-header :height="$attrs.height" :ref="$vnode.tag">

            <template v-slot:[`item.estimation`]="{ item }">
                <div v-html="currency(item.estimation)"></div>
            </template>          
            <template v-slot:[`item.manual`]="{ item }">
                <v-icon small v-if="item.manual" >mdi-check-outline</v-icon>
            </template>      
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editEstimationDPS(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteEstimationDPS(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>   
        <!-- DIVIDEND CU-->
        <v-dialog v-model="dialog_estimation_dps" width="35%">
            <v-card class="pa-3">
                <EstimationsDpsCU :estimation="estimation_dps" :key="key"  @cruded="on_EstimationsDpsCU_cruded()"></EstimationsDPSCU>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>    
    import axios from 'axios'
    import EstimationsDpsCU from './EstimationsDpsCU.vue'
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
                items:[],
                key: 0,
            }
        },
        methods: {
            currency(value){
                return this.currency_html(value, this.product.currency)
            },
            editEstimationDPS(item){
                this.estimation_dps=item
                this.dialog_estimation_dps=true
                this.key=this.key+1
            },
            deleteEstimationDPS(item){
                var r = confirm(this.$t("Do you want to delete this DPS estimation?"))
                if(r == false) {
                    return
                } 
                axios.delete(item.url, this.myheaders())
                .then(() => {
                    this.$emit("cruded")
                    this.refresh()
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            table_headers(){
                var r= [
                    { text: this.$t('Year'), value: 'year', sortable: true },
                    { text: this.$t('DPS estimation'), value: 'estimation', sortable: true,align:"right" },
                    { text: this.$t('Estimation date'), value: 'date_estimation', sortable: false},
                    { text: this.$t('Source'), value: 'source', sortable: false,},
                    { text: this.$t('Manual'), value: 'manual', sortable: true },
                    { text: this.$t('Actions'), value: 'actions', sortable: false },
                ]
                // if (this.heterogeneus==true){
                //     r.splice(1, 0, { text: this.$t('Account'), value: 'account',sortable: true });
                // }
                return r
            },
            gotoLastRow(){
                this.$vuetify.goTo(this.$refs[this.items.length-1], { container:  this.$refs[this.$vnode.tag].$el.childNodes[0] }) 
            },
            on_EstimationsDpsCU_cruded(){
                this.dialog_estimation_dps=false
                this.refresh()
                this.$emit("cruded")
            },
            refresh(){
                this.loading=true
                axios.get(`${this.$store.state.apiroot}/api/estimationsdps/?product=${this.product.url}`, this.myheaders())
                .then((response) => {
                    this.items=response.data
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