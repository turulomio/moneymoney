<template>
    <div>    
        <h1>{{ title() }}</h1>    
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-text-field v-model="newbank.name" type="text" :label="$t('Bank name')" :placeholder="$t('Bank name')" autofocus :rules="RulesString(100, true)"/>
                <v-checkbox v-model="newbank.active" :label="$t('Is active?')" ></v-checkbox>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn v-if="deleting" color="error" @click="deleteBank()">{{ $t("Delete") }}</v-btn>
                <v-btn v-if="!deleting" color="primary" @click="acceptDialog()" :disabled="!form_valid">{{ button() }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    export default {
        props: {
            // An bank object
            bank: {
                required: true // Null to create, io object to update
            },
            deleting:{
                required:false,
                default:false
            }
        },
        data(){ 
            return {
                form_valid:false,
                newbank: null,
                editing:false,
            }
        },
        methods: {
            title(){
                if (this.deleting==true){
                    return this.$t("Deleting bank")
                } else if (this.editing==true){
                    return this.$t("Updating bank")
                } else {
                    return this.$t("Creating a new bank")
                }
            },
            button(){
                if (this.editing){
                    return this.$t("Update")
                } else {
                    return this.$t("Add")
                }
            },
            acceptDialog(){
                if (this.$refs.form.validate()==false) return
                if (this.editing==true){               
                    axios.put(this.newbank.url, this.newbank, this.myheaders())
                    .then(() => {
                        this.$store.dispatch("getBanks")
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else{
                    axios.post(`${this.$store.state.apiroot}/api/banks/`, this.newbank,  this.myheaders())
                    .then(() => {
                        this.$store.dispatch("getBanks")
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
            },
            deleteBank () {
               var r = confirm(this.$t("This bank will be deleted. Do you want to continue?"))
               if(r == false) {
                  return
               } 
                axios.delete(this.newbank.url, this.myheaders())
                .then(() => {
                    this.$store.dispatch("getBanks")
                    this.$emit("cruded")
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
        },
        created(){
            if ( this.bank.url!=null){ // EDITING TIENE IO URL
                this.editing=true
            } else { // NEW IO BUT SETTING VALUES WITH URL=null
                this.editing=false
            }
            this.newbank=Object.assign({},this.bank)
        }
    }
</script>

