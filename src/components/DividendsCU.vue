
<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-autocomplete :items="$store.state.investments" v-model="newdividend.investments" :label="$t('Select an investment')" item-text="fullname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <MyDateTimePicker v-model="newdividend.datetime" :label="$t('Set investment execution date and time')"></MyDateTimePicker>
                <v-autocomplete :items="$store.getters.getConceptsForDividends()" v-model="newdividend.concepts" :label="$t('Select a concept')" item-text="name" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <v-text-field v-model="newdividend.gross" type="number" :label="$t('Set dividend gross balance')" :placeholder="$t('Set dividend gross balance')" :rules="RulesInteger(10,true)" counter="10"/>
                <v-text-field v-model="newdividend.net" type="number" :label="$t('Set dividend net balance')" :placeholder="$t('Set dividend net balance')" :rules="RulesInteger(10,true)" counter="10"/>
                <v-text-field v-model="newdividend.taxes" type="number" :label="$t('Set dividend taxes')" :placeholder="$t('Set dividend taxes')" :rules="RulesInteger(10,true)" counter="10"/>
                <v-text-field v-model="newdividend.commission" type="number" :label="$t('Set dividend commission')" :placeholder="$t('Set dividend commission')" :rules="RulesInteger(10,true)" counter="10"/>
                <v-text-field v-model="newdividend.dps" type="number" :label="$t('Set dividend per share')" :placeholder="$t('Set dividend per share')" :rules="RulesInteger(10,true)" counter="10"/>
                <v-text-field v-model="newdividend.currency_conversion" type="number" :label="$t('Set dividend currency conversion')" :placeholder="$t('Set dividend currency conversion')" :rules="RulesInteger(10,true)" counter="10"/>
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
            // An account object
            dividend: {
                required: true // Null to create, io object to update
            },
            investment:{
                required: true
            }
        },
        data(){ 
            return {
                form_valid: false,
                newdividend: null,
                editing: false,
            }
        },
        methods: {
            title(){
                if (this.editing){
                    return this.$t("Updating dividend")
                } else {
                    return this.$t("Creating a new dividend")
                }
            },
            button(){
                if (this.editing){
                    return this.$t("Update dividend")
                } else {
                    return this.$t("Add dividend")
                }
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

                if (this.editing==true){
                    axios.put(this.newdividend.url, this.newdividend,  this.myheaders())
                    .then(() => {
                            this.$emit("cruded")
                            this.editing=false
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else{
                    axios.post(`${this.$store.state.apiroot}/api/dividends/`, this.newdividend,  this.myheaders())
                    .then(() => {
                            this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
            },
        },
        created(){
            if (this.dividend.url==null){
                this.editing=false
            } else {
                this.editing=true
            }
            this.newdividend=Object.assign({},this.dividend)
        }
    }
</script>

