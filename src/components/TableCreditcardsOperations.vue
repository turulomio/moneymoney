<template>
    <div>
        <v-data-table  ref="table_ao" :show-select="showselected" v-model="selected" dense :headers="table_headers()" :items="items" class="elevation-1" disable-pagination  hide-default-footer sort-by="datetime" fixed-header v-bind="$attrs" :single-select="false">
            <template v-slot:[`item.datetime`]="{ item,index }">
                <div :ref="index">{{ localtime(item.datetime)}}</div>
            </template>          
            <template v-slot:[`item.amount`]="{ item }">
                <div v-html="currency_html(item.amount,item.currency)"></div>
            </template>   
            <template v-slot:[`item.balance`]="{ item }">
                <div v-html="currency_html(item.balance, item.currency)"></div>
            </template>   
            <template v-slot:[`item.concepts`]="{ item }">
                <div v-html="$store.getters.getObjectPropertyByUrl('concepts', item.concepts, 'name')"></div>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editCCO(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteCCO(item)">mdi-delete</v-icon>
            </template>
            <template v-slot:[`body.append`]="{headers}" v-if="showtotal && items.length>0">
                <tr class="totalrow">
                    <td v-for="(header,i) in headers" :key="i" >
                        <div v-if="header.value == 'datetime'">
                            {{ $t("Total ({0} registers):").format(items.length)}}
                        </div>
                        <div v-if="header.value == 'amount'">
                            <div class="text-right" v-html="currency_html(listobjects_sum(items,'amount'),total_currency)"></div>
                        </div>
                    </td>
                </tr>
            </template>
        </v-data-table>   

        <!-- CCCO CU -->
        <v-dialog v-model="dialog" max-width="650" class="pa-4" >
            <v-card class="pa-4">
                <CreditcardsoperationsCU :deleting="cco_deleting" :cco="cco" :key="key" @cruded="on_CreditcardsoperationsCU_cruded()"></CreditcardsoperationsCU>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>     
    import CreditcardsoperationsCU from './CreditcardsoperationsCU.vue'
    export default {
        components:{
            CreditcardsoperationsCU,
        },
        props: {
            items: {
                required: true
            },
            showtotal:{// Items must have currency attribute
                type: Boolean,
                required:false,
                default: false,
            },
            showcc:{// Items must have accounts attribute
                type: Boolean,
                required:false,
                default: false,
            },
            showbalance:{// Items must have balance attribute
                type: Boolean,
                required:false,
                default: false,
            },
            showselected:{
                type: Boolean,
                required:false,
                default: false,
            },
            hideactions:{
                type: Boolean,
                required:false,
                default: false,
            }
        },

        computed:{
            total_currency(){
                if (this.items.length==0) return ""
                return this.items[0].currency
            },
            all_items_has_same_currency(){
                if (this.items.length==0) return false
                var first_currency=this.items[0].currency
                var r=true
                this.items.forEach(item => {//For Each doesn't allow to return false
                    if (item.currency!=first_currency)  {
                        r=false
                    }
                });
                return r
            }

        },
        data: function(){
            return {
                selected: [],

                //CCOCU
                dialog:false,
                cco: null,
                cco_deleting:false,
                loading_cco:false,
                key:0,
            }
        },
        watch: {
            selected(){
                this.$emit("changeSelected",this.selected)
            }
        },
        methods: {
            editCCO(item){
                this.cco=item
                this.cco_deleting=false
                this.key=this.key+1
                this.dialog=true
            },
            deleteCCO(item){
                this.cco=item
                this.cco_deleting=true
                this.key=this.key+1
                this.dialog=true
            },
            table_headers(){
                var r= [
                    { text: this.$t('Date and time'), value: 'datetime', sortable: true, width:"12%" },
                    { text: this.$t('Concept'), value: 'concepts', sortable: true, width:"20%"},
                    { text: this.$t('Amount'), value: 'amount', sortable: false, align:"right", width:"8%"},
                    { text: this.$t('Balance'), value: 'balance', sortable: false, align:"right", width:"8%"},
                    { text: this.$t('Comment'), value: 'comment', sortable: true},
                ]
                if (this.hideactions==false){
                    r.push({ text: this.$t('Actions'), value: 'actions', sortable: false     , width:"6%"})
                }
                if (this.showbalance==true){

                    r.splice(3, 1);
                }
                return r
            },
            gotoLastRow(){          
            //this.$vuetify.goTo(100000, { container:  this.$refs[this.$vnode.tag].$el.children[0].children[0].children[2].children ,duration: 500}) 
            //     this.$vuetify.goTo(this.$refs[this.items.length-1], { container:  this.$refs.table_ao.$el.childNodes[0]}) 

            },
            on_CreditcardsoperationsCU_cruded(){
                this.$emit("cruded")
                this.dialog=false
            }
        },
        mounted(){
            this.gotoLastRow()
        }
    }
</script>
