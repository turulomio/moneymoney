<template>
    <div>
        <h1 class="mb-4">{{dialog_title_cc()}}</h1>
        <v-form ref="form" v-model="form_valid_cc" lazy-validation>
            <v-autocomplete :items="$store.state.accounts.filter(v =>v.active==true)" v-model="newcc.accounts" :label="$t('Select an account')" item-text="name" item-value="url"  :rules="RulesSelection(true)"></v-autocomplete>
            <v-text-field v-model="newcc.name" type="text" :label="$t('Credit card name')" :placeholder="$t('Credit card name')" autofocus  counter="200" :rules="RulesString(200,true)"/>
            <v-text-field v-model="newcc.number" type="text" :label="$t('Credit card number')"  :placeholder="$t('Credit card number')" counter="30" :rules="RulesString(30,false)"/>
            <v-text-field v-model="newcc.maximumbalance"  :label="$t('Credit card maximum balance')"  :placeholder="$t('Credit card maximum balance')" :rules="RulesInteger(10,true)" counter="10"/>
            <v-checkbox v-model="newcc.active" :label="$t('Is active?')"></v-checkbox>
            <v-checkbox v-model="newcc.deferred" :label="$t('Has deferred payments?')"></v-checkbox>
        </v-form>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="acceptDialogCC()" :disabled="!form_valid_cc">{{ button() }}</v-btn>
        </v-card-actions>
    </div>
</template>

<script>    
    import axios from 'axios' 
    export default {
        components:{
        },
        props:{
            cc:{
                required:true,
            }
        },
        data () {
            return {
                newcc:null,
                form_valid_cc:true,
                editing_cc:false,
            }
        },
        methods:{
            button(){
                if(this.editing_cc==true){
                    return this.$t("Update")
                } else {
                    return this.$t("Create")
                }
            },     
            dialog_title_cc(){
                if(this.editing_cc==true){
                    return this.$t("Updating credit card")
                } else {
                    return this.$t("Creating a new credit card")
                }
            },            
            acceptDialogCC(){
                if (this.editing_cc==true){               
                    axios.put(this.newcc.url, this.newcc, this.myheaders())
                    .then(() => {
                            this.$store.dispatch("getCreditcards")
                            this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else{
                    axios.post(`${this.$store.state.apiroot}/api/creditcards/`, this.newcc,  this.myheaders())
                    .then(() => {
                        this.$store.dispatch("getCreditcards")
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
            },
        },  
        created(){

            if ( this.cc.url!=null){ // EDITING TIENE IO URL
                this.editing_cc=true
            } else { // NEW IO BUT SETTING VALUES WITH URL=null
                this.editing_cc=false
            }
            this.newcc=Object.assign({},this.cc)
        }
    }
</script>
