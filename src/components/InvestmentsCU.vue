<template>
  <div>
        <h1>{{dialog_title()}}</h1>
        <v-form ref="form" v-model="form_valid" lazy-validation>
            <v-autocomplete :items="$store.state.catalogs.accounts.filter(v =>v.active==true)" v-model="newinvestment.accounts" :label="$t('Select an account')" item-text="name" item-value="url" required :rules="RulesSelection(true)"></v-autocomplete>
            <v-text-field v-model="newinvestment.name" type="text" :label="$t('Investment name')" required :placeholder="$t('Investment name')" autofocus/>
            <v-autocomplete :items="$store.state.catalogs.products" v-model="newinvestment.products" :label="$t('Select a product')" item-text="name" item-value="url" required :rules="RulesSelection(true)"></v-autocomplete>
            <v-text-field v-model="newinvestment.selling_price" type="number" :label="$t('Set an investment selling price')" required :placeholder="$t('Investment selling price')" :rules="RulesInteger(10,true)" counter="10"/>
            <MyDatePicker v-model="newinvestment.selling_expiration" :label="$t('Set a selling expiration date')"></MyDatePicker>
            <v-checkbox v-model="newinvestment.active" :label="$t('Is active?')" ></v-checkbox>
            <v-checkbox v-model="newinvestment.daily_adjustment" :label="$t('Has daily adjustment?')" ></v-checkbox>
        </v-form>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="acceptDialog()" :disabled="!form_valid">{{ button() }}</v-btn>
        </v-card-actions>
  </div>
</template>

<script>
    import axios from 'axios'
    import MyDatePicker from './MyDatePicker.vue'
    export default {
        components:{
            MyDatePicker,
        },
        props:{
            investment:{
                required:true,
            }
        },
        data(){ 
            return{
                form_valid: false,
                editing:false,
                newinvestment:null
            }
        },
        methods:{

            button(){
                if(this.editing==true){
                    return this.$t("Update")
                } else {
                    return this.$t("Create")
                }
            },     
            dialog_title(){
                if(this.editing==true){
                    return this.$t("Updating investment")
                } else {
                    return this.$t("Creating a new investment")
                }
            },
            acceptDialog(){
                if (this.$refs.form.validate()==false) return
                if (this.editing==true){               
                    axios.put(this.newinvestment.url, this.newinvestment, this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else{
                    axios.post(`${this.$store.state.apiroot}/api/investments/`, this.newinvestment,  this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
            },
        },
        created(){

            if ( this.investment.url!=null){ // EDITING TIENE IO URL
                this.editing=true
            } else { // NEW IO BUT SETTING VALUES WITH URL=null
                this.editing=false
            }
            this.newinvestment=Object.assign({},this.investment)
            console.log(this.newinvestment)
        }
    }
</script>
