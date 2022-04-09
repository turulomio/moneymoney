
<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <MyDateTimePicker :readonly="deleting" v-model="newat.datetime" :label="$t('Set transfer date and time')"></MyDateTimePicker>
                <v-autocomplete :readonly="deleting" :items="$store.state.accounts.filter(v =>v.active==true)" v-model="newat.account_origin" :label="$t('Select an origin account')" item-text="localname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <v-autocomplete :readonly="deleting" :items="$store.state.accounts.filter(v =>v.active==true)" v-model="newat.account_destiny" :label="$t('Select a destiny account')" item-text="localname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <v-text-field :readonly="deleting" v-model="newat.amount" type="number" :label="$t('Set transfer amount')" :placeholder="$t('Set transfer amount')" :rules="RulesInteger(10,true)" counter="10"/>
                <v-text-field :readonly="deleting" v-model="newat.commission" type="number" :label="$t('Set transfer commission')" :placeholder="$t('Set transfer commission')" :rules="RulesInteger(10,true)" counter="10"/>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="acceptTransfer()" :disabled="!form_valid">{{ button() }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
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
                if( this.$refs.form.validate()==false) return   
                if (this.deleting==false){ // Due it has not all values
                    if (this.newat.account_origin==this.newat.account_destiny){
                        alert(this.$t("Transfer accounts can't be the same"))
                        return
                    }
                    if (this.newat.amount==0){
                        alert(this.$t("Transfer amount can't be 0"))
                        return
                    }
                    if (this.newat.commission<0){
                        alert(this.$t("Transfer commission can't be negative"))
                        return
                    }    
                }

                if (this.mode=="C"){
                    axios.post(`${this.$store.state.apiroot}/accounts/transfer/`, this.newat,  this.myheaders())
                    .then((response) => {
                        console.log(response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="U"){
                    axios.put(`${this.$store.state.apiroot}/accounts/transfer/`, this.newat,  this.myheaders())
                    .then((response) => {
                        console.log(response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="D"){             
                    var r = confirm(this.$t("Do you want to delete this transfer?"))
                    if(r == true) {
                        var headers={...this.myheaders(),data:this.newat}
                        axios.delete(`${this.$store.state.apiroot}/accounts/transfer/`, headers)
                        .then((response) => {
                            console.log(response.data)
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
                        console.log(this.newat)
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
                        console.log(this.newat)
                        this.loading=false
                        this.key=this.key+1
                    });

                }
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

