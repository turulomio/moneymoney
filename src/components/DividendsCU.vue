
<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid">
                <v-autocomplete :readonly="mode=='D'" :items="getArrayFromMap(useStore().investments)" v-model="newdividend.investments" :label="$t('Select an investment')" item-title="fullname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <MyDateTimePicker :readonly="mode=='D'" v-model="newdividend.datetime" :label="$t('Set investment execution date and time')" />
                <v-autocomplete data-test="DividendsCU_Concepts" :readonly="mode=='D'" :items="this.getConceptsForDividends()" v-model="newdividend.concepts" :label="$t('Select a concept')" item-title="localname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <v-text-field data-test="DividendsCU_Gross" :readonly="mode=='D'" v-model.number="newdividend.gross"  :label="$t('Set dividend gross balance')" :placeholder="$t('Set dividend gross balance')" :rules="RulesFloat(10,true,2)" counter="10"/>
                <v-text-field data-test="DividendsCU_Net" :readonly="mode=='D'" v-model.number="newdividend.net"  :label="$t('Set dividend net balance')" :placeholder="$t('Set dividend net balance')" :rules="RulesFloat(10,true,2)" counter="10"/>
                <v-text-field data-test="DividendsCU_Taxes" :readonly="mode=='D'" v-model.number="newdividend.taxes"  :label="$t('Set dividend taxes')" :placeholder="$t('Set dividend taxes')" :rules="RulesFloatGEZ(10,true,2)" counter="10"/>
                <v-text-field :readonly="mode=='D'" v-model.number="newdividend.commission"  :label="$t('Set dividend commission')" :placeholder="$t('Set dividend commission')" :rules="RulesFloatGEZ(10,true,2)" counter="10"/>
                <v-text-field :readonly="mode=='D'" v-model.number="newdividend.dps"  :label="$t('Set dividend per share')" :placeholder="$t('Set dividend per share')" :rules="RulesFloat(10,true,6)" counter="10"/>
                <v-text-field :readonly="mode=='D'" v-model.number="newdividend.currency_conversion"  :label="$t('Set dividend currency conversion')" :placeholder="$t('Set dividend currency conversion')" :rules="RulesFloat(10,true,6)" counter="10"/>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn data-test="DividendsCU_Button" color="primary" @click="accept">{{ button() }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import { useStore } from "@/store"
    import MyDateTimePicker from './MyDateTimePicker.vue'
    import { RulesSelection,RulesFloat,RulesFloatGEZ } from 'vuetify_rules'
    import { parseResponseError, myheaders,getArrayFromMap,getConceptsForDividends } from '@/functions'
    export default {
        components: {
            MyDateTimePicker,
        },
        props: {
            dividend: {
                required: true
            },
            mode: {
                required: true
            }
        },
        data(){ 
            return {
                form_valid: false,
                newdividend: null,
            }
        },
        methods: {
            useStore,
            parseResponseError,
            RulesSelection,
            RulesFloat,
            RulesFloatGEZ,
            myheaders,
            getArrayFromMap,
            getConceptsForDividends,
            title(){
                if (this.mode=="C") return this.$t("Add a dividend")
                if (this.mode=="U") return this.$t("Update dividend")
                if (this.mode=="D") return this.$t("Delete dividend")
            },
            button(){
                if (this.mode=="C") return this.$t("Add")
                if (this.mode=="U") return this.$t("Update")
                if (this.mode=="D") return this.$t("Delete")
            },
            accept(){           
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }
                var concept=this.useStore().concepts.get(this.newdividend.concepts)
                var operationtype=this.useStore().operationstypes.get(concept.operationstypes)
                if (operationtype.id==1 && (this.newdividend.gross>0 || this.newdividend.net >0)){
                     alert(this.$t("Gross and net must be negative"))
                     return
                }
                if (operationtype.id==2 && (this.newdividend.gross<=0|| this.newdividend.net <=0)) {
                    alert(this.$t("Amount must be positive"))
                    return
                }

                if (this.newdividend.gross==0 && this.newdividend.net!=0) {
                    alert(this.$t("Gross shouldn't be 0 when net is not"))
                    return 
                }
                if (this.newdividend.net==0 && this.newdividend.gross!=0) {
                    alert(this.$t("Net shouldn't be 0 when gross is not"))
                    return
                }

                if (this.mode=="U"){
                    axios.put(this.newdividend.url, this.newdividend,  this.myheaders())
                    .then(() => {
                            this.$emit("cruded")
                            this.editing=false
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="C"){
                    axios.post(`${this.useStore().apiroot}/api/dividends/`, this.newdividend,  this.myheaders())
                    .then(() => {
                            this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="D"){

                    var r = confirm(this.$t("Do you want to delete this dividend?"))
                    if(r == false) {
                        return
                    } 
                        axios.delete(this.newdividend.url, this.myheaders())
                        .then(() => {
                            this.$emit("cruded")
                        }, (error) => {
                            this.parseResponseError(error)
                        });
                }
            },
        },
        created(){
            this.newdividend=Object.assign({},this.dividend)
        }
    }
</script>

