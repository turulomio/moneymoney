<template>
  <div>
        <h1 class="mb-2">{{title()}}</h1>
        <v-form ref="form" v-model="form_valid">
            <v-autocomplete data-test="InvestmentsCU_Accounts" :readonly="mode=='D'" :items="getArrayFromMap(useStore().accounts).filter(v =>v.active==true)" v-model="new_investment.accounts" :label="$t('Select an account')" item-title="name" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
            <v-text-field data-test="InvestmentsCU_Name" :readonly="mode=='D'" v-model="new_investment.name" type="text" :label="$t('Investment name')"  :placeholder="$t('Investment name')" autofocus :rules="RulesString(200,true)"/>
            <AutocompleteProducts data-test="InvestmentsCU_Products" :readonly="mode=='D'" v-model="new_investment.products" :rules="RulesSelection(true)"  />
            <v-checkbox data-test="InvestmentsCU_Active" :readonly="mode=='D'" v-model="new_investment.active" :label="$t('Is active?')" ></v-checkbox>
            <v-checkbox data-test="InvestmentsCU_DailyAdjustment" :readonly="mode=='D'" v-model="new_investment.daily_adjustment" :label="$t('Has daily adjustment?')" ></v-checkbox>
            <v-text-field data-test="InvestmentsCU_Number" :readonly="mode=='D'" v-model.number="new_investment.decimals" :label="$t('Set shares decimals')" :placeholder="$t('Set shares decimals')" :rules="RulesInteger(1,true)" counter="1" />
        </v-form>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn data-test="InvestmentsCU_Button" color="primary" @click="acceptDialog()">{{ button() }}</v-btn>
        </v-card-actions>
  </div>
</template>

<script>
    import axios from 'axios'
    import { useStore } from "@/store"
    import AutocompleteProducts from './AutocompleteProducts.vue'
    import { RulesSelection ,RulesInteger, RulesString } from 'vuetify_rules'
    import {parseResponseError, myheaders, getArrayFromMap} from '@/functions.js'
    export default {
        components:{
            AutocompleteProducts,
        },
        props:{
            investment:{ //Object
                required:true,
            },
            mode: {
                required: true // Can be CUD
            }
        },
        data(){ 
            return{
                form_valid: false,
                new_investment:null
            }
        },
        methods:{
            useStore,
            myheaders,
            parseResponseError,
            RulesInteger,
            RulesString,
            RulesSelection,
            getArrayFromMap,
            title(){
                if (this.mode=="U"){
                    return this.$t("Updating investment")
                } else  if (this.mode=="C"){
                    return this.$t("Creating a new investment")
                } else  if (this.mode=="D"){
                    return this.$t("Deleting investment")
                }
            },
            button(){
                if (this.mode=="U"){
                    return this.$t("Update")
                } else  if (this.mode=="C"){
                    return this.$t("Create")
                } else  if (this.mode=="D"){
                    return this.$t("Delete")
                }
            },
            acceptDialog(){
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }
                if (this.mode=="U"){        
                    axios.put(this.new_investment.url, this.new_investment, this.myheaders())
                    .then((response) => {
                        this.useStore().investments.set(response.data.url, response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="C") {
                    axios.post(`${this.useStore().apiroot}/api/investments/`, this.new_investment,  this.myheaders())
                    .then((response) => {
                        this.useStore().investments.set(response.data.url, response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="D") {
                    var r = confirm(this.$t("Do you want to delete this investment?"))
                    if(r == false) {
                        return
                    } 
                    axios.delete(this.new_investment.url, this.myheaders())
                    .then(() => {
                        this.useStore().investments.delete(this.new_investment.url)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                    }
            },
        },
        created(){
            this.new_investment=Object.assign({},this.investment)
        }
    }
</script>
