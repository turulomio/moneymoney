<template>
    <div>
        <h1>{{ $t(`Products search`)}}
            <MyMenuInline :items="items" :context="this"></MyMenuInline>
        </h1>

        <v-card width="45%" class="pa-8 ma-3 mx-lg-auto">
                <v-row>
                    <v-text-field dense name="search" v-model="search" :label="$t('Search products')"  :placeholder="$t('Enter a string')" autofocus v-on:keyup.enter="refreshSearch()"></v-text-field>
                    <v-btn :disabled="loading" dense class="ml-4" color="error" @click="submit()">{{ $t("Search") }}</v-btn>
                </v-row>
        </v-card>

        <v-card >
            <v-data-table dense :headers="tableHeaders" :items="tableData"  class="elevation-1" disable-pagination  hide-default-footer :sort-by="['value']" :sort-desc="[true]" fixed-header height="650" :loading="loading">      
                <template v-slot:[`item.name`]="{ item }">
                    <v-icon :class="'mr-2 fi fib fi-'+item.flag" small></v-icon><span :class="class_name(item)">{{item.name}}</span>
                </template>                  
                <template v-slot:[`item.productstypes`]="{ item }">
                    <div>{{ $store.getters.getObjectPropertyByUrl("productstypes",item.productstypes,"localname")}}</div>
                </template>  
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small @click="favoriteProduct(item)" :color="(favorites.includes(item.id))? 'orange': '' " class="mr-1">mdi-star-outline</v-icon>
                    <v-icon class="mr-1" small @click="viewProduct(item)">mdi-eye-outline</v-icon>
                    <v-icon class="mr-1" small @click="editPersonalProduct(item)" v-if="item.id<0">mdi-pencil</v-icon>
                    <v-icon class="mr-1" small @click="editSystemProduct(item)"  color="#AA0000" v-if="item.id>=0 && $store.state.catalog_manager">mdi-pencil</v-icon>
                    <v-icon class="mr-1" small @click="deletePersonalProduct(item)" v-if="item.id<0 && item.uses==0">mdi-delete</v-icon>
                    <v-icon class="mr-1" small @click="deleteSystemProduct(item)" color="#AA0000" v-if="item.id>=0 && $store.state.catalog_manager">mdi-delete</v-icon>
                </template>
            </v-data-table>   
        </v-card>
        <!--  DIALOG PRODUCT VIEW -->
        <v-dialog v-model="dialog_productsview">
            <v-card class="pa-4">
                <ProductsView :product="product" :key="key"></ProductsView>
            </v-card>
        </v-dialog>
        <!--  DIALOG PRODUCT CU -->
        <v-dialog v-model="dialog_products_cu" width="30%">
            <v-card class="pa-4">
                <ProductsCU :product="product" :mode="product_cu_mode" :system="product_cu_system" :key="key" @cruded="on_ProductsCU_cruded()"></ProductsCU>
            </v-card>
        </v-dialog>
    </div>
