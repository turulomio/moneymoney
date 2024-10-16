<template>
    <div>    
        <h1>{{ title() }}</h1>    
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid">
                <v-autocomplete data-test="AccountsCU_Bank" :readonly="mode=='D'" :items="getArrayFromMap(useStore().banks)" v-model="new_account.banks" :label="$t('Select a bank')" item-title="name" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <v-text-field data-test="AccountsCU_Name" v-model="new_account.name" :readonly="mode=='D'" type="text" :label="$t('Account name')" :placeholder="$t('Account name')" autofocus :rules="RulesString(200,true)" counter="200"/>
                <v-checkbox v-model="new_account.active" :readonly="mode=='D'" :label="$t('Is active?')" ></v-checkbox>
                <v-text-field data-test="AccountsCU_Number" v-model="new_account.number" :readonly="mode=='D'" type="text" :label="$t('Account number')" :placeholder="$t('Account number')" :rules="RulesString(30,false)" counter="30"/>
                <v-autocomplete :items="useStore().currencies" :readonly="mode=='D'" v-model="new_account.currency" :label="$t('Select a currency')" item-title="fullname" item-value="code" :rules="RulesSelection(true)"></v-autocomplete>
                <v-text-field v-model.number="new_account.decimals" :readonly="mode=='D'" :label="$t('Account decimals')" :placeholder="$t('Account decimals')" autofocus :rules="RulesInteger(1,true)" counter="1"/>
           </v-form>   
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn  data-test="AccountsCU_Button" color="primary" @click="acceptDialog">{{ button() }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import { useStore } from "@/store"
    import { RulesSelection, RulesInteger, RulesString } from 'vuetify_rules'
    export default {
        props: {
            // An account object
            account: {
                required: true // Null to create, io object to update
            },
            mode:{//CUD
                required:false,
                default:false
            }
        },
        data(){ 
            return {
                form_valid:false,
                new_account: null,
                editing:false,
            }
        },
        methods: {
            useStore,
            RulesSelection,
            RulesInteger,
            RulesString,
            title(){
                if (this.mode=="C") return this.$t("Add an account")
                if (this.mode=="U") return this.$t("Update an account")
                if (this.mode=="D") return this.$t("Delete an account")
            },
            button(){
                if (this.mode=="C") return this.$t("Add")
                if (this.mode=="U") return this.$t("Update")
                if (this.mode=="D") return this.$t("Delete")
            },
            acceptDialog(){
                var bank=this.useStore().banks.get(this.new_account.banks)
                if (bank.active==false){
                    alert(this.$t("You can't use an inactive bank"))
                    return
                }


                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }
                if (this.mode=="U"){               
                    axios.put(this.new_account.url, this.new_account, this.myheaders())
                    .then((response) => {
                        this.useStore().accounts.set(response.data.url, response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="C"){
                    axios.post(`${this.useStore().apiroot}/api/accounts/`, this.new_account,  this.myheaders())
                    .then((response) => {
                        this.useStore().accounts.set(response.data.url, response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="D"){
                    var r = confirm(this.$t("This account will be deleted. Do you want to continue?"))
                    if(r == false) {
                        return
                    } 
                    axios.delete(this.new_account.url, this.myheaders())
                    .then(() => {
                        this.useStore().accounts.delete(this.new_account.url)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    });

                }
            },
        },
        created(){
            this.new_account=Object.assign({},this.account)
        }
    }
</script>

