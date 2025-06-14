<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid">
                <v-text-field data-test="StrategyFastOperationsCU_Name"  :readonly="mode=='D'" v-model="new_strategy.strategy.name" :label="$t('Set strategy name')" :placeholder="$t('Set strategy name')" :rules="RulesString(200,true)" counter="200" autofocus/>
                <v-row class="d-flex flex-row mx-auto mt-2" justify="center">
                    <MyDateTimePicker class="mr-4" :readonly="mode=='D'" v-model="new_strategy.strategy.dt_from" :label="$t('Date and time strategy start')" />                
                    <MyDateTimePicker data-test="StrategyFastOperationsCU_DtTo" :readonly="mode=='D'" v-model="new_strategy.strategy.dt_to" :label="$t('Date and time strategy end')" :clearable="true" />
                </v-row>
                <v-select data-test="StrategyFastOperationsCU_Type" readonly :items="getArrayFromMap(useStore().strategiestypes)" v-model="new_strategy.strategy.type" :label="$t('Select strategy type')" item-title="name" item-value="id" :rules="RulesSelection(true)"></v-select>
                <v-textarea data-test="StrategyFastOperationsCU_Comment" :readonly="mode=='D'" v-model="new_strategy.strategy.comment" :label="$t('Set strategy comment')" :placeholder="$t('Set strategy comment')" :rules="RulesString(200,false)" counter="200"></v-textarea>

                <v-autocomplete data-test="StrategyFastOperationsCU_Account" :readonly="mode=='D'" :items="getArrayFromMap(useStore().accounts)" v-model="new_strategy.accounts" multiple :label="$t('Select strategy accounts')" item-title="name" item-value="url" :rules="RulesSelection(true)" />

            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn data-test="StrategyFastOperationsCU_Button" color="primary" @click="accept()">{{ button() }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import { useStore } from "@/store"
    import MyDateTimePicker from './MyDateTimePicker.vue'
    import { RulesSelection, RulesInteger,RulesString } from 'vuetify_rules'
    import { getArrayFromMap, parseResponseError, myheaders } from '@/functions'
    export default {
        components: {
            MyDateTimePicker,
        },
        props: {
            // An account object
            strategy: {
                required: true // Null to create, io object to update
            },
            mode: { // CDRU
                required: true,
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
                    axios.post(`${this.useStore().apiroot}/api/strategies_fastoperations/`, this.new_strategy,  this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="D"){
                    var r = confirm(this.$t("This fast operations strategy will be deleted. Do you want to continue?"))
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

