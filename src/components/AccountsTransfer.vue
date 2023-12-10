
<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid">
                <MyDateTimePicker :readonly="deleting" v-model="newat.datetime" :label="$t('Set transfer date and time')" />
                <v-autocomplete :readonly="deleting" :items="getArrayFromMap(store().accounts).filter(v =>v.active==true)" v-model="newat.account_origin" :label="$t('Select an origin account')" item-title="localname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <v-autocomplete :readonly="deleting" :items="getArrayFromMap(store().accounts).filter(v =>v.active==true)" v-model="newat.account_destiny" :label="$t('Select a destiny account')" item-title="localname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <v-text-field :readonly="deleting" v-model.number="newat.amount"  :label="$t('Set transfer amount')" :placeholder="$t('Set transfer amount')" :rules="RulesFloatGZ(10,true,get_transfer_decimals())" counter="10"/>
                <v-text-field :readonly="deleting" v-model.number="newat.commission"  :label="$t('Set transfer commission')" :placeholder="$t('Set transfer commission')" :rules="RulesFloatGEZ(10,true,get_transfer_decimals())" counter="10"/>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="acceptTransfer()">{{ button() }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import { RulesSelection } from 'vuetify_rules'
    import MyDateTimePicker from './MyDateTimePicker.vue'
    export default {
        components: {
            MyDateTimePicker,
        },
        props: {
            // An account object
            at: { // An account transfer object
                required: true
            },
            deleting: {
                required: false,
                default: false,
            }
        },
        data(){ 
            return{
                form_valid:false,
                newat: null,
                mode: "", // CRUD mode

                query_ao_origin: null,
                query_ao_destiny: null,
                query_ao_commission: null,

            }
        },
        methods: {
            RulesSelection,
            button(){
                if (this.mode=="C") return this.$t('Add')
                if (this.mode=="U") return this.$t('Update')
                if (this.mode=="D") return this.$t('Delete')
            },
            title(){
                if (this.mode=="C") return this.$t('Add a new account transfer')
                if (this.mode=="U") return this.$t('Update account transfer')
                if (this.mode=="D") return this.$t('Delete account transfer')
            },
            acceptTransfer(){             
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }  
                if (this.deleting==false){ // Due it has not all values
                    if (this.newat.account_origin==this.newat.account_destiny){
                        alert(this.$t("Transfer accounts can't be the same"))
                        return
                    } 
                }

                if (this.mode=="C"){
                    axios.post(`${this.store().apiroot}/accounts/transfer/`, this.newat,  this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="U"){
                    axios.put(`${this.store().apiroot}/accounts/transfer/`, this.newat,  this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="D"){             
                    var r = confirm(this.$t("Do you want to delete this transfer?"))
                    if(r == true) {
                        var headers={...this.myheaders(),data:this.newat}
                        axios.delete(`${this.store().apiroot}/accounts/transfer/`, headers)
                        .then(() => {
                            this.$emit("cruded")
                        }, (error) => {
                            this.parseResponseError(error)
                        })
                    }
                }

            },
            query_ao(){
                this.loading=true
                if (this.newat.ao_commission){ //With Commission 
                    axios.all([
                        axios.get(this.newat.ao_origin, this.myheaders()), 
                        axios.get(this.newat.ao_destiny, this.myheaders()), 
                        axios.get(this.newat.ao_commission, this.myheaders())
                    ]).then(([resAoOrigin, resAoDestiny, resAoCommission]) => {
                        this.newat.account_origin=resAoOrigin.data.accounts
                        this.newat.account_destiny=resAoDestiny.data.accounts
                        this.newat.amount=resAoDestiny.data.amount
                        this.newat.commission=Math.abs(resAoCommission.data.amount)
                        this.loading=false
                        this.key=this.key+1
                    });
                } else { //Without Commission
                    axios.all([
                        axios.get(this.newat.ao_origin, this.myheaders()), 
                        axios.get(this.newat.ao_destiny, this.myheaders())
                    ]).then(([resAoOrigin, resAoDestiny]) => {
                        this.newat.account_origin=resAoOrigin.data.accounts
                        this.newat.account_destiny=resAoDestiny.data.accounts
                        this.newat.amount=resAoDestiny.data.amount  
                        this.loading=false
                        this.key=this.key+1
                    });

                }
            },     
            get_transfer_decimals(){
                //Must be the lowest decimals from both accounts
                var r

                var ao=this.store().accounts.get(this.newat.account_origin)
                var ad=this.store().accounts.get(this.newat.account_destiny)
                if (ad==null || ao==null){
                    r=6
                } else {
                    if (ao.decimals>ad.decimals) {
                        r= ad.decimals
                    } else {
                        r= ao.decimals
                    }
                }
                return r
            }

        },
        created(){
            // Guess crud mode
            this.newat=Object.assign({},this.at)
            if ( this.at.ao_origin==null){ 
                this.mode="C"
            } else if (this.at.ao_origin!= null && this.deleting ==false) { 
                this.mode="U"
                this.query_ao()
            } else if (this.at.ao_origin!= null && this.deleting ==true) { 
                this.mode="D"
                this.query_ao()
            }

        }
    }
</script>

