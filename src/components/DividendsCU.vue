
<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-autocomplete :readonly="mode=='D'" :items="$store.state.investments" v-model="newdividend.investments" :label="$t('Select an investment')" item-text="fullname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <MyDateTimePicker :readonly="mode=='D'" v-model="newdividend.datetime" :label="$t('Set investment execution date and time')"></MyDateTimePicker>
                <v-autocomplete :readonly="mode=='D'" :items="$store.getters.getConceptsForDividends()" v-model="newdividend.concepts" :label="$t('Select a concept')" item-text="localname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <v-text-field :readonly="mode=='D'" v-model="newdividend.gross"  :label="$t('Set dividend gross balance')" :placeholder="$t('Set dividend gross balance')" :rules="RulesFloat(10,true,2)" counter="10"/>
                <v-text-field :readonly="mode=='D'" v-model="newdividend.net"  :label="$t('Set dividend net balance')" :placeholder="$t('Set dividend net balance')" :rules="RulesFloat(10,true,2)" counter="10"/>
                <v-text-field :readonly="mode=='D'" v-model="newdividend.taxes"  :label="$t('Set dividend taxes')" :placeholder="$t('Set dividend taxes')" :rules="RulesFloatGEZ(10,true,2)" counter="10"/>
                <v-text-field :readonly="mode=='D'" v-model="newdividend.commission"  :label="$t('Set dividend commission')" :placeholder="$t('Set dividend commission')" :rules="RulesFloatGEZ(10,true,2)" counter="10"/>
                <v-text-field :readonly="mode=='D'" v-model="newdividend.dps"  :label="$t('Set dividend per share')" :placeholder="$t('Set dividend per share')" :rules="RulesFloat(10,true,6)" counter="10"/>
                <v-text-field :readonly="mode=='D'" v-model="newdividend.currency_conversion"  :label="$t('Set dividend currency conversion')" :placeholder="$t('Set dividend currency conversion')" :rules="RulesFloat(10,true,6)" counter="10"/>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="accept()" :disabled="!form_valid">{{ button() }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import MyDateTimePicker from './MyDateTimePicker.vue'
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
                if( this.$refs.form.validate()==false) return
                var concept=this.$store.getters.getObjectByUrl("concepts",this.newdividend.concepts)
                var operationtype=this.$store.getters.getObjectByUrl("operationstypes", concept.operationstypes)
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
                    axios.post(`${this.$store.state.apiroot}/api/dividends/`, this.newdividend,  this.myheaders())
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

