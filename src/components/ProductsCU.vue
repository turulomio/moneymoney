<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid">              
                <v-text-field density="compact" :readonly="mode=='D'" v-model="newproduct.name" :label="$t('Set product name')" :placeholder="$t('Set product name')" :rules="RulesString(200,true)" counter="200" autofocus/>
                <v-text-field density="compact" :readonly="mode=='D'" v-model="newproduct.isin" :label="$t('Set product isin')" :placeholder="$t('Set product isin')" :rules="RulesString(200,false)" counter="200" />
                <v-autocomplete :items="store().currencies" :readonly="mode=='D'" v-model="newproduct.currency" :label="$t('Select a currency')" item-title="fullname" item-value="code" :rules="RulesSelection(true)"></v-autocomplete>
                <v-autocomplete :items="getArrayFromMap(store().productstypes)" :readonly="mode=='D'" v-model="newproduct.productstypes" :label="$t('Select a product type')" item-title="name" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <v-text-field density="compact" :readonly="mode=='D'" v-model="newproduct.agrupations" :label="$t('Set product agrupations')" :placeholder="$t('Set product agrupations')" :rules="RulesString(200,false)" counter="200"/>
                <v-text-field density="compact" :readonly="mode=='D'" v-model="newproduct.web" :label="$t('Set product web')" :placeholder="$t('Set product web')" :rules="RulesString(200,false)" counter="200"/>
                <v-text-field density="compact" :readonly="mode=='D'" v-model="newproduct.address" :label="$t('Set product address')" :placeholder="$t('Set product address')" :rules="RulesString(200,false)" counter="200"/>
                <v-text-field density="compact" :readonly="mode=='D'" v-model="newproduct.phone" :label="$t('Set product phone')" :placeholder="$t('Set product phone')" :rules="RulesString(200,false)" counter="200"/>                                                
                <v-text-field density="compact" :readonly="mode=='D'" v-model="newproduct.mail" :label="$t('Set product mail')" :placeholder="$t('Set product mail')" :rules="RulesString(200,false)" counter="200"/>
                <v-text-field density="compact" :readonly="mode=='D'" v-model.number="newproduct.percentage" :label="$t('Set product percentage')" :placeholder="$t('Set product percentage')" :rules="RulesInteger(3,true)" counter="3" />
                <v-text-field density="compact" :readonly="mode=='D'" v-model="newproduct.pci"  :label="$t('Set product pci')" :placeholder="$t('Set product pci')" :rules="RulesString(true)" counter="200" />

                <v-autocomplete :items="getArrayFromMap(store().leverages)" :readonly="mode=='D'" v-model="newproduct.leverages" :label="$t('Select a product leverage')" item-title="localname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <AutocompleteStockMarkets class="mr-5" v-model="newproduct.stockmarkets" :rules="RulesSelection(true)"  />

                <v-textarea :readonly="mode=='D'" density="compact" v-model="newproduct.comment" :label="$t('Set product comment')" :placeholder="$t('Set product comment')" :rules="RulesString(200,false)" counter="200"></v-textarea>
                <v-checkbox v-model="newproduct.obsolete" :readonly="mode=='D'" :label="$t('Is obsolete?')" ></v-checkbox>
                <v-text-field density="compact" :readonly="mode=='D'" v-model.number="newproduct.decimals"  :label="$t('Set product decimals')" :placeholder="$t('Set product decimals')" :rules="RulesInteger(1,true)" counter="1" />
                <v-text-field density="compact" :readonly="mode=='D'" v-model="newproduct.ticker_yahoo" :label="$t('Set Yahoo ticker')" :placeholder="$t('Set Yahoo ticker')" :rules="RulesString(200,false)" counter="200"/>
                <v-text-field density="compact" :readonly="mode=='D'" v-model="newproduct.ticker_morningstar" :label="$t('Set Morningstar ticker')" :placeholder="$t('Set Morningstar ticker')" :rules="RulesString(200,false)" counter="200"/>
                <v-text-field density="compact" :readonly="mode=='D'" v-model="newproduct.ticker_google" :label="$t('Set Google ticker')" :placeholder="$t('Set Google ticker')" :rules="RulesString(200,false)" counter="200"/>
                <v-text-field density="compact" :readonly="mode=='D'" v-model="newproduct.ticker_quefondos" :label="$t('Set Que Fondos ticker')" :placeholder="$t('Set Que Fondos ticker')" :rules="RulesString(200,false)" counter="200"/>
                <v-text-field density="compact" :readonly="mode=='D'" v-model="newproduct.ticker_investingcom" :label="$t('Set Investing.com ticker')" :placeholder="$t('Set Investing.com ticker')" :rules="RulesString(200,false)" counter="200"/>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="accept()">{{ button() }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
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
                newproduct: null,

            }
        },
        methods: {
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
                this.newproduct.system=this.system
                if (this.mode=="U"){
                    axios.put(this.newproduct.url, this.newproduct,  this.myheaders())
                    .then((response) => {
                        this.store().products.set(response.data.url,response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="C"){
                    axios.post(`${this.store().apiroot}/api/products/`, this.newproduct,  this.myheaders())
                    .then((response) => {
                        this.store().products.set(response.data.url,response.data)
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
                        this.store().products.delete(response.data.url,response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                }
            },
        },
        created(){
            this.newproduct=Object.assign({},this.product)
        },
    }
</script>

