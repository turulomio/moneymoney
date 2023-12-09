<template>
    <div class="pa-2">
        <h1 class="mb-4">{{ title() }}</h1>
        <v-form ref="form" v-model="form_valid_cc">
            <v-autocomplete :readonly="mode=='D'" :items="getArrayFromMap(store().accounts).filter(v =>v.active==true)" v-model="new_cc.accounts" :label="$t('Select an account')" item-title="name" item-value="url"  :rules="RulesSelection(true)"></v-autocomplete>
            <v-text-field :readonly="mode=='D'" v-model="new_cc.name" type="text" :label="$t('Credit card name')" :placeholder="$t('Credit card name')" autofocus  counter="200" :rules="RulesString(200,true)"/>
            <v-text-field :readonly="mode=='D'" v-model="new_cc.number" type="text" :label="$t('Credit card number')"  :placeholder="$t('Credit card number')" counter="30" :rules="RulesString(30,false)"/>
            <v-text-field :readonly="mode=='D'" v-model.number="new_cc.maximumbalance"  :label="$t('Credit card maximum balance')"  :placeholder="$t('Credit card maximum balance')" :rules="RulesInteger(10,true)" counter="10"/>
            <v-checkbox :readonly="mode=='D'" v-model="new_cc.active" :label="$t('Is active?')"></v-checkbox>
            <v-checkbox :readonly="mode=='D'" v-model="new_cc.deferred" :label="$t('Has deferred payments?')"></v-checkbox>
        </v-form>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="acceptDialogCC()" :disabled="!form_valid_cc">{{ button() }}</v-btn>
        </v-card-actions>
    </div>
</template>

<script>    
    
import axios from 'axios' 
    export default {
        props:{
            cc:{
                required:true,
            },
            mode: {
                required: true // Can be CUD
            }
        },
        data () {
            return {
                new_cc:null,
                form_valid_cc:true,
            }
        },
        methods:{
            title(){
                if (this.mode=="U"){
                    return this.$t("Updating a credit card")
                } else  if (this.mode=="C"){
                    return this.$t("Creating a new credit card")
                } else  if (this.mode=="D"){
                    return this.$t("Deleting a credit card")
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
            acceptDialogCC(){
                if (this.mode=="U"){               
                    axios.put(this.new_cc.url, this.new_cc, this.myheaders())
                    .then((response) => {
                        this.store().creditcards.set(response.data.url,response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="C") {
                    axios.post(`${this.store().apiroot}/api/creditcards/`, this.new_cc,  this.myheaders())
                    .then((response) => {
                        this.store().creditcards.set(response.data.url,response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="D") {
                    var r = confirm(this.$t("Do you want to delete this credit card?"))
                    if(r == false) {
                        return
                    }  
                    r = confirm(this.$t("Are you sure?. If you used this credit card you should mark it as inactive"))
                    if(r == false) {
                        return
                    }  
                    axios.delete(this.new_cc.url, this.myheaders())
                    .then((response) => {
                        this.store().creditcards.delete(response.data.url,response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                }
            },
        },  
        created(){
            this.new_cc=Object.assign({},this.cc)
        }
    }
</script>
