<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid">                
                <v-text-field data-test="StrategyProductsRangeCU_Name"  :readonly="mode=='D'" v-model="new_strategy.strategy.name" :label="$t('Set strategy name')" :placeholder="$t('Set strategy name')" :rules="RulesString(200,true)" counter="200" autofocus/>
                <v-row class="d-flex flex-row mx-auto mt-2" justify="center">
                    <MyDateTimePicker class="mr-4" :readonly="mode=='D'" v-model="new_strategy.strategy.dt_from" :label="$t('Date and time strategy start')" />                
                    <MyDateTimePicker data-test="StrategyProductsRangeCU_DtTo" :readonly="mode=='D'" v-model="new_strategy.strategy.dt_to" :label="$t('Date and time strategy end')" :clearable="true" />
                </v-row>
                <v-select data-test="StrategyProductsRangeCU_Type" readonly :items="getArrayFromMap(useStore().strategiestypes)" v-model="new_strategy.strategy.type" :label="$t('Select strategy type')" item-title="name" item-value="id" :rules="RulesSelection(true)"></v-select>
                <v-textarea data-test="StrategyProductsRangeCU_Comment" :readonly="mode=='D'" v-model="new_strategy.strategy.comment" :label="$t('Set strategy comment')" :placeholder="$t('Set strategy comment')" :rules="RulesString(200,false)" counter="200"></v-textarea>
                
                <AutocompleteProducts data-test="StrategyProductsRangeCU_Product" v-model="new_strategy.product" />  
                <AutocompleteInvestments data-test="StrategyProductsRangeCU_Investments" v-model="new_strategy.investments" multiple />  
                
                
                <v-row class="d-flex flex-row mx-auto" justify="center">
                    <v-text-field class="mr-4" data-test="StrategyProductsRangeCU_PercentageBetweenRanges" :readonly="mode=='D'" v-model.number="new_strategy.percentage_between_ranges" :label="$t('Set percentage between ranges (0.05 for example)')" :placeholder="$t('Set percentage between ranges (0.05 for example)')" :rules="RulesFloat(10,false, 6)" counter="10"/>
                    <v-text-field class="mr-4" data-test="StrategyProductsRangeCU_PercentageGains" :readonly="mode=='D'" v-model.number="new_strategy.percentage_gains" :label="$t('Set percentage gains (0.1 for example)')" :placeholder="$t('Set percentage between ranges (0.1 for example)')" :rules="RulesFloat(10,false, 6)" counter="10"/>
                    <v-text-field class="mr-4" data-test="StrategyProductsRangeCU_Amount" :readonly="mode=='D'" v-model.number="new_strategy.amount" :label="$t('Set range amount')" :placeholder="$t('Set range amount')" :rules="RulesFloat(10,false, 6)" counter="10"/>
                </v-row>

                <v-row class="d-flex flex-row mx-auto" justify="center">
                    <v-select data-test="StrategyProductsRangeCU_RecomendationMethod" class="mr-5" :items="getArrayFromMap(useStore().recomendation_methods)" v-model="new_strategy.recomendation_method"  item-title="name" item-value="id" :rules="RulesSelection(true)" :label="$t('Select a recomendation method')" /> 
                    <v-checkbox v-model="new_strategy.only_first" :label="$t('Show only first reinvestment')" /> 
                </v-row>
            </v-form>
            <v-card-actions>
                <v-btn data-test="StrategyProductsRangeCU_Button" color="primary" @click="accept()">{{ button() }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import { useStore } from "@/store"
    import MyDateTimePicker from './MyDateTimePicker.vue'
    import AutocompleteProducts from './AutocompleteProducts.vue'
    import AutocompleteInvestments from '@/components/AutocompleteInvestments.vue'
    import { RulesSelection, RulesInteger,RulesString, RulesFloat } from 'vuetify_rules'
    import { getArrayFromMap, parseResponseError, myheaders } from '@/functions'
    export default {
        components: {
            MyDateTimePicker,
            AutocompleteProducts,
            AutocompleteInvestments,
        },
        props: {
            // An account object
            strategy: {
                required: true // Null to create, io object to update
            },
            deleting: {
                required: false,
                default:false,
            },
        },
        data(){ 
            return {
                form_valid:false,
                new_strategy: null,
            }
        },
        methods: {
            useStore,
            getArrayFromMap,
            RulesSelection,
            RulesFloat,
            RulesInteger,
            RulesString,
            parseResponseError,
            myheaders,           
             title(){
                if (this.mode=="U"){
                    return this.$t("Updating strategy")
                } else  if (this.mode=="C"){
                    return this.$t("Creating a new strategy")
                } else  if (this.mode=="D"){
                    return this.$t("Deleting strategy")
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
            accept(){
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }
                if (this.mode=="U"){
                    axios.put(this.new_strategy.url, this.new_strategy,  this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="C"){
                    axios.post(`${this.useStore().apiroot}/api/strategies_productsrange/`, this.new_strategy,  this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="D"){
                    var r = confirm(this.$t("This products range strategy will be deleted. Do you want to continue?"))
                    if(r == false) {
                        return
                    } 
                    axios.delete(this.new_strategy.url, this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                }

            },
        },
        created(){
            this.new_strategy=Object.assign({},this.strategy)
        },
    }
</script>

