<template>
    <div>
                <h1>{{dialog_title_ao()}}</h1>
                <v-form ref="form_ao" v-model="form_valid_ao" lazy-validation>
                    <v-autocomplete autoindex="3" :items="$store.state.catalogs.accounts.filter(v =>v.active==true)" v-model="newao.accounts" :label="$t('Select an account')" item-text="name" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                    <MyDateTimePicker autoindex="4" label="Select operation date and time" v-model="newao.datetime"></MyDateTimePicker>
                    <v-autocomplete autoindex="0" autofocus :items="$store.state.catalogs.concepts" v-model="newao.concepts" :label="$t('Select a concept')" item-text="name" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                    <v-text-field autoindex="1" v-model="newao.amount" type="number" :label="$t('Operation amount')" :placeholder="$t('Account number')" :rules="RulesFloat(30,true)" counter="30"/>
                    <v-text-field autoindex="2" v-model="newao.comment" type="text" :label="$t('Operation comment')" :placeholder="$t('Operation comment')" counter="200"/>
                </v-form>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="following_ao=false;acceptDialogAO()" :disabled="!form_valid_ao">{{ $t("Add") }}</v-btn>
                    <v-btn color="primary" @click="following_ao=true;acceptDialogAO()" :disabled="!form_valid_ao" v-if="editing_ao==false">{{ $t("Add and follow") }}</v-btn>
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
            }
        },
        data () {
            return {
                newao:null,
                form_valid_ao:true,
                following_ao:false,
                editing_ao:false,
            }
        },
        methods:{

            acceptDialogAO(){
                //Validation
                if( this.$refs.form_ao.validate()==false) return
                var operationtype=this.get_operationstypes_from_concept(this.newao.concepts)
                this.newao.operationstypes=operationtype.url
                console.log(this.newao)
                if (operationtype.id==1 && this.newao.amount>0){
                     alert(this.$t("Amount must be negative"))
                     return
                }
                if (operationtype.id==2 && this.newao.amount<0) {
                    alert(this.$t("Amount must be positive"))
                    return
                }

                //Accept
                if (this.editing_ao==true){               
                    axios.put(this.newao.url, this.newao, this.myheaders())
                    .then(() => {
                            this.$emit('cruded', this.following_ao)
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else{
                    axios.post(`${this.$store.state.apiroot}/api/accountsoperations/`, this.newao,  this.myheaders())
                    .then(() => {             
                            if (this.following_ao==true){
                                var dt=this.zulu2date(this.newao.datetime)
                                var olddtseconds=this.zulu2date(this.newao.datetime).getSeconds()
                                dt.setSeconds(olddtseconds+60)
                                this.newao.datetime=this.date2zulu(dt)
                            }
                            this.$emit('cruded', this.following_ao)
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
            },
            dialog_title_ao(){
                if(this.editing_ao==true){
                    return this.$t("Updating account operation")
                } else {
                    return this.$t("Creating a new account operation")
                }
            },
        },
        created(){

            if ( this.ao.url!=null){ // EDITING TIENE IO URL
                this.editing=true
            } else { // NEW IO BUT SETTING VALUES WITH URL=null
                this.editing=false
            }
            this.newao=Object.assign({},this.ao)
        }


    }
</script>
