<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid">
                <v-text-field data-test="StrategyCU_Name" density="compact" :readonly="deleting" v-model="newstrategy.name" :label="$t('Set strategy name')" :placeholder="$t('Set strategy name')" :rules="RulesString(200,true)" counter="200" autofocus/>
                <v-autocomplete data-test="StrategyCU_Investments" v-if="[2].includes(newstrategy.type)" density="compact" :readonly="deleting" :items="getArrayFromMap(useStore().investments)" v-model="newstrategy.investments" :label="$t('Select strategy investments')" item-title="fullname" item-value="url" multiple chips />
                <v-autocomplete data-test="StrategyCU_Accounts" v-if="[4].includes(newstrategy.type)" :readonly="deleting" density="compact" :items="getArrayFromMap(useStore().accounts)" v-model="newstrategy.accounts" :label="$t('Select strategy accounts')" item-title="fullname" item-value="url" multiple chips />
                <v-row class="d-flex flex-row mx-auto" justify="center">
                    <MyDateTimePicker class="mr-4" :readonly="deleting" v-model="newstrategy.dt_from" :label="$t('Date and time strategy start')" />                
                    <MyDateTimePicker data-test="StrategyCU_DtTo" :readonly="deleting" v-model="newstrategy.dt_to" :label="$t('Date and time strategy end')" :clearable="true" />
                </v-row>
                <v-select data-test="StrategyCU_Type" :readonly="deleting" density="compact" :items="getArrayFromMap(useStore().strategiestypes)" v-model="newstrategy.type" :label="$t('Select strategy type')" item-title="name" item-value="id" :rules="RulesSelection(true)"></v-select>
                <v-textarea data-test="StrategyCU_Comment" :readonly="deleting" density="compact" v-model="newstrategy.comment" :label="$t('Set strategy comment')" :placeholder="$t('Set strategy comment')" :rules="RulesString(200,false)" counter="200"></v-textarea>
                <v-text-field  :readonly="deleting" density="compact" v-model.number="newstrategy.additional1" v-if="additional_visibility[0]" :label="additional_labels[0]" :placeholder="additional_labels[0]" :rules="RulesInteger(10,false)" counter="10"/>
                <AutocompleteProducts  data-test="StrategyCU_Products" v-model="product" :rules="RulesSelection(true)" v-if="product_visibility" />  
                <v-row class="d-flex flex-row mx-auto" justify="center">
                    <v-text-field class="mr-4" data-test="StrategyCU_Additional2" :readonly="deleting" density="compact" v-model.number="newstrategy.additional2" v-if="additional_visibility[1]" :label="additional_labels[1]" :placeholder="additional_labels[1]" :rules="RulesInteger(10,false)" counter="10"/>
                    <v-text-field class="mr-4" data-test="StrategyCU_Additional3" :readonly="deleting" density="compact" v-model.number="newstrategy.additional3" v-if="additional_visibility[2]" :label="additional_labels[2]" :placeholder="additional_labels[2]" :rules="RulesInteger(10,false)" counter="10"/>
                    <v-text-field data-test="StrategyCU_Additional4" :readonly="deleting" density="compact" v-model.number="newstrategy.additional4" v-if="additional_visibility[3]" :label="additional_labels[3]" :placeholder="additional_labels[3]" :rules="RulesInteger(10,false)" counter="10"/>
                </v-row>
                <v-row class="d-flex flex-row mx-auto" justify="center">
                    <v-text-field data-test="StrategyCU_Additional5" class="mr-5" :readonly="deleting" density="compact" v-model.number="newstrategy.additional5" v-if="additional_visibility[4]" :label="additional_labels[4]" :placeholder="additional_labels[4]" :rules="RulesInteger(10,false)" counter="10"/>
                    <v-select data-test="StrategyCU_RecomendationMethod" class="mr-5" :items="getArrayFromMap(useStore().recomendation_methods)" v-model="recomendation_method"  item-title="name" item-value="id" :rules="RulesSelection(true)" v-if="recomendation_method_visibility" :label="this.$t('Select a recomendation method')"></v-select>  
                    <v-text-field data-test="StrategyCU_Additional6" :readonly="deleting" density="compact" v-model.number="newstrategy.additional6" v-if="additional_visibility[5]" :label="additional_labels[5]" :placeholder="additional_labels[5]" :rules="RulesInteger(10,false)" counter="10"/>
                </v-row>
                <v-text-field data-test="StrategyCU_Additional7" :readonly="deleting" density="compact" v-model.number="newstrategy.additional7" v-if="additional_visibility[6]" :label="additional_labels[6]" :placeholder="additional_labels[6]" :rules="RulesInteger(10,false)" counter="10"/>
                <v-text-field data-test="StrategyCU_Additional8" :readonly="deleting" density="compact" v-model.number="newstrategy.additional8" v-if="additional_visibility[7]" :label="additional_labels[7]" :placeholder="additional_labels[7]" :rules="RulesInteger(10,false)" counter="10"/>
                <v-text-field data-test="StrategyCU_Additional9" :readonly="deleting" density="compact" v-model.number="newstrategy.additional9" v-if="additional_visibility[8]" :label="additional_labels[8]" :placeholder="additional_labels[8]" :rules="RulesInteger(10,false)" counter="10"/>
                <v-text-field data-test="StrategyCU_Additional10" :readonly="deleting" density="compact" v-model.number="newstrategy.additional10" v-if="additional_visibility[9]" :label="additional_labels[9]" :placeholder="additional_labels[9]" :rules="RulesInteger(10,false)" counter="10"/>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn data-test="StrategyCU_Button" v-if="!deleting" color="primary" @click="accept()">{{ button() }}</v-btn>
                <v-btn data-test="StrategyCU_ButtonDelete" v-if="deleting" color="error" @click="deleteStrategy()">{{ $t("Delete") }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import { useStore } from "@/store"
    import MyDateTimePicker from './MyDateTimePicker.vue'
    import AutocompleteProducts from './AutocompleteProducts.vue'
    import { RulesSelection, RulesInteger,RulesString } from 'vuetify_rules'
    import { getArrayFromMap } from '@/functions'
    export default {
        components: {
            MyDateTimePicker,
            AutocompleteProducts,
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
                newstrategy: null,
                editing:false,
                additional_labels:["1","2","3","4","5","6","7","8","9","10"],
                additional_visibility:[true,true,true,true,true,true,true,true,true,true,],

                //Additional  components
                recomendation_method:null,
                recomendation_method_visibility:false,

                product:null,
                product_visibility:false,
            }
        },
        watch:{
            'newstrategy.type': function(){
                this.updateUi()
            },
        },
        methods: {
            useStore,
            getArrayFromMap,
            RulesSelection,
            RulesInteger,
            RulesString,
            title(){
                if (this.deleting) {
                    return this.$t("Deleting strategy")
                } else if (this.editing){
                    return this.$t("Updating strategy")
                } else {
                    return this.$t("Creating a new strategy")
                }
            },
            button(){
                if (this.editing){
                    return this.$t("Update")
                } else {
                    return this.$t("Add")
                }
            },
            accept(){
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }
                if ([1,2,3].includes(this.newstrategy.type) && this.newstrategy.investments.length==0) {
                    alert(this.$t("You must select at least one investment."))
                    return
                }
                if ([4].includes(this.newstrategy.type) && this.newstrategy.accounts.length==0) {
                    alert(this.$t("You must select at least one account."))
                    return
                }

                //Update additional components
                if (this.newstrategy.type==3){//Generic

                } else if (this.newstrategy.type==2){//Product ranges
                    this.newstrategy.additional5=this.recomendation_method
                    this.newstrategy.additional1=this.id_from_hyperlinked_url(this.product)
                } else if (this.newstrategy.type==1){//Product pairs
                }
                if (this.editing==true){
                    axios.put(this.newstrategy.url, this.newstrategy,  this.myheaders())
                    .then(() => {
                            this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else{
                    axios.post(`${this.useStore().apiroot}/api/strategies/`, this.newstrategy,  this.myheaders())
                    .then(() => {
                           this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
            },
            deleteStrategy() {
               var r = confirm(this.$t("This strategy will be deleted. Do you want to continue?"))
               if(r == false) {
                  return
               } 
                axios.delete(this.strategy.url, this.myheaders())
                .then(() => {
                    this.$emit("cruded")
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            updateUi(){
                if (this.newstrategy.type==3){//Generic
                    this.additional_labels=[
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                    ]
                    this.additional_visibility=[false,false,false,false,false,false,false,false,false,false,]
                    this.recomendation_method_visibility=false
                    this.product_visibility=false
                } else if (this.newstrategy.type==2){//Product ranges
                    this.additional_labels=[
                        this.$t("Product"),
                        this.$t("Percentage between ranges x1000"),
                        this.$t("Percentage gains x1000"),
                        this.$t("Amount"),
                        this.$t("Recomendation method"),
                        this.$t("Only first"),
                        "",
                        "",
                        "",
                        "",
                    ]
                    this.additional_visibility=[false,true,true,true,false,true,false,false,false,false,]
                    this.recomendation_method_visibility=true
                    this.recomendation_method=this.newstrategy.additional5
                    this.product_visibility=true
                    this.product=this.hyperlinked_url("products", this.newstrategy.additional1)

                } else if (this.newstrategy.type==1){//Product pairs
                    this.additional_labels=[
                        this.$t("Worse product"),
                        this.$t("Best product"),
                        this.$t("Account"),
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                    ]
                    this.additional_visibility=[true,true,true,false,false,false,false,false,false,false,]
                    this.recomendation_method_visibility=false
                    this.product_visibility=false                
                } else if (this.newstrategy.type==4){//Fast operations
                    this.additional_labels=[
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                    ]
                    this.additional_visibility=[false,false,false,false,false,false,false,false,false,false,]
                    this.recomendation_method_visibility=false
                    this.product_visibility=false

                }
            },
        },
        created(){
            if ( this.strategy.url!=null){ // EDITING TIENE IO URL
                this.editing=true
            } else { // NEW IO BUT SETTING VALUES WITH URL=null
                this.editing=false
            }
            this.newstrategy=Object.assign({},this.strategy)
        },
        mounted(){
            console.warn(this.getArrayFromMap(this.useStore().recomendation_methods))
            this.updateUi()
        }
    }
</script>

