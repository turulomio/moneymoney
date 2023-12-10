<template>
  <div>
        <h1 class="mb-2">{{title()}}</h1>
        <v-form ref="form" v-model="form_valid">
            <v-autocomplete :readonly="mode=='D'" :items="getArrayFromMap(store().accounts).filter(v =>v.active==true)" v-model="new_investment.accounts" :label="$t('Select an account')" item-title="name" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
            <v-text-field :readonly="mode=='D'" v-model="new_investment.name" type="text" :label="$t('Investment name')"  :placeholder="$t('Investment name')" autofocus :rules="RulesString(200,true)"/>
            <AutocompleteProducts :readonly="mode=='D'" v-model="new_investment.products" :rules="RulesSelection(true)"  />
            <v-checkbox :readonly="mode=='D'" v-model="new_investment.active" :label="$t('Is active?')" ></v-checkbox>
            <v-checkbox :readonly="mode=='D'" v-model="new_investment.daily_adjustment" :label="$t('Has daily adjustment?')" ></v-checkbox>
            <v-text-field :readonly="mode=='D'" v-model.number="new_investment.decimals" :label="$t('Set shares decimals')" :placeholder="$t('Set shares decimals')" :rules="RulesInteger(1,true)" counter="1" />
        </v-form>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="acceptDialog()">{{ button() }}</v-btn>
        </v-card-actions>
  </div>
</template>

<script>
    import axios from 'axios'
    import AutocompleteProducts from './AutocompleteProducts.vue'
    import { RulesSelection } from 'vuetify_rules'
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

            RulesSelection,
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
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }
                if (this.mode=="U"){        
                    axios.put(this.new_investment.url, this.new_investment, this.myheaders())
                    .then((response) => {
                        this.store().investments.set(response.data.url, response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="C") {
                    axios.post(`${this.store().apiroot}/api/investments/`, this.new_investment,  this.myheaders())
                    .then((response) => {
                        this.store().investments.set(response.data.url, response.data)
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
                        this.store().investments.delete(this.new_investment.url)
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
