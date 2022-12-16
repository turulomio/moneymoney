<template>
    <div>    
        <h1>{{ title() }}</h1>    
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-autocomplete :readonly="deleting" :items="$store.state.banks.filter(v =>v.active==true)" v-model="newaccount.banks" :label="$t('Select a bank')" item-text="name" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <v-text-field v-model="newaccount.name" :readonly="deleting" type="text" :label="$t('Account name')" :placeholder="$t('Account name')" autofocus :rules="RulesString(200,true)" counter="200"/>
                <v-checkbox v-model="newaccount.active" :readonly="deleting" :label="$t('Is active?')" ></v-checkbox>
                <v-text-field v-model="newaccount.number" :readonly="deleting" type="text" :label="$t('Account number')" :placeholder="$t('Account number')" :rules="RulesString(30,false)" counter="30"/>
                <v-autocomplete :items="$store.state.currencies" :readonly="deleting" v-model="newaccount.currency" :label="$t('Select a currency')" item-text="fullname" item-value="code" :rules="RulesSelection(true)"></v-autocomplete>
                <v-text-field v-model.number="newaccount.decimals" :readonly="deleting" :label="$t('Account decimals')" :placeholder="$t('Account decimals')" autofocus :rules="RulesInteger(1,true)" counter="1"/>

           </v-form>   
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn v-if="deleting" color="error" @click="deleteAccount()">{{ $t("Delete") }}</v-btn>
                <v-btn v-if="!deleting" color="primary" @click="acceptDialog()" :disabled="!form_valid">{{ button() }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    export default {
        props: {
            // An account object
            account: {
                required: true // Null to create, io object to update
            },
            deleting:{
                required:false,
                default:false
            }
        },
        data(){ 
            return {
                form_valid:false,
                newaccount: null,
                editing:false,
            }
        },
        methods: {
            title(){
                if (this.deleting==true){
                    return this.$t("Deleting an account")
                } else if (this.editing==true){
                    return this.$t("Updating an account")
                } else {
                    return this.$t("Creating a new account")
                }
            },
            button(){
                if (this.editing){
                    return this.$t("Update")
                } else {
                    return this.$t("Add")
                }
            },
            acceptDialog(){
                if (this.$refs.form.validate()==false) return
                if (this.editing==true){               
                    axios.put(this.newaccount.url, this.newaccount, this.myheaders())
                    .then(() => {
                        this.$store.dispatch("getAccounts")
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else{
                    axios.post(`${this.$store.state.apiroot}/api/accounts/`, this.newaccount,  this.myheaders())
                    .then(() => {
                        this.$store.dispatch("getAccounts")
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
            },
            deleteAccount () {
               var r = confirm(this.$t("This account will be deleted. Do you want to continue?"))
               if(r == false) {
                  return
               } 
                axios.delete(this.newaccount.url, this.myheaders())
                .then(() => {
                    this.$store.dispatch("getAccounts")
                    this.$emit("cruded")
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
        },
        created(){
            if ( this.account.url!=null){ // EDITING TIENE IO URL
                this.editing=true
            } else { // NEW IO BUT SETTING VALUES WITH URL=null
                this.editing=false
            }
            this.newaccount=Object.assign({},this.account)
        }
    }
</script>

