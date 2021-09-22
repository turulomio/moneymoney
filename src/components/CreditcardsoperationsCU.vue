
<template>
    <div>    
        <h1 class="mb-6">{{ dialog_title() }}</h1>
        <v-card class="pa-6">
            <v-form ref="form_cco" v-model="form_valid_cco" lazy-validation>
                <v-autocomplete :items="$store.state.creditcards.filter(v =>v.active==true)" v-model="newcco.creditcards" :label="$t('Select a credit card')" item-text="name" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <MyDateTimePicker label="Select operation date and time" v-model="newcco.datetime" :rules="RulesDatetime(true)" ></MyDateTimePicker>
                <v-autocomplete autoindex="0" :items="$store.state.concepts" v-model="newcco.concepts" :label="$t('Select a concept')" item-text="name" item-value="url" :rules="RulesSelection(true)" autofocus></v-autocomplete>
                <v-text-field autoindex="1" v-model="newcco.amount" type="number" :label="$t('Operation amount')" :placeholder="$t('Operation amount')" :rules="RulesFloat(30,true)" counter="30"/>
                <v-text-field autoindex="2" v-model="newcco.comment" type="text" :label="$t('Operation comment')" :placeholder="$t('Operation comment')" :rules="RulesString(200, false)" counter="200"/>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="acceptDialog()" :disabled="!form_valid_cco">{{ button() }}</v-btn>
            </v-card-actions>
        </v-card>
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
            cco:{
                required:true,
            },
        },
        data(){ 
            return{
                form_valid_cco: false,
                editing:false,
                key:0,
                newcco:null,
            }
        },
        methods: {
            button(){
                if(this.editing==true){
                    return this.$t("Update")
                } else {
                    return this.$t("Create")
                }
            },     
            dialog_title(){
                if(this.editing==true){
                    return this.$t("Updating credit card operation")
                } else {
                    return this.$t("Creating a new credit card operation")
                }
            },
            deleteCCO (item) {
               var r = confirm(this.$t("Do you want to delete this credit card operation?"))
               if(r == false) {
                  return
               }
                axios.delete(item.url, this.myheaders())
                .then((response) => {
                    console.log(response);
                    this.$emit("cruded")
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            acceptDialog(){
                //Validation
                if( this.$refs.form_cco.validate()==false) return
                var concept=this.$store.getters.getObjectByUrl("concepts",this.newcco.concepts)
                var operationtype=this.$store.getters.getObjectByUrl("operationstypes", concept.operationstypes)
                this.newcco.operationstypes=operationtype.url
                if (operationtype.id==1 && this.newcco.amount>0){
                     alert(this.$t("Amount must be negative"))
                     return
                }
                if (operationtype.id==2 && this.newcco.amount<0) {
                    alert(this.$t("Amount must be positive"))
                    return
                }

                //Accept
                if (this.editing==true){               
                    axios.put(this.newcco.url, this.newcco, this.myheaders())
                    .then((response) => {
                            console.log(response.data)
                            this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else{
                    axios.post(`${this.$store.state.apiroot}/api/creditcardsoperations/`, this.newcco,  this.myheaders())
                    .then((response) => {
                            console.log(response.data)
                            this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
            },
        },
        created(){
            if ( this.cco.url!=null){ // EDITING TIENE IO URL
                this.editing=true
            } else { // NEW IO BUT SETTING VALUES WITH URL=null
                this.editing=false
            }
            this.newcco=Object.assign({}, this.cco)
        }
    }
</script>

