<template>
    <div>        
        <v-data-table  ref="table_ao" :show-select="showselected" v-model="selected" density="compact" :headers="table_headers()" :items="items" class="elevation-1" :sort-by="[{ key: 'datetime', order: 'asc' }]" fixed-header :height="$attrs.height"  :items-per-page="items_per_page" fixed-footer>

            <template #item.datetime="{item}">
                <div >{{ localtime(item.raw.datetime)}}</div>
            </template>          
            <template #item.amount="{item}">
                <div class="text-right" v-html="currency_html(item.raw.amount,item.raw.currency)"></div>
            </template>   
            <template #item.balance="{item}">
                <div class="text-right" v-html="currency_html(item.raw.balance, item.raw.currency)"></div>
            </template>   
            <template #item.creditcard="{item}">
                <div v-html="store().creditcards.get(item.raw.creditcards).name"></div>
            </template>  
            <template #item.concepts="{item}">
                <div v-html="store().concepts.get(item.raw.concepts).name"></div>
            </template>
            <template #item.actions="{item}">
                <v-icon small class="mr-2" @click="editCCO(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteCCO(item)">mdi-delete</v-icon>
            </template>
            <template #tbody v-if="showtotal && items.length>0">
                <div id="bottom"></div>
                <tr class="totalrow">
                    <td>{{ $t("Total ([0] registers)").format(items.length)}}</td>
                    <td></td>
                    <td class="text-right" v-html="currency_html(listobjects_sum(items,'amount'),total_currency)"></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </template>
         <template #bottom ></template>
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
            },
            selected_items(){
                return this.items.filter((o) =>{
                    return this.selected.includes(o.id)
                })
            }

        },
        watch: {

            selected(){
                console.log(this.selected.length)
                this.$emit("changeSelected",this.selected_items)
            }
        },
        data: function(){
            return {
                selected: [],
                items_per_page:5000000,

                //CCOCU
                dialog:false,
                cco: null,
                cco_deleting:false,
                loading_cco:false,
                key:0,
            }
        },
        methods: {
            editCCO(item){
                this.cco=item.raw
                this.cco_deleting=false
                this.key=this.key+1
                this.dialog=true
            },
            deleteCCO(item){
                this.cco=item.raw
                this.cco_deleting=true
                this.key=this.key+1
                this.dialog=true
            },
            table_headers(){
                var r= []
                r.push({ title: this.$t('Date and time'), key: 'datetime', sortable: true, width:"12%" })
                if (this.showcc){
                    r.push({ title: this.$t('Credit card'), key: 'creditcard', sortable: true, width:"20%"})

                }
                r.push({ title: this.$t('Concept'), key: 'concepts', sortable: true, width:"20%"})
                r.push({ title: this.$t('Amount'), key: 'amount', sortable: false, align:'end', width:"8%"})
                if (this.showbalance){
                    r.push({ title: this.$t('Balance'), key: 'balance', sortable: false, align:'end', width:"8%"})
                }
                r.push({ title: this.$t('Comment'), key: 'comment', sortable: true})
                if (this.hideactions==false){
                    r.push({ title: this.$t('Actions'), key: 'actions', sortable: false     , width:"6%"})
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