</template>  
<script>     
    import axios from 'axios'
    import {empty_product} from '../empty_objects.js'
    import MyMenuInline from './MyMenuInline.vue'
    import ProductsView from './ProductsView.vue'
    import ProductsCU from './ProductsCU.vue'
    export default {
        components:{
            MyMenuInline,
            ProductsView,
            ProductsCU,
        },
        data () {
            return {
                search: null,
                tableHeaders: [
                    { text: 'Id', value: 'id',sortable: true },
                    { text: 'Name', value: 'name',sortable: true},
                    { text: 'ISIN',  sortable: true, value: 'isin'},
                    { text: this.$t('Type'),  sortable: true, value: 'productstypes'},
                    { text: this.$t('Currency'),  sortable: true, value: 'currency'},
                    { text: 'Yahoo',  sortable: true, value: 'ticker_yahoo'},
                    { text: 'Morningstar',  sortable: true, value: 'ticker_morningstar'},
                    { text: 'Google',  sortable: true, value: 'ticker_google'},
                    { text: 'QueFondos',  sortable: true, value: 'ticker_quefondos'},
                    { text: 'Investing.com',  sortable: true, value: 'ticker_investingcom'},
                    { text: this.$t('Actions'), value: 'actions', sortable: false },
                ],   
                tableData: [],
                items: [
                    {
                        subheader:this.$t('Product orders'),
                        children: [
                            {
                                name:this.$t('Add a personal product'),
                                code: function(this_){
                                    this_.product=this_.empty_product()
                                    this_.product_cu_mode="C"
                                    this_.product_cu_system=false
                                    this_.key=this_.key+1
                                    this_.dialog_products_cu=true
                                },
                                icon: "mdi-plus",
                            },
                            {
                                name:this.$t('Add a system product'),
                                code: function(this_){
                                    this_.product=this_.empty_product()
                                    this_.product_cu_mode="C"
                                    this_.product_cu_system=true
                                    this_.key=this_.key+1
                                    this_.dialog_products_cu=true
                                },
                                icon: "mdi-plus",
                            },
                        ]
                    },
                    {
                        subheader:this.$t('Especial products'),
                        children: [
                            {
                                name:this.$t('Favorite products'),
                                code: function(this_){
                                    this_.refreshFavoriteProducts()
                                },
                                icon: "mdi-star-outline",
                            },
                            {
                                name:this.$t('Active investments products'),
                                code: function(this_){
                                    this_.refreshActiveInvestmentsProducts()
                                },
                                icon: "mdi-plus",
                            },
                            {
                                name:this.$t('All investments products'),
                                code: function(this_){
                                    this_.refreshInvestmentsProducts()
                                },
                                icon: "mdi-plus",
                            },
                            {
                                name:this.$t('Personal products'),
                                code: function(this_){
                                    this_.refreshPersonalProducts()
                                },
                                icon: "mdi-plus",
                            },
                        ]
                    },
                ],
                loading: false,
                key:0,
                favorites: [],


                //DIALOG PRODUCTS VIEW
                dialog_productsview:false,
                product:null,

                //DIALOG PRODUCTS CU
                dialog_products_cu:false,
                product_cu_mode:null,
                product_cu_system:null,
            }
        },
        methods: {
            editPersonalProduct(item){
                console.log(item)
                this.product=item
                this.product_cu_mode="U"
                this.product_cu_system=false
                this.key=this.key+1
                this.dialog_products_cu=true
            },
            editSystemProduct(item){
                this.product=item
                this.product_cu_mode="U"
                this.product_cu_system=true
                this.key=this.key+1
                this.dialog_products_cu=true
            },
            deletePersonalProduct(item){
                this.product=item
                this.product_cu_mode="D"
                this.product_cu_system=false
                this.key=this.key+1
                this.dialog_products_cu=true
            },
            deleteSystemProduct(){
                alert(this.$t("System products never should be deleted. You can set obsolete or rename to Reusable when needed."))
            },
            empty_product,
            viewProduct(item){
                this.product=item
                this.key=this.key+1
                this.dialog_productsview=true
            },
            class_name(item){
                if (item.obsolete==false){
                    return ""
                }
                return "text-decoration-line-through"
            },
            submit(){
                this.refreshSearch()
            },
            on_ProductsCU_cruded(){
                this.loading=true
                this.dialog_products_cu=false,
                this.$store.dispatch("getProducts").then(() => {
                    this.refreshSearch()
                    console.log("AHORA")
                })
            },
            refreshSearch(){
                this.loading=true
                if (this.search==null){
                    this.tableData=[]
                } else {
                    this.tableData=this.$store.state.products.filter(o => 
                        o.name.toUpperCase().includes(this.search.toUpperCase()) ||
                        this.ifnullempty(o.ticker_yahoo).toUpperCase().includes(this.search.toUpperCase()) ||
                        this.ifnullempty(o.ticker_morningstar).toUpperCase().includes(this.search.toUpperCase()) ||
                        this.ifnullempty(o.ticker_google).toUpperCase().includes(this.search.toUpperCase()) ||
                        this.ifnullempty(o.ticker_quefondos).toUpperCase().includes(this.search.toUpperCase()) ||
                        this.ifnullempty(o.ticker_investingcom).toUpperCase().includes(this.search.toUpperCase()) ||
                        this.ifnullempty(o.isin).toUpperCase().includes(this.search.toUpperCase())
                    )
                }
                this.loading=false
            },
            refreshActiveInvestmentsProducts(){
                this.tableData=[]
                this.loading=true
                this.$store.getters.getInvestmentsActive().forEach(element => {
                    let product = this.$store.getters.getObjectByUrl("products",element.products)
                    if (!this.tableData.find(o => o.url === product.url)) {
                         this.tableData.push(product)
                    }
                });
                console.log(this.tableData)
                this.loading=false
            },
            refreshFavoriteProducts(){
                this.tableData=[]
                this.loading=true
                this.$store.state.products.forEach(element => {
                    if (this.favorites.includes(element.id)) {
                         this.tableData.push(element)
                    }
                });
                this.loading=false
            },
            refreshInvestmentsProducts(){
                this.tableData=[]
                this.loading=true
                this.$store.state.investments.forEach(element => {
                    let product = this.$store.getters.getObjectByUrl("products",element.products)
                    if (!this.tableData.find(o => o.url === product.url)) {
                         this.tableData.push(product)
                    }
                });
                this.loading=false
            },
            refreshPersonalProducts(){
                this.loading=true
                this.tableData=this.$store.state.products.filter( element => element.id<0)
                this.loading=false
            },
            favoriteProduct(item){
                this.loading=true
                this.product=item
                var url
                if (item==null){ //Load favorites
                    url=null
                } else{
                    url=this.product.url //Add or remove
                }

                axios.post(`${this.$store.state.apiroot}/products/favorites/`, {product: url}, this.myheaders())
                .then((response) => {
                        this.favorites=response.data
                        this.refreshSearch()
                        this.loading=false
                }, (error) => {
                    this.parseResponseError(error)
                })
            }
        },
        created(){
            this.favoriteProduct(null)

        }
        
    }
</script>

