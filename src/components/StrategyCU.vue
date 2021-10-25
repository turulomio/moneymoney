<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-text-field dense :readonly="deleting" v-model="newstrategy.name" :label="$t('Set strategy name')" :placeholder="$t('Set strategy name')" :rules="RulesString(200,true)" counter="200" autofocus/>
                <v-autocomplete dense :readonly="deleting" :items="$store.state.investments" v-model="temporal_investments" :label="$t('Select strategy investments')" item-text="fullname" item-value="id" multiple :rules="RulesSelection(true)" chips></v-autocomplete>
                <MyDateTimePicker :readonly="deleting" v-model="newstrategy.dt_from" :label="$t('Date and time strategy start')"></MyDateTimePicker>                
                <MyDateTimePicker :readonly="deleting" v-model="newstrategy.dt_to" :label="$t('Date and time strategy end')"></MyDateTimePicker>
                <v-select :readonly="deleting" dense :items="$store.state.strategiestypes" v-model="newstrategy.type" :label="$t('Select strategy type')" item-text="name" item-value="id" :rules="RulesSelection(true)" @change="on_strategy_type_change()"></v-select>
                <v-textarea :readonly="deleting" dense v-model="newstrategy.comment" :label="$t('Set strategy comment')" :placeholder="$t('Set strategy comment')" :rules="RulesString(200,false)" counter="200"></v-textarea>
                <v-text-field :readonly="deleting" dense ref="additional1" v-model.number="newstrategy.additional1" v-if="additional_visibility[0]" :label="additional_labels[0]" :placeholder="additional_labels[0]" :rules="RulesInteger(10,false)" counter="10"/>
                <v-text-field :readonly="deleting" dense ref="additional2" v-model.number="newstrategy.additional2" v-if="additional_visibility[1]" :label="additional_labels[1]" :placeholder="additional_labels[1]" :rules="RulesInteger(10,false)" counter="10"/>
                <v-text-field :readonly="deleting" dense ref="additional3" v-model.number="newstrategy.additional3" v-if="additional_visibility[2]" :label="additional_labels[2]" :placeholder="additional_labels[2]" :rules="RulesInteger(10,false)" counter="10"/>
                <v-text-field :readonly="deleting" dense ref="additional4" v-model.number="newstrategy.additional4" v-if="additional_visibility[3]" :label="additional_labels[3]" :placeholder="additional_labels[3]" :rules="RulesInteger(10,false)" counter="10"/>
                <v-text-field :readonly="deleting" dense ref="additional5" v-model.number="newstrategy.additional5" v-if="additional_visibility[4]" :label="additional_labels[4]" :placeholder="additional_labels[4]" :rules="RulesInteger(10,false)" counter="10"/>
                <v-text-field :readonly="deleting" dense ref="additional6" v-model.number="newstrategy.additional6" v-if="additional_visibility[5]" :label="additional_labels[5]" :placeholder="additional_labels[5]" :rules="RulesInteger(10,false)" counter="10"/>
                <v-text-field :readonly="deleting" dense ref="additional7" v-model.number="newstrategy.additional7" v-if="additional_visibility[6]" :label="additional_labels[6]" :placeholder="additional_labels[6]" :rules="RulesInteger(10,false)" counter="10"/>
                <v-text-field :readonly="deleting" dense ref="additional8" v-model.number="newstrategy.additional8" v-if="additional_visibility[7]" :label="additional_labels[7]" :placeholder="additional_labels[7]" :rules="RulesInteger(10,false)" counter="10"/>
                <v-text-field :readonly="deleting" dense ref="additional9" v-model.number="newstrategy.additional9" v-if="additional_visibility[8]" :label="additional_labels[8]" :placeholder="additional_labels[8]" :rules="RulesInteger(10,false)" counter="10"/>
                <v-text-field :readonly="deleting" dense ref="additional10" v-model.number="newstrategy.additional10" v-if="additional_visibility[9]" :label="additional_labels[9]" :placeholder="additional_labels[9]" :rules="RulesInteger(10,false)" counter="10"/>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn v-if="!deleting" color="primary" @click="accept()" :disabled="!form_valid">{{ button() }}</v-btn>
                <v-btn v-if="deleting" color="error" @click="deleteStrategy()" :disabled="!form_valid">{{ $t("Delete") }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import MyDateTimePicker from './MyDateTimePicker.vue'
    import {arrayofintegers_to_stringofintegers,stringofintegers_to_arrayofintegers} from '../functions.js'
    export default {
        components: {
            MyDateTimePicker,
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
                temporal_investments:[],
                additional_labels:["1","2","3","4","5","6","7","8","9","10"],
                additional_visibility:[true,true,true,true,true,true,true,true,true,true,]
            }
        },
        methods: {
            arrayofintegers_to_stringofintegers,
            stringofintegers_to_arrayofintegers,
            title(){
                console.log(this.deleting)
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
                if (this.temporal_investments.length==0) {
                    alert(this.$t("You must select at least one investment."))
                    return
                }
                this.newstrategy.investments=this.arrayofintegers_to_stringofintegers(this.temporal_investments)
                console.log(this.newstrategy.investments)

                if (this.editing==true){
                    axios.put(this.newstrategy.url, this.newstrategy,  this.myheaders())
                    .then((response) => {
                            console.log(response.data)
                            this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else{
                    axios.post(`${this.$store.state.apiroot}/api/strategies/`, this.newstrategy,  this.myheaders())
                    .then((response) => {
                            console.log(response.data)
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
                .then((response) => {
                    console.log(response);
                    this.$emit("cruded")
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            updateUi(){
                console.log("UPDATEUI")
                console.log(this.$refs.additional1)
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
                } else if (this.newstrategy.type==2){//Product ranges
                    this.additional_labels=[
                        this.$t("Product"),
                        this.$t("Percentage between ranges x1000"),
                        this.$t("Percentage gains x1000"),
                        this.$t("Amount"),
                        this.$t("Recomendation method"),
                        this.$t("Only first"),
                        this.$t("Account"),
                        "",
                        "",
                        "",
                    ]
                    this.additional_visibility=[true,true,true,true,true,true,true,false,false,false,]

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

                }
            },
            on_strategy_type_change(){
                this.updateUi()
            }
        },
        created(){
            if ( this.strategy.url!=null){ // EDITING TIENE IO URL
                this.temporal_investments=this.stringofintegers_to_arrayofintegers(this.strategy.investments)
                this.editing=true
            } else { // NEW IO BUT SETTING VALUES WITH URL=null
                this.editing=false
            }
            this.newstrategy=Object.assign({},this.strategy)
        },
        mounted(){
            this.updateUi()
            
        }
    }
</script>

