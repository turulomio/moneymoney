<template>
    <div>
        <h1>{{ $t("Products search")}}
            <MyMenuInline :items="items" :context="this"></MyMenuInline>
        </h1>

        <v-card width="65%" class="pa-8 ma-3 mx-auto">
                <v-row>
                    <v-text-field :disabled="loading" name="search" v-model="search" :label="$t('Search products')"  :placeholder="$t('Enter a string')" autofocus @keyup.enter="refreshSearch()"></v-text-field>
                    <div width="10px">
                        <v-select :items="obsolete_filter_items" v-model="obsolete_filter" class="ml-4" :disabled="loading" :label="$t('Filter by status')"  item-text="name" item-value="id" :rules="RulesSelection(true)"></v-select>  
                    </div>
                    <v-btn :disabled="loading"  class="ml-4" color="error" @click="refreshSearch()">{{ $t("Search") }}</v-btn>
                </v-row>
        </v-card>

        <v-card >
            <v-data-table dense :headers="tableHeaders" :items="filtered_products"  class="elevation-1" disable-pagination  hide-default-footer :sort-by="['name']" fixed-header height="650" :loading="loading">      
                <template v-slot:[`item.name`]="{ item }">
                    <v-icon :class="'mr-2 fi fib fi-'+item.flag" small :title="$store.getters.getCountryNameByCode(item.flag)"></v-icon><span :class="class_name(item)">{{item.name}}</span>
                </template>  
                <template v-slot:[`item.type`]="{ item }">
                    {{ $store.getters.getObjectPropertyByUrl("productstypes",item.productstypes,"localname")}}
                </template>                                    
                <template v-slot:[`item.last_datetime`]="{ item }">
                    {{localtime(item.last_datetime)}}
                </template>     
                <template v-slot:[`item.last`]="{ item }">
                    <div v-html="currency_html(item.last, item.currency)"></div>
                </template>     
                <template v-slot:[`item.percentage_last_year`]="{ item }">
                    <div v-html="percentage_html(item.percentage_last_year )"></div>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small @click="favoriteProduct(item)" :color="(favorites.includes(item.url))? 'orange': '' " class="mr-1">mdi-star-outline</v-icon>
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
                    { text: this.$t('Id'), value: 'id',sortable: true },
                    { text: this.$t('Name'), value: 'name',sortable: true},
                    { text: this.$t('Type'), value: 'type',sortable: true},
                    { text: this.$t('ISIN'),  sortable: true, value: 'isin'},
                    { text: this.$t('Last datetime'), value: 'last_datetime',sortable: true,width:"10%"},
                    { text: this.$t('Last'), value: 'last',sortable: true,align:"right",width:"6%"},
                    { text: this.$t('% last year'), value: 'percentage_last_year',sortable: true, align:"right",width:"6%"},
                    { text: 'Yahoo',  sortable: true, value: 'ticker_yahoo',width:"6%"},
                    { text: 'Morningstar',  sortable: true, value: 'ticker_morningstar',width:"6%"},
                    { text: 'Google',  sortable: true, value: 'ticker_google',width:"6%"},
                    { text: 'QueFondos',  sortable: true, value: 'ticker_quefondos',width:"6%"},
                    { text: 'Investing.com',  sortable: true, value: 'ticker_investingcom',width:"6%"},
                    { text: this.$t('Actions'), value: 'actions', sortable: false ,width:"6%"},
                ],   
                products: [],
                items: this.menuinline_items(),
                loading: false,
                key:0,
                favorites: [],

                obsolete_filter_items:[
                    {id:1, name: this.$t('Only active products')},
                    {id:2, name: this.$t('Only obsolete products')},
                    {id:3, name: this.$t('All products')},
                ],       
                obsolete_filter:1,


                //DIALOG PRODUCTS VIEW
                dialog_productsview:false,
                product:null,

                //DIALOG PRODUCTS CU
                dialog_products_cu:false,
                product_cu_mode:null,
                product_cu_system:null,
            }
        },
        computed:{
            disabled_check: function (){
                if ([":PERSONAL",":INVESTMENTS",":FAVORITES",":ACTIVE_INVESTMENTS"].includes(this.search)){
                    return true
                }
                return false
            },
            filtered_products: function (){
                if (this.obsolete_filter==1){ //Only active
                    return this.products.filter(o=> o.obsolete==false)
                } else if (this.obsolete_filter==2){ //Only obsolete
                    return this.products.filter(o=> o.obsolete==true)
                }
                return this.products
            },
        },
        methods: {
            menuinline_items()  {
                var r=[
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
                                    this_.search=":FAVORITES"
                                    this_.refreshSearch()
                                },
                                icon: "mdi-star-outline",
                            },
                            {
                                name:this.$t('Active investments products'),
                                code: function(this_){
                                    this_.search=":ACTIVE_INVESTMENTS"
                                    this_.refreshSearch()
                                },
                                icon: "mdi-plus",
                            },
                            {
                                name:this.$t('All investments products'),
                                code: function(this_){
                                    this_.search=":INVESTMENTS"
                                    this_.refreshSearch()
                                },
                                icon: "mdi-plus",
                            },
                            {
                                name:this.$t('Personal products'),
                                code: function(this_){
                                    this_.search=":PERSONAL"
                                    this_.refreshSearch()
                                },
                                icon: "mdi-plus",
                            },
                        ]
                    },
                ]
                if (this.$store.state.catalog_manager==false){
                    r[0].children.splice(1, 1)
                }
                return r
            },
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
            on_ProductsCU_cruded(){
                this.loading=true
                this.dialog_products_cu=false,
                this.$store.dispatch("getProducts").then(() => {
                    this.refreshSearch()
                })
            },
            refreshSearch(){         
                this.loading=true
                this.products=[]

                if (this.search==null || this.search==""){
                    this.loading=false
                } else {

                    axios.get(`${this.$store.state.apiroot}/api/products/search_with_quotes/?search=${this.search}`, this.myheaders())
                    .then((response) => {
                            response.data.data.forEach(o=>{
                                var p=this.$store.getters.getObjectByUrl("products",o.product)
                                p.last=o.last
                                p.last_datetime=o.last_datetime
                                p.percentage_last_year=o.percentage_last_year
                                this.products.push(p)
                            })
                            this.loading=false
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
            },
            getFavoritesList(){
                this.loading=true
                return axios.get(`${this.$store.state.apiroot}/products/favorites/`, this.myheaders())
                .then((response) => {
                        this.favorites=response.data.data
                        this.loading=false
                }, (error) => {
                    this.parseResponseError(error)
                })
            },

        },
        created(){
            this.getFavoritesList()

        }
        
    }
</script>

