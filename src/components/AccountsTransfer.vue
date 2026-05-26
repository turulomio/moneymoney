
<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid">
                <MyDateTimePicker :readonly="mode=='D'" v-model="new_at.datetime" :label="$t('Set transfer date and time')" />
                <v-autocomplete data-test="AccountsTransfer_Origin" :readonly="mode=='D'" :items="getArrayFromMap(useStore().accounts).filter(v =>v.active==true)" v-model="new_at.origin" :label="$t('Select an origin account')" item-title="localname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <v-autocomplete data-test="AccountsTransfer_Destiny" :readonly="mode=='D'" :items="getArrayFromMap(useStore().accounts).filter(v =>v.active==true)" v-model="new_at.destiny" :label="$t('Select a destiny account')" item-title="localname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <v-text-field data-test="AccountsTransfer_Amount" :readonly="mode=='D'" v-model.number="new_at.amount"  :label="$t('Set transfer amount')" :placeholder="$t('Set transfer amount')" :rules="RulesFloatGZ(10,true,get_transfer_decimals())" counter="10"/>
                <v-text-field data-test="AccountsTransfer_Commission" :readonly="mode=='D'" v-model.number="new_at.commission"  :label="$t('Set transfer commission')" :placeholder="$t('Set transfer commission')" :rules="RulesFloatGEZ(10,true,get_transfer_decimals())" counter="10"/>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn data-test="AccountsTransfer_Button" color="primary" @click="acceptTransfer()">{{ button() }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import { useStore } from '@/store'
    import { RulesSelection, RulesFloatGEZ, RulesFloatGZ } from 'vuetify_rules'
    import MyDateTimePicker from './MyDateTimePicker.vue'
    import { getArrayFromMap } from '@/functions'
    import { useDialogs } from '@/composables/useDialogs'
    export default {
        setup() {
            const { alert, confirm } = useDialogs()
            return { myAlert: alert, myConfirm: confirm }
        },
        components: {
            MyDateTimePicker},
        props: {
            // An account object
            at: { // An account transfer object
                required: true
            },
            mode: {
                type: String,
                required: true}
        },
        data(){ 
            return{
                form_valid:false,
                new_at: null,

                query_ao_origin: null,
                query_ao_destiny: null,
                query_ao_commission: null}
        },
        methods: {
            useStore,
            RulesSelection,
            RulesFloatGEZ,
            RulesFloatGZ,
            getArrayFromMap,
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
            async acceptTransfer(){             
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }  
                if ( [ "C","U"].includes(this.mode)){ // Due it has not all values
                    if (this.new_at.origin==this.new_at.destiny){
                        await this.myAlert(this.$t("Transfer accounts can't be the same"))
                        return
                    } 
                }

                if (this.mode=="C"){
                    axios.post(`${this.useStore().apiroot}/api/accountstransfers/`, this.new_at)
                    .then(() => {
                        this.$emit("cruded")
                    })
                }
                if (this.mode=="U"){
                    axios.put(this.new_at.url, this.new_at)
                    .then(() => {
                        this.$emit("cruded")
                    })
                }
                if (this.mode=="D"){             
                    if(await this.myConfirm(this.$t("Do you want to delete this transfer?"))) {
                        axios.delete(this.new_at.url)
                        .then(() => {
                            this.$emit("cruded")
                        })
                    }
                }

            },
            query_ao(){
                this.loading=true
                if (this.new_at.ao_commission){ //With Commission 
                    axios.all([
                        axios.get(this.new_at.ao_origin), 
                        axios.get(this.new_at.ao_destiny), 
                        axios.get(this.new_at.ao_commission)
                    ]).then(([resAoOrigin, resAoDestiny, resAoCommission]) => {
                        this.new_at.origin=resAoOrigin.data.accounts
                        this.new_at.destiny=resAoDestiny.data.accounts
                        this.new_at.amount=resAoDestiny.data.amount
                        this.new_at.commission=Math.abs(resAoCommission.data.amount)
                        this.loading=false
                        this.key=this.key+1
                    });
                } else { //Without Commission
                    axios.all([
                        axios.get(this.new_at.ao_origin), 
                        axios.get(this.new_at.ao_destiny)
                    ]).then(([resAoOrigin, resAoDestiny]) => {
                        this.new_at.origin=resAoOrigin.data.accounts
                        this.new_at.destiny=resAoDestiny.data.accounts
                        this.new_at.amount=resAoDestiny.data.amount  
                        this.loading=false
                        this.key=this.key+1
                    });

                }
            },     
            get_transfer_decimals(){
                //Must be the lowest decimals from both accounts
                var r

                var ao=this.useStore().accounts.get(this.new_at.origin)
                var ad=this.useStore().accounts.get(this.new_at.destiny)
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
            this.new_at=Object.assign({},this.at)
            if (["U","D"].includes(this.mode)){
                this.query_ao()
            }
        }
    }
</script>

