<template>
    <div>
        <v-data-table density="compact" :headers="table_headers" :items="items" class="elevation-1" :sort-by="[{key:'date',order:'asc'}]" fixed-header :height="$attrs.height" ref="table_dps">
            <template #item.gross="{item}">
                <div v-html="currency_html(item.raw.gross, product.currency)"></div>
            </template>       
            <template #item.actions="{item}">
                <v-icon small class="mr-2" @click="editDPS(item.raw)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteDPS(item.raw)">mdi-delete</v-icon>
            </template>
                <template #bottom ></template>   
        </v-data-table>   
        <!-- DPSCRUD DIALOG -->
        <v-dialog v-model="dps_crud_dialog" width="35%">
            <v-card class="pa-3">
                <DpsCRUD :dps="dps" :mode="dps_crud_mode" :key="key"  @cruded="on_DpsCRUD_cruded()"></DpsCRUD>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>    
    import axios from 'axios'
    import DpsCRUD from './DpsCRUD.vue'
    export default {
        components:{
            DpsCRUD,
        },
        props: {
            product: {
                required: true
            },
        },
        data: function(){
            return {
                dps_crud_dialog:false,
                dps_crud_mode:null,
                dps: null,

                table_headers: [
                    { title: this.$t('Date'), key: 'date', sortable: true, width:"25%"},
                    { title: this.$t('Pay date'), key: 'paydate', sortable: false, width:"25%"},
                    { title: this.$t('DPS'), key: 'gross', sortable: true, align:'end' , width:"25%"},
                    { title: this.$t('Actions'), key: 'actions', sortable: false , width:"25%"},
                ],
                items:[],
                key: 0,
            }
        },
        methods: {
            editDPS(item){
                this.dps=item
                this.dps_crud_mode="U"
                this.key=this.key+1
                this.dps_crud_dialog=true
            },
            deleteDPS(item){
                this.dps=item
                this.dps_crud_mode="D"
                this.key=this.key+1
                this.dps_crud_dialog=true
            },
            gotoLastRow(){
                //this.$vuetify.goTo(10000, { container:  this.$refs.table_dps.$el.childNodes[0] }) 
            },
            on_DpsCRUD_cruded(){
                this.refresh()
                this.$emit("cruded")
                this.dps_crud_dialog=false
            },
            refresh(){
                this.loading=true
                axios.get(`${this.store().apiroot}/api/dps/?product=${this.product.url}`, this.myheaders())
                .then((response) => {
                    this.items=response.data
                    this.loading=false
                    this.gotoLastRow()
                }, (error) => {
                    this.parseResponseError(error)
                });
            }
        },
        mounted(){
            this.refresh()
        }
    }
</script>