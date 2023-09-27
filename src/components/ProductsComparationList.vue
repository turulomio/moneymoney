<template>
    <div>
        <h1>{{ $t("Products comparation") }}
            <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>    
        </h1>

        <v-data-table density="compact" :headers="headers" :items="items" :sort-by="[{key:'name',order:'asc'}]" class="elevation-1 ma-4 cursorpointer" :loading="loading" :key="key"  @click:row="pairReportItem"    :items-per-page="10000" >
        
            <template #item.a="{item}">
                <div v-html="this.store().products.get(item.a).name"></div>
            </template> 
            <template #item.b="{item}">
                <div v-html="this.store().products.get(item.b).name"></div>
            </template>     
            <template #item.actions="{item}">
                <v-icon small class="mr-2" @click="editPair(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deletePair(item)">mdi-delete</v-icon>
            </template>
            <template #bottom ></template>   
        </v-data-table>
        <v-card class="pa-6">
            <v-card-title>{{ $t("Select two products") }}</v-card-title>
            <v-card-subtitle>{{ $t("Put in first place the one with better behaviour") }}</v-card-subtitle>
            <AutocompleteProducts v-model="product_a" :label="$t('Select the best product')" :rules="RulesSelection(true)" :key="'A'+key" />
            <AutocompleteProducts v-model="product_b" :label="$t('Select the worst product')" :rules="RulesSelection(true)" :key="'B'+key" />
            <v-card-actions>
                <v-btn color="primary" @click="change" :disabled="(product_a==null || product_b==null)">{{ $t('Switch') }}</v-btn>
                <v-btn color="primary" @click="pairReport" :disabled="(product_a==null || product_b==null)">{{ $t('Pair report') }}</v-btn>
            </v-card-actions>
        </v-card>
        <!-- DIALOG PRODUCT COMPARATION VIEW -->
        <v-dialog v-model="dialog" width="100%" height="100%">
            <v-card class="pa-4">
                <ProductsComparation :pc="pc"  :key="key"></ProductsComparation>
            </v-card>
        </v-dialog>
        <!-- DIALOG PRODUCT COMPARATION CY-->
        <v-dialog v-model="dialog_cu" max-width="40%">
            <v-card class="pa-4">
                <ProductsComparationCU :pc="pc" :mode="pc_mode" :key="key"  @cruded="on_ProductsComparationCU_cruded" />
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
    import AutocompleteProducts from './AutocompleteProducts.vue'
    export default {
        components:{
            MyMenuInline,
            ProductsComparation,
            ProductsComparationCU,
            AutocompleteProducts,
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
                    { title: this.$t('Name'), sortable: true, key: 'name'},
                    { title: this.$t('Product A'), key: 'a',  width: "30%"},
                    { title: this.$t('Product B'), key: 'b',  width: "30%"},
                    { title: this.$t('Actions'), key: 'actions', sortable: false , width:"7%"},

                ],

                menuinline_items: [
                    {
                        subheader: this.$t("Products comparation options"),
                        children: [
                            {
                                name: this.$t("Add a new products comparation"),
                                icon: "mdi-plus",
                                code: function(){
                                    this.pc=this.empty_products_comparation()
                                    this.pc_mode="C"
                                    this.key=this.key+1
                                    this.dialog_cu=true
                                }.bind(this),
                            },
                        ]
                    },
                ],
                pc:null,
                pc_mode:null,
            }
        },
        methods:{
            deletePair(item){
                this.pc=item
                this.pc_mode="D"
                this.key=this.key+1
                this.dialog_cu=true
            },
            editPair(item){
                this.pc=item
                this.pc_mode="U"
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
            pairReportItem(event,object){       
                this.product_a=object.item.a
                this.product_b=object.item.b
                this.key=this.key+1
            },
            refreshTable(){               
                this.loading=true
                axios.get(`${this.store().apiroot}/api/productspairs/`, this.myheaders())
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