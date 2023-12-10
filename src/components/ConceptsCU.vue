<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid">
                <v-text-field :readonly="deleting" density="compact" v-model="newconcept.name" :label="$t('Set concept')" :placeholder="$t('Set concept')" :rules="RulesString(200,true)" counter="200" autofocus/>
                <v-autocomplete :readonly="deleting || editing" density="compact" :items="this.getOperationstypesForNewConcepts()" v-model="newconcept.operationstypes" :label="$t('Select an operation type')" item-title="localname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn v-if="deleting" color="error" @click="deleteConcept()">{{ $t("Delete") }}</v-btn>
                <v-btn v-if="!deleting" color="primary" @click="accept()" :disabled="!form_valid">{{ button() }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import { RulesSelection } from 'vuetify_rules'
    export default {
        components: {
        },
        props: {
            // An account object
            concept: {
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
                newconcept: null,
                editing:false,
            }
        },
        methods: {
            RulesSelection,
            title(){
                if (this.deleting==true){
                    return this.$t("Deleting concept")
                } else if (this.editing==true){
                    return this.$t("Updating concept")
                } else {
                    return this.$t("Creating a new concept")
                }
            },
            button(){
                if (this.editing){
                    return this.$t("Update")
                } else {
                    return this.$t("Add")
                }
            },
            accept(){
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }
                if (this.editing==true){
                    axios.put(this.newconcept.url, this.newconcept,  this.myheaders())
                    .then((response) => {
                        this.store().concepts.set(response.data.url,response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else{
                    axios.post(`${this.store().apiroot}/api/concepts/`, this.newconcept,  this.myheaders())
                    .then((response) => {
                        this.store().concepts.set(response.data.url,response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
            },
            deleteConcept(){
                var r
                r = confirm(this.$t("Do you want to delete this concept?"))
                if(r == false) {
                    return
                }  
                axios.delete(this.newconcept.url, this.myheaders())
                .then((response) => {
                    this.store().concepts.delete(response.data.url,response.data)
                    this.$emit("cruded")
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
        },
        created(){
            if ( this.concept.url!=null){ // EDITING TIENE IO URL
                this.editing=true
            } else { // NEW IO BUT SETTING VALUES WITH URL=null
                this.editing=false
            }
            this.newconcept=Object.assign({},this.concept)
        }
    }
</script>

