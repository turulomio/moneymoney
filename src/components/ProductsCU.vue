<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid">              
                <v-text-field data-test="ProductsCU_Name" density="compact" :readonly="mode=='D'" v-model="new_product.name" :label="$t('Set product name')" :placeholder="$t('Set product name')" :rules="RulesString(200,true)" counter="200" autofocus/>
                <v-text-field data-test="ProductsCU_ISIN" density="compact" :readonly="mode=='D'" v-model="new_product.isin" :label="$t('Set product isin')" :placeholder="$t('Set product isin')" :rules="RulesString(200,false)" counter="200" />
                <v-autocomplete data-test="ProductsCU_Currency" :items="useStore().currencies" :readonly="mode=='D'" v-model="new_product.currency" :label="$t('Select a currency')" item-title="fullname" item-value="code" :rules="RulesSelection(true)"></v-autocomplete>
                <v-autocomplete data-test="ProductsCU_ProductsTypes" :items="getArrayFromMap(useStore().productstypes)" :readonly="mode=='D'" v-model="new_product.productstypes" :label="$t('Select a product type')" item-title="name" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <v-text-field data-test="ProductsCU_Agrupations" density="compact" :readonly="mode=='D'" v-model="new_product.agrupations" :label="$t('Set product agrupations')" :placeholder="$t('Set product agrupations')" :rules="RulesString(200,false)" counter="200"/>
                <v-text-field data-test="ProductsCU_Web" density="compact" :readonly="mode=='D'" v-model="new_product.web" :label="$t('Set product web')" :placeholder="$t('Set product web')" :rules="RulesString(200,false)" counter="200"/>
                <v-text-field data-test="ProductsCU_Address" density="compact" :readonly="mode=='D'" v-model="new_product.address" :label="$t('Set product address')" :placeholder="$t('Set product address')" :rules="RulesString(200,false)" counter="200"/>
                <v-text-field data-test="ProductsCU_Phone" density="compact" :readonly="mode=='D'" v-model="new_product.phone" :label="$t('Set product phone')" :placeholder="$t('Set product phone')" :rules="RulesString(200,false)" counter="200"/>                                                
                <v-text-field data-test="ProductsCU_Mail" density="compact" :readonly="mode=='D'" v-model="new_product.mail" :label="$t('Set product mail')" :placeholder="$t('Set product mail')" :rules="RulesString(200,false)" counter="200"/>
                <v-text-field ata-tesdt="ProductsCU_Percentage" density="compact" :readonly="mode=='D'" v-model.number="new_product.percentage" :label="$t('Set product percentage')" :placeholder="$t('Set product percentage')" :rules="RulesInteger(3,true)" counter="3" />
                <v-autocomplete data-test="ProductsCU_ProductsStrategies" :items="getArrayFromMap(useStore().productsstrategies)" :readonly="mode=='D'" v-model="new_product.productsstrategies" :label="$t('Select a product strategy')" item-title="localname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>

                <v-autocomplete data-test="ProductsCU_Leverages" :items="getArrayFromMap(useStore().leverages)" :readonly="mode=='D'" v-model="new_product.leverages" :label="$t('Select a product leverage')" item-title="localname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <AutocompleteStockMarkets data-test="ProductsCU_Stockmarkets" class="mr-5" v-model="new_product.stockmarkets" :rules="RulesSelection(true)"  />

                <v-textarea data-test="ProductsCU_Comment" :readonly="mode=='D'" density="compact" v-model="new_product.comment" :label="$t('Set product comment')" :placeholder="$t('Set product comment')" :rules="RulesString(200,false)" counter="200"></v-textarea>
                <v-checkbox data-test="ProductsCU_Obsolete" v-model="new_product.obsolete" :readonly="mode=='D'" :label="$t('Is obsolete?')" ></v-checkbox>
                <v-text-field data-test="ProductsCU_Decimals" density="compact" :readonly="mode=='D'" v-model.number="new_product.decimals"  :label="$t('Set product decimals')" :placeholder="$t('Set product decimals')" :rules="RulesInteger(1,true)" counter="1" />
                <v-text-field data-test="ProductsCU_TickerYahoo" density="compact" :readonly="mode=='D'" v-model="new_product.ticker_yahoo" :label="$t('Set Yahoo ticker')" :placeholder="$t('Set Yahoo ticker')" :rules="RulesString(200,false)" counter="200"/>
                <v-text-field data-test="ProductsCU_TickerMorningstar" density="compact" :readonly="mode=='D'" v-model="new_product.ticker_morningstar" :label="$t('Set Morningstar ticker')" :placeholder="$t('Set Morningstar ticker')" :rules="RulesString(200,false)" counter="200"/>
                <v-text-field data-test="ProductsCU_TickerGoogle" density="compact" :readonly="mode=='D'" v-model="new_product.ticker_google" :label="$t('Set Google ticker')" :placeholder="$t('Set Google ticker')" :rules="RulesString(200,false)" counter="200"/>
                <v-text-field data-test="ProductsCU_QueFondos" density="compact" :readonly="mode=='D'" v-model="new_product.ticker_quefondos" :label="$t('Set Que Fondos ticker')" :placeholder="$t('Set Que Fondos ticker')" :rules="RulesString(200,false)" counter="200"/>
                <v-text-field data-test="ProductsCU_InvestingCom" density="compact" :readonly="mode=='D'" v-model="new_product.ticker_investingcom" :label="$t('Set Investing.com ticker')" :placeholder="$t('Set Investing.com ticker')" :rules="RulesString(200,false)" counter="200"/>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn data-test="ProductsCU_Button" color="primary" @click="accept()">{{ button() }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import { useStore } from "@/store"
    import AutocompleteStockMarkets from './AutocompleteStockMarkets.vue'
    import { RulesSelection, RulesInteger, RulesString} from 'vuetify_rules'
    export default {
        components: {
            AutocompleteStockMarkets
        },
        props: {
            // An account object
            product: { //Full object
                required: true // Null to create, io object to update
            },
            mode: { // C R U D
                required: true,
                
            },
            system: {  // true for system products, false for personal products
                required: false,
                default: false,
            }
        },
        data(){ 
            return {
                form_valid:false,
                new_product: null,

            }
        },
        methods: {
            useStore,
            RulesSelection,
            RulesInteger,
            RulesString,
            title(){
                if (this.system){
                    if (this.mode=="D") {
                        return this.$t("Deleting a system product")
                    } else if (this.mode=="U"){
                        return this.$t("Updating a system product")
                    } else if (this.mode=="C") {
                        return this.$t("Creating a new system product")
                    }
                } else {
                    if (this.mode=="D") {
                        return this.$t("Deleting a personal product")
                    } else if (this.mode=="U"){
                        return this.$t("Updating a personal product")
                    } else if (this.mode=="C"){
                        return this.$t("Creating a new personal product")
                    }
                }
            },
            button(){
                if (this.mode=="D") {
                    return this.$t("Delete")
                } else if (this.mode=="U"){
                    return this.$t("Update")
                } else if (this.mode=="C") {
                    return this.$t("Create")
                }
            },
            accept(){

                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }
                this.new_product.system=this.system
                if (this.mode=="U"){
                    axios.put(this.new_product.url, this.new_product,  this.myheaders())
                    .then((response) => {
                        this.useStore().products.set(response.data.url,response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="C"){
                    axios.post(`${this.useStore().apiroot}/api/products/`, this.new_product,  this.myheaders())
                    .then((response) => {
                        console.log(response.data)
                        this.useStore().products.set(response.data.url,response.data)
                        console.log(this.useStore().products.get(response.data.url))
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="D"){
                    var r = confirm(this.$t("This product will be deleted. Do you want to continue?"))
                    if(r == false) {
                        return
                    } 
                    axios.delete(this.product.url, this.myheaders())
                    .then((response) => {
                        this.useStore().products.delete(response.data.url,response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                }
            },
        },
        created(){
            this.new_product=Object.assign({},this.product)
        },
    }
</script>

