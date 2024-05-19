<template>
    <div>    
        <h1>{{ title() }}</h1>    
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid">
                <v-text-field data-test="BanksCU_Name" :readonly="mode=='D'"  v-model="new_bank.name" type="text" :label="$t('Bank name')" :placeholder="$t('Bank name')" autofocus :rules="RulesString(100, true)"/>
                <v-checkbox data-test="BanksCU_Active" :readonly="mode=='D'"  v-model="new_bank.active" :label="$t('Is active?')" ></v-checkbox>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn data-test="BanksCU_Button" color="primary" @click="acceptDialog">{{ button() }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import { useStore } from "@/store"
    import { RulesString } from 'vuetify_rules'
    export default {
        props: {
            bank: { // Bank object
                required: true 
            },
            mode:{ //CUD
                required:true
            }
        },
        data(){ 
            return {
                form_valid:false,
                new_bank: null,
            }
        },
        methods: {
            useStore,
            RulesString,
            title(){
                if (this.mode=="U"){
                    return this.$t("Updating bank")
                } else  if (this.mode=="C"){
                    return this.$t("Creating a new bank")
                } else  if (this.mode=="D"){
                    return this.$t("Deleting bank")
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
            acceptDialog(){
                if (this.$refs.form.validate()==false) return
                if (this.mode=='U'){               
                    axios.put(this.new_bank.url, this.new_bank, this.myheaders())
                    .then(() => {
                        this.useStore().updateBanks()
                        .then(()=>{
                            this.$emit("cruded")

                        })
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="C"){
                    axios.post(`${this.useStore().apiroot}/api/banks/`, this.new_bank,  this.myheaders())
                    .then(() => {
                        this.useStore().updateBanks()
                        .then(()=>{
                            this.$emit("cruded")

                        })
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="D"){
                    var r = confirm(this.$t("This bank will be deleted. Do you want to continue?"))
                    if(r == false) {
                        return
                    } 
                    axios.delete(this.new_bank.url, this.myheaders())
                    .then(() => {
                        this.useStore().updateBanks()
                        .then(()=>{
                            this.$emit("cruded")

                        })
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                }

            },
        },
        created(){
            this.new_bank=Object.assign({},this.bank)
        }
    }
</script>

