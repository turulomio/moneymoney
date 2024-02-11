<template>
    <div>        
        <v-data-table  ref="table" :show-select="showselected" v-model="selected" density="compact" :headers="table_headers()" :items="items" class="elevation-1" :sort-by="[{ key: 'datetime', order: 'asc' }]" fixed-header :height="$attrs.height"  :items-per-page="items_per_page" fixed-footer>

            <template #item.datetime="{item}">
                <div >{{ localtime(item.datetime)}}</div>
            </template>          
            <template #item.amount="{item}">
                <div class="text-right" v-html="currency_html(item.amount,item.currency)"></div>
            </template>   
            <template #item.balance="{item}">
                <div class="text-right" v-html="currency_html(item.balance, item.currency)"></div>
            </template>   
            <template #item.creditcard="{item}">
                <div v-html="useStore().creditcards.get(item.creditcards).name"></div>
            </template>  
            <template #item.concepts="{item}">
                <div v-html="useStore().concepts.get(item.concepts).name"></div>
            </template>
            <template #item.actions="{item}">
                <v-icon small class="mr-2" @click="copyCCO(item)">mdi-content-copy</v-icon>
                <v-icon small class="mr-2" @click="editCCO(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteCCO(item)">mdi-delete</v-icon>
            </template>
            <template #tbody v-if="showtotal && items.length>0">
                <tr id="bottom" class=" v-data-table__tr totalrow">
                    <td>{{ f($t("Total ([0] registers)"), [items.length])}}</td>
                    <td v-if="showcc"></td>
                    <td></td>
                    <td></td>
                    <td class="text-right" v-html="currency_html(listobjects_sum(items,'amount'),total_currency)"></td>
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
    import { useStore } from "@/store"
    import {empty_cco} from '../empty_objects.js'
    import { localtime, f } from 'vuetify_rules'
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
            useStore,
            f,
            localtime,
            empty_cco,
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
            copyCCO (item) {
                this.cco=this.empty_cco()
                this.cco_mode="C"
                this.cco.concepts=item.concepts
                this.cco.amount=item.amount
                this.cco.comment=item.comment
                this.cco.creditcards=item.creditcards
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
                r.push({ title: this.$t('Balance'), key: 'balance', sortable: false, align:'end', width:"8%"})
                r.push({ title: this.$t('Comment'), key: 'comment', sortable: true})
                if (this.hideactions==false){
                    r.push({ title: this.$t('Actions'), key: 'actions', sortable: false, width:"8%"})
                }
                return r
            },        
            async gotoLastRow(){ 
                const bottom = document.getElementById("bottom")
                await this.$nextTick();
                if (bottom){ 
                    bottom.scrollIntoView({ behavior: "auto", block: "end", inline: "nearest" })
                }       
            },
            on_CreditcardsoperationsCU_cruded(){
                this.$emit("cruded")
                this.dialog=false
                this.gotoLastRow()
            }
        },
        mounted(){
            this.gotoLastRow()
        }
    }
</script>
