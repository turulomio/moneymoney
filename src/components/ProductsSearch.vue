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
                <template v-slot:[`item.last`]="{ item }">
                    {{ currency_string(item.last, item.currency)}}
                </template>
                <template v-slot:[`item.name`]="{ item }">
                    <div :class="class_name(item)">{{item.name}}</div>
                </template>  
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small @click="favoriteProduct(item)" :color="(favorites.includes(item.id))? 'orange': '' ">mdi-star-outline</v-icon>
                    <v-icon class="mr-2" small @click="viewProduct(item)">mdi-eye-outline</v-icon>
                    <v-icon class="mr-2" small @click="editProduct(item)" v-if="item.id<0">mdi-pencil</v-icon>
                </template>
            </v-data-table>   
        </v-card>
        <v-dialog v-model="dialog_productsview">
            <v-card class="pa-4">
                <ProductsView :product="product" :key="key"></ProductsView>
            </v-card>
        </v-dialog>
    </div>
</template>  
<script>     
    import axios from 'axios'
    import {ifnullempty} from '../functions.js'
    import {empty_product} from '../empty_objects.js'
    import MyMenuInline from './MyMenuInline.vue'
    import ProductsView from './ProductsView.vue'
    export default {
        components:{
            MyMenuInline,
            ProductsView,
        },
        data () {
            return {
                search: null,
                tableHeaders: [
                    { text: 'Id', value: 'id',sortable: true },
                    { text: 'Name', value: 'name',sortable: true},
                    { text: 'ISIN',  sortable: true, value: 'isin'},
                    { text: 'ticker_yahoo',  sortable: true, value: 'Yahoo'},
                    { text: 'ticker_morningstar',  sortable: true, value: 'Morningstar'},
                    { text: 'ticker_google',  sortable: true, value: 'Google'},
                    { text: 'ticker_quefondos',  sortable: true, value: 'QueFondos'},
                    { text: 'ticker_investingcom',  sortable: true, value: 'InvestingCom'},
                    { text: 'Actions', value: 'actions', sortable: false },
                ],   
                tableData: [],
                items: [
                    {
                        subheader:this.$t('Product orders'),
                        children: [
                            {
                                name:this.$t('Add personal product'),
                                code: function(this_){
                                    this_.product=this_.empty_product()
                                    this_.dialog_productsview=true
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
            }
        },
        methods: {
            editProduct(item){
                console.log(item)
            },
            empty_product,
            ifnullempty,
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
            refreshSearch(){
                this.loading=true
                if (this.search==null){
                    this.tableData=[]
                } else {
                    this.tableData=this.$store.state.products.filter(o => 
                        o.name.toUpperCase().includes(this.search.toUpperCase()) || 
                        (o.ticker_yahoo!=null && o.ticker_yahoo.toString().toUpperCase().includes(this.search.toUpperCase())) ||
                        (o.ticker_morningstar!=null && o.ticker_morningstar.toString().toUpperCase().includes(this.search.toUpperCase())) ||
                        (o.ticker_google!=null && o.ticker_google.toString().toUpperCase().includes(this.search.toUpperCase())) ||
                        (o.ticker_quefondos!=null && o.ticker_quefondos.toString().toUpperCase().includes(this.search.toUpperCase())) ||
                        (o.ticker_investingcom!=null && o.ticker_investingcom.toString().toUpperCase().includes(this.search.toUpperCase())) ||
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
                        console.log(response.data)
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

