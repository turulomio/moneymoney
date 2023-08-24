<template>
    <div>
        <h1>{{dialog_title_ao()}}</h1>
        <v-form ref="form_ao" v-model="form_valid_ao">
            <v-autocomplete :readonly="mode=='D'" autoindex="5" :items="getArrayFromMap(store().accounts).filter(v =>v.active==true)" v-model="newao.accounts" :label="$t('Select an account')" item-title="localname" item-value="url" :rules="RulesSelection(true)" @change="on_account_change"></v-autocomplete>
            <MyDateTimePicker :readonly="mode=='D'" autoindex="6" label="Select operation date and time" v-model="newao.datetime" />
            <v-autocomplete :readonly="mode=='D'" autoindex="0" autofocus :items="getArrayFromMap(store().concepts)" v-model="newao.concepts" :label="$t('Select a concept')" item-title="localname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
            <v-text-field :readonly="mode=='D'" autoindex="1" v-model="newao.amount"  :label="$t('Operation amount')" :placeholder="$t('Account number')" :rules="RulesFloat(30,true,this.account.decimals)" counter="30"/>
            <v-text-field :readonly="mode=='D'" autoindex="2" v-model="newao.comment" type="text" :label="$t('Operation comment')" :placeholder="$t('Operation comment')" counter="200"/>
        </v-form>
        <v-card-actions>
            <v-spacer></v-spacer> 
            <v-btn color="primary" autoindex="3" @click="following_ao=false;acceptDialogAO()">{{ button() }}</v-btn>
            <v-btn v-if="mode=='C'" autoindex="4" color="primary" @click="following_ao=true;acceptDialogAO()">{{ $t("Add and follow") }}</v-btn>
        </v-card-actions>
    </div>
</template>

<script>
    import axios from 'axios' 
    import MyDateTimePicker from './MyDateTimePicker.vue'
    export default {
        components:{
            MyDateTimePicker,
        },
        props:{
            ao:{
                required:true,
            },
            mode:{ // CRUD
                required:true,
            }
        },
        data () {
            return {
                account: null,
                newao:null,
                form_valid_ao:true,
                following_ao:false,
            }
        },
        methods:{
            acceptDialogAO(){
                //Validation
                if (this.form_valid_ao!=true) {
                    this.$refs.form_ao.validate()
                    return
                }
                var concept=this.store().concepts.get(this.newao.concepts)
                var operationtype=this.store().operationstypes.get(concept.operationstypes)
                this.newao.operationstypes=operationtype.url
                if (operationtype.id==1 && this.newao.amount>0){
                     alert(this.$t("Amount must be negative"))
                     return
                }
                if (operationtype.id==2 && this.newao.amount<0) {
                    alert(this.$t("Amount must be positive"))
                    return
                }

                //Accept
                if (this.mode=='U'){               
                    axios.put(this.newao.url, this.newao, this.myheaders())
                    .then(() => {
                            this.$emit('cruded', this.following_ao)
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=='C'){ 
                    axios.post(`${this.store().apiroot}/api/accountsoperations/`, this.newao,  this.myheaders())
                    .then(() => {             
                        if (this.following_ao==true){
                            var dt=this.zulu2date(this.newao.datetime)
                            var olddtseconds=this.zulu2date(this.newao.datetime).getSeconds()
                            dt.setSeconds(olddtseconds+2)
                            this.newao.datetime=this.date2zulu(dt)
                        }
                        this.$emit('cruded', this.following_ao)
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=='D'){
                    var r
                    r = confirm(this.$t("Do you want to delete this account operation?"))
                    if(r == false) {
                        return
                    }  
                    this.following_ao=false
                    axios.delete(this.newao.url, this.myheaders())
                    .then(() => {
                        this.$emit('cruded', this.following_ao)
                    }, (error) => {
                        this.parseResponseError(error)
                    });
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
            dialog_title_ao(){
                if (this.mode=='D'){
                    return this.$t("Deleting account operation")
                } else if (this.mode=='U'){
                    return this.$t("Updating account operation")
                } else {
                    return this.$t("Creating a new account operation")
                }
            },
            on_account_change(){
                this.account=this.store().accounts.get(this.newao.accounts)

            }
        },
        created(){
            this.newao=Object.assign({},this.ao)
            this.on_account_change() //Updates  account object
        }


    }
</script>
