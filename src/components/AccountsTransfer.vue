
<template>
    <div>    
        <h1>{{ $t(`Account tranfer`) }}</h1>           
        <v-card class="pa-4">
            <v-card-title class="headline">{{ this.$t("Account transfer")}}</v-card-title>
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <MyDateTimePicker v-model="transfer.datetime" :label="$t('Set transfer date and time')"></MyDateTimePicker>
                <v-autocomplete :items="$store.state.catalogs.accounts.filter(v =>v.active==true)" v-model="transfer.origin" :label="$t('Select an origin account')" item-text="name" item-value="url" required :rules="RulesSelection(true)"></v-autocomplete>
                <v-autocomplete :items="$store.state.catalogs.accounts.filter(v =>v.active==true)" v-model="transfer.destiny" :label="$t('Select an origin account')" item-text="name" item-value="url" required :rules="RulesSelection(true)"></v-autocomplete>
                <v-text-field v-model="transfer.amount" type="number" :label="$t('Set transfer amount')" required :placeholder="$t('Set transfer amount')" :rules="RulesInteger(10,true)" counter="10"/>
                <v-text-field v-model="transfer.commission" type="number" :label="$t('Set transfer commission')" required :placeholder="$t('Set transfer commission')" :rules="RulesInteger(10,true)" counter="10"/>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="acceptTransfer()" :disabled="!form_valid">{{ $t("Log in") }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import MyDateTimePicker from './MyDateTimePicker.vue'
    import {object2formdata} from '../functions.js'
    export default {
        components: {
            MyDateTimePicker,
        },
        props: {
            // An account object
            origin: {
                required: false
            },
        },
        data(){ 
            return{
                form_valid:false,
                transfer:this.empty_transfer(),

            }
        },
        methods: {        
            object2formdata,
            empty_transfer(){
                return {
                    datetime: new Date().toISOString(),
                    origin: null,
                    destiny: null,
                    amount: 0,
                    commission: 0,
                }
            },
            acceptTransfer(){             
                if (this.transfer.origin==this.transfer.destiny){
                    alert(this.$t("Transfer accounts can't be the same"))
                    return
                }
                if( this.$refs.form.validate()==false) return       
                axios.post(`${this.$store.state.apiroot}/accounts/transfer/`, this.object2formdata(this.transfer),  this.myheaders_formdata())
                .then((response) => {
                    console.log(response.data)
                    this.$emit("accepted")
                }, (error) => {
                    this.parseResponseError(error)
                })
            },

        },
        mounted(){
            this.transfer.origin=this.origin.url
        }
    }
</script>

