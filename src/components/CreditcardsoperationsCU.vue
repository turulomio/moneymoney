<template>
    <div>    
        <h1 class="mb-6">{{ dialog_title() }}</h1>
        <v-card class="pa-6">
            <v-form ref="form_cco" v-model="form_valid_cco">
                <v-autocomplete :readonly="deleting" :items="getArrayFromMap(useStore().creditcards).filter(v =>v.active==true)" v-model="newcco.creditcards" :label="$t('Select a credit card')" item-title="name" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <MyDateTimePicker :readonly="deleting" label="Select operation date and time" v-model="newcco.datetime" />
                <v-autocomplete  data-test="CreditcardsoperationsCU_Concepts" :readonly="deleting" autoindex="0" :items="getArrayFromMap(useStore().concepts)" v-model="newcco.concepts" :label="$t('Select a concept')" item-title="localname" item-value="url" :rules="RulesSelection(true)" autofocus></v-autocomplete>
                <v-text-field data-test="CreditcardsoperationsCU_Amount" :readonly="deleting" autoindex="1" v-model.number="newcco.amount"  :label="$t('Operation amount')" :placeholder="$t('Operation amount')" :rules="RulesFloat(15,true,get_account_decimals())" counter="15"/>
                <v-text-field data-test="CreditcardsoperationsCU_Comment" :readonly="deleting" autoindex="2" v-model="newcco.comment" type="text" :label="$t('Operation comment')" :placeholder="$t('Operation comment')" :rules="RulesString(200, false)" counter="200"/>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn v-if="deleting" color="error" @click="deleteCCO()">{{ $t("Delete") }}</v-btn>
                <v-btn data-test="CreditcardsoperationsCU_Button" v-if="!deleting" color="primary" @click="following_cco=false;acceptDialog()">{{ button() }}</v-btn>
                <v-btn data-test="CreditcardsoperationsCU_ButtonFollow" v-if="!deleting && !editing" color="primary" @click="following_cco=true;acceptDialog()">{{ $t("Add and follow") }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import { useStore } from "@/store"
    import MyDateTimePicker from './MyDateTimePicker.vue'
    import { RulesSelection, RulesFloat,RulesString } from 'vuetify_rules'
    export default {
        components:{
            MyDateTimePicker,
        },
        props:{
            cco:{
                required:true,
            },
            deleting:{
                type: Boolean,
                required:false,
                default:false
            }
        },
        data(){ 
            return{
                form_valid_cco: false,
                following_cco: false,
                editing:false,
                key:0,
                newcco:null,
            }
        },
        methods: {
            useStore,
            RulesSelection,
            RulesFloat,
            RulesString,
            button(){
                if(this.editing==true){
                    return this.$t("Update")
                } else {
                    return this.$t("Create")
                }
            },     
            dialog_title(){
                if (this.deleting==true){
                    return this.$t("Deleting a credit card operation")
                } else if(this.editing==true){
                    return this.$t("Updating credit card operation")
                } else {
                    return this.$t("Creating a new credit card operation")
                }
            },
            deleteCCO () {
               var r = confirm(this.$t("Do you want to delete this credit card operation?"))
               if(r == false) {
                  return
               }
                axios.delete(this.newcco.url, this.myheaders())
                .then(() => {
                    this.following_cco=false
                    this.$emit("cruded", this.following_cco)
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            acceptDialog(){
                //Validation
                if (this.form_valid_cco!=true) {
                    this.$refs.form_cco.validate()
                    return
                }
                var concept=this.useStore().concepts.get(this.newcco.concepts)
                var operationtype=this.useStore().operationstypes.get(concept.operationstypes)
                this.newcco.operationstypes=operationtype.url
                if (operationtype.id==1 && this.newcco.amount>0){
                     alert(this.$t("Amount must be negative"))
                     return
                }
                if (operationtype.id==2 && this.newcco.amount<0) {
                    alert(this.$t("Amount must be positive"))
                    return
                }
                //Accept
                if (this.editing==true){               
                    axios.put(this.newcco.url, this.newcco, this.myheaders())
                    .then(() => {
                            this.following_cco=false
                            this.$emit("cruded", this.following_cco)
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else{
                    axios.post(`${this.useStore().apiroot}/api/creditcardsoperations/`, this.newcco,  this.myheaders())
                    .then((response) => {    
                            console.log(response.data)
                        if (this.following_cco==true){
                            var dt=this.zulu2date(this.newcco.datetime)
                            var olddtseconds=this.zulu2date(this.newcco.datetime).getSeconds()
                            dt.setSeconds(olddtseconds+2)
                            this.newcco.datetime=this.date2zulu(dt)
                        }
                        this.$emit("cruded", this.following_cco)
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
            },

            get_account_decimals(){
                var r
                var cc=this.useStore().creditcards.get(this.newcco.creditcards)
                var account=this.useStore().accounts.get(cc.accounts)
                r=account.decimals
                return r
            }
        },
        created(){
            if ( this.cco.url!=null){ // EDITING TIENE IO URL
                this.editing=true
            } else { // NEW IO BUT SETTING VALUES WITH URL=null
                this.editing=false
            }
            this.newcco=Object.assign({}, this.cco)
        }
    }
</script>

