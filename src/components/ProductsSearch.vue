<template>
    <div>
        <h1>{{ $t("Products search")}}
            <MyMenuInline :items="items" :context="this"></MyMenuInline>
        </h1>

        <v-card width="65%" class="pa-8 ma-3 mx-auto">
                <v-row>
                    <v-text-field :disabled="loading" name="search" v-model="search" :label="$t('Search products')"  :placeholder="$t('Enter a string')" autofocus @keyup.enter="refreshSearch()" clearable></v-text-field>
                    <div width="10px">
                        <v-select :items="obsolete_filter_items" v-model="obsolete_filter" class="ml-4" :disabled="loading" :label="$t('Filter by status')"  item-title="name" item-value="id" :rules="RulesSelection(true)"></v-select>  
                    </div>
                    <v-btn :disabled="loading"  class="ml-4" color="error" @click="refreshSearch()">{{ $t("Search") }}</v-btn>
                </v-row>
        </v-card>

        <v-card >
            <v-data-table density="compact" :headers="tableHeaders" :items="filtered_products" class="elevation-1 cursorpointer" :sort-by="[{key:'name',order:'asc'}]" fixed-header height="650" :loading="loading"  @click:row="viewProduct"    :items-per-page="10000" >
                <template #item.name="{item}">
                    <v-icon :class="'mr-2 fi fib fi-'+item.flag" small :title="this.getCountryNameByCode(item.flag)"></v-icon><span :class="class_name(item)">{{item.name}}</span>
                </template>  
            <template #item.type="{item}">
                    {{ this.store().productstypes.get(item.productstypes).localname }}
                </template>                                    
            <template #item.last_datetime="{item}">
                    {{localtime(item.last_datetime)}}
                </template>     
            <template #item.last="{item}">
                    <div class="text-right" v-html="currency_html(item.last, item.currency)"></div>
                </template>     
            <template #item.percentage_last_year="{item}">
                    <div class="text-right" v-html="percentage_html(item.percentage_last_year )"></div>
                </template>
            <template #item.actions="{item}">
                    <v-icon small @click.stop="toggleFavorite(item)" :color="(store().profile.favorites.includes(item.url))? 'orange': '' " class="mr-1">mdi-star-outline</v-icon>
                    <v-icon class="mr-1" small @click.stop="editPersonalProduct(item)" v-if="item.id>0">mdi-pencil</v-icon>
                    <v-icon class="mr-1" small @click.stop="editSystemProduct(item)"  color="#AA0000" v-if="item.id<=0 && store().catalog_manager">mdi-pencil</v-icon>
                    <v-icon class="mr-1" small @click.stop="deletePersonalProduct(item)" v-if="item.id>0 && item.uses==0">mdi-delete</v-icon>
                    <v-icon class="mr-1" small @click.stop="deleteSystemProduct(item)" color="#AA0000" v-if="item.id<=0 && store().catalog_manager">mdi-delete</v-icon>
                </template>
                <template #bottom ></template>   
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
                search: ":FAVORITES",
                tableHeaders: [
                    { title: this.$t('Id'), key: 'id',sortable: true },
                    { title: this.$t('Name'), key: 'name',sortable: true},
                    { title: this.$t('Type'), key: 'type',sortable: true},
                    { title: this.$t('ISIN'),  sortable: true, key: 'isin'},
                    { title: this.$t('Last datetime'), key: 'last_datetime',sortable: true,width:"10%"},
                    { title: this.$t('Last'), key: 'last',sortable: true,align:'end',width:"6%"},
                    { title: this.$t('% last year'), key: 'percentage_last_year',sortable: true, align:'end',width:"6%"},
                    { title: 'Yahoo',  sortable: true, key: 'ticker_yahoo',width:"6%"},
                    { title: 'Morningstar',  sortable: true, key: 'ticker_morningstar',width:"6%"},
                    { title: 'Google',  sortable: true, key: 'ticker_google',width:"6%"},
                    { title: 'QueFondos',  sortable: true, key: 'ticker_quefondos',width:"6%"},
                    { title: 'Investing.com',  sortable: true, key: 'ticker_investingcom',width:"6%"},
                    { title: this.$t('Actions'), key: 'actions', sortable: false ,width:"6%"},
                ],   
                products: [],
                items: this.menuinline_items(),
                loading: false,
                key:0,

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
                                code: function(){
                                    this.product=this.empty_product()
                                    this.product_cu_mode="C"
                                    this.product_cu_system=false
                                    this.key=this.key+1
                                    this.dialog_products_cu=true
                                }.bind(this),
                                icon: "mdi-plus",
                            },
                            {
                                name:this.$t('Add a system product'),
                                code: function(){
                                    this.product=this.empty_product()
                                    this.product_cu_mode="C"
                                    this.product_cu_system=true
                                    this.key=this.key+1
                                    this.dialog_products_cu=true
                                }.bind(this),
                                icon: "mdi-plus",
                            },
                        ]
                    },
                    {
                        subheader:this.$t('Especial products'),
                        children: [
                            {
                                name:this.$t('Favorite products'),
                                code: function(){
                                    this.search=":FAVORITES"
                                    this.refreshSearch()
                                }.bind(this),
                                icon: "mdi-star-outline",
                            },
                            {
                                name:this.$t('Active investments products'),
                                code: function(){
                                    this.search=":ACTIVE_INVESTMENTS"
                                    this.refreshSearch()
                                }.bind(this),
                                icon: "mdi-plus",
                            },
                            {
                                name:this.$t('All investments products'),
                                code: function(){
                                    this.search=":INVESTMENTS"
                                    this.refreshSearch()
                                }.bind(this),
                                icon: "mdi-plus",
                            },
                            {
                                name:this.$t('Personal products'),
                                code: function(){
                                    this.search=":PERSONAL"
                                    this.refreshSearch()
                                }.bind(this),
                                icon: "mdi-plus",
                            },
                        ]
                    },
                    {
                        subheader:this.$t('Products by type'),
                        children: [
                            {
                                name:this.$t('Indices'),
                                code: function(){
                                    this.search=":INDICES"
                                    this.refreshSearch()
                                }.bind(this),
                                icon: "mdi-chart-line",
                            },
                            {
                                name:this.$t('CFD & Futures'),
                                code: function(){
                                    this.search=":CFD_FUTURES"
                                    this.refreshSearch()
                                }.bind(this),
                                icon: "mdi-chart-line",
                            },
                            {
                                name:this.$t('ETF'),
                                code: function(){
                                    this.search=":ETF"
                                    this.refreshSearch()
                                }.bind(this),
                                icon: "mdi-chart-line",
                            },
                            {
                                name:this.$t('Bonds'),
                                code: function(){
                                    this.search=":BONDS"
                                    this.refreshSearch()
                                }.bind(this),
                                icon: "mdi-chart-line",
                            },
                            {
                                name:this.$t('Currencies'),
                                code: function(){
                                    this.search=":CURRENCIES"
                                    this.refreshSearch()
                                }.bind(this),
                                icon: "mdi-chart-line",
                            },
                        ]
                    },
                ]
                if (this.store().catalog_manager==false){
                    r[0].children.splice(1, 1)
                }
                return r
            },
            editPersonalProduct(item){
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
            viewProduct(event,object){
                this.product=object.item
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
                this.refreshSearch()
            },
            refreshSearch(){         
                this.loading=true
                this.products=[]

                if (this.search==null || this.search==""){
                    this.loading=false
                } else {

                    axios.get(`${this.store().apiroot}/api/products/search_with_quotes/?search=${this.search}`, this.myheaders())
                    .then((response) => {
                            response.data.forEach(o=>{
                                var p=this.store().products.get(o.product)
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
            toggleFavorite(item){
                this.store().profile.toggle_favorite=item.url //Adds toggle_favorite
                return axios.put(`${this.store().apiroot}/profile/`, this.store().profile, this.myheaders())
                .then(() => {
                        this.store().updateProfile()
                        .then(() => {
                            this.refreshSearch()
                        })
                }, (error) => {
                    this.parseResponseError(error)
                })
            },

        },
        created(){
            this.refreshSearch()

        }
    }
</script>

