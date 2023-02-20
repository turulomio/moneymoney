<template>
  <div>
        <h1 class="mb-2">{{title()}}</h1>
        <v-form ref="form" v-model="form_valid" lazy-validation>
            <v-autocomplete :readonly="mode=='D'" :items="$store.state.accounts.filter(v =>v.active==true)" v-model="new_investment.accounts" :label="$t('Select an account')" item-text="name" item-value="url"  :rules="RulesSelection(true)"></v-autocomplete>
            <v-text-field :readonly="mode=='D'" v-model="new_investment.name" type="text" :label="$t('Investment name')"  :placeholder="$t('Investment name')" autofocus :rules="RulesString(200,true)"/>
            <AutocompleteProducts :readonly="mode=='D'" v-model="new_investment.products" :rules="RulesSelection(true)"  />
            <v-checkbox :readonly="mode=='D'" v-model="new_investment.active" :label="$t('Is active?')" ></v-checkbox>
            <v-checkbox :readonly="mode=='D'" v-model="new_investment.daily_adjustment" :label="$t('Has daily adjustment?')" ></v-checkbox>
        </v-form>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="acceptDialog()" :disabled="!form_valid">{{ button() }}</v-btn>
        </v-card-actions>
  </div>
</template>

<script>
    import axios from 'axios'
    import AutocompleteProducts from './AutocompleteProducts.vue'
    export default {
        components:{
            AutocompleteProducts,
        },
        props:{
            investment:{ //Object
                required:true,
            },
            mode: {
                required: true // Can be CUD
            }
        },
        data(){ 
            return{
                form_valid: false,
                new_investment:null
            }
        },
        methods:{

            title(){
                if (this.mode=="U"){
                    return this.$t("Updating investment")
                } else  if (this.mode=="C"){
                    return this.$t("Creating a new investment")
                } else  if (this.mode=="D"){
                    return this.$t("Deleting investment")
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
                if (this.mode=="U"){        
                    axios.put(this.new_investment.url, this.new_investment, this.myheaders())
                    .then(() => {
                        this.$store.dispatch("getInvestments")
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="C") {
                    axios.post(`${this.$store.state.apiroot}/api/investments/`, this.new_investment,  this.myheaders())
                    .then(() => {
                        this.$store.dispatch("getInvestments")
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="D") {
                    var r = confirm(this.$t("Do you want to delete this investment?"))
                    if(r == false) {
                        return
                    } 
                    axios.delete(this.new_investment.url, this.myheaders())
                    .then(() => {
                        this.$store.dispatch("getInvestments")
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                    }
            },
        },
        created(){
            this.new_investment=Object.assign({},this.investment)
        }
    }
</script>
