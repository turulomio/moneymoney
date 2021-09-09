<template>
    <div>
        <h1>{{ $t("Products comparation") }}
            <MyMenuInline :items="menuinline_items" @selected="MyMenuInlineSelection"></MyMenuInline>    
        </h1>

        <v-data-table dense :headers="headers" :items="items" sort-by="name" class="elevation-1 ma-4" hide-default-footer disable-pagination :loading="loading" :key="key">
        
            <template v-slot:[`item.a`]="{ item }">
                <div v-html="$store.getters.getObjectPropertyByUrl('products', item.a, 'name' )"></div>
            </template> 
            <template v-slot:[`item.b`]="{ item }">
                <div v-html="$store.getters.getObjectPropertyByUrl('products', item.b, 'name' )"></div>
            </template>     
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="pairReportItem(item)">mdi-eye</v-icon>
                <v-icon small class="mr-2" @click="editPair(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deletePair(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>
        <v-card class="pa-6">
            <v-card-title>{{ $t("Select two products") }}</v-card-title>
            <v-card-subtitle>{{ $t("Put in first place the one with better behaviour") }}</v-card-subtitle>
            <v-autocomplete :items="$store.state.products" v-model="product_a" :label="$t('Select a product')" item-text="name" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
            <v-autocomplete :items="$store.state.products" v-model="product_b" :label="$t('Select a product')" item-text="name" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
            <v-card-actions>
                <v-btn color="primary" @click="change" :disabled="(product_a==null || product_b==null)">{{ $t('Switch') }}</v-btn>
                <v-btn color="primary" @click="pairReport" :disabled="(product_a==null || product_b==null)">{{ $t('Pair report') }}</v-btn>
            </v-card-actions>
        </v-card>
        <!-- DIALOG PRODUCT COMPARATION VIEW -->
        <v-dialog v-model="dialog" >
            <v-card class="pa-4">
                <ProductsComparation :pc="pc"  :key="key"></ProductsComparation>
            </v-card>
        </v-dialog>
        <!-- DIALOG PRODUCT COMPARATION CY-->
        <v-dialog v-model="dialog_cu" max-width="40%">
            <v-card class="pa-4">
                <ProductsComparationCU :pc="pc" :key="key"  @cruded="on_ProductsComparationCU_cruded()"></ProductsComparationCU>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import axios from 'axios'
    import {empty_products_comparation} from '../empty_objects.js'
    import MyMenuInline from './MyMenuInline.vue'
    import ProductsComparation from './ProductsComparation.vue'
    import ProductsComparationCU from './ProductsComparationCU.vue'
    export default {
        components:{
            MyMenuInline,
            ProductsComparation,
            ProductsComparationCU,
        },
        data(){ 
            return {
                product_a: null,
                product_b: null,
                loading:false,
                key:0,
                dialog:false,
                dialog_cu:false,
                items:[],
                headers:[
                    { text: this.$t('Name'), sortable: true, value: 'name'},
                    { text: this.$t('Product A'), value: 'a',  width: "30%"},
                    { text: this.$t('Product B'), value: 'b',  width: "30%"},
                    { text: this.$t('Actions'), value: 'actions', sortable: false , width:"7%"},

                ],

                menuinline_items: [
                    {
                        subheader: this.$t("Products comparation options"),
                        children: [
                            {
                                name:"Add a new products comparation",
                                icon: "mdi-plus",
                                code: function(this_){
                                    this_.pc=this_.empty_products_comparation()
                                    this_.key=this_.key+1
                                    this_.dialog_cu=true
                                },
                            },
                        ]
                    },
                ],
                pc:null,
            }
        },
        methods:{
            MyMenuInlineSelection(item){
                item.code(this)
            },
            deletePair(item){
               var r = confirm(this.$t("Do you want to delete this products comparation?"))
               if(r == false) {
                  return
               } 
                axios.delete(item.url, this.myheaders())
                .then(() => {
                    this.refreshTable()
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            editPair(item){
                this.pc=item
                this.key=this.key+1
                this.dialog_cu=true

            },
            empty_products_comparation,
            on_ProductsComparationCU_cruded(){
                this.dialog_cu=false
                this.refreshTable()
            },
            pairReport(){               
                this.dialog=true
                this.pc=this.empty_products_comparation()
                this.pc.a=this.product_a
                this.pc.b=this.product_b
                this.key=this.key+1
            },
            pairReportItem(item){            
                console.log(item)   
                this.product_a=item.a
                this.product_b=item.b
            },
            refreshTable(){               
                this.loading=true
                axios.get(`${this.$store.state.apiroot}/api/productspairs/`, this.myheaders())
                .then((response) => {
                    this.items=response.data
                    this.loading=false
                    this.key=this.key+1
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            change(){
                var tmp=this.product_a
                this.product_a=this.product_b
                this.product_b=tmp
                this.$refs.a.forceValue(this.product_a)
                this.$refs.b.forceValue(this.product_b)
            }
        },
        mounted(){
            this.refreshTable()
        }
    }
</script>