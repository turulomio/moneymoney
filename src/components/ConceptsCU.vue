<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid">
                <v-text-field data-test="ConceptsCU_Name" :readonly="mode=='D'" density="compact" v-model="new_concept.name" :label="$t('Set concept')" :placeholder="$t('Set concept')" :rules="RulesString(200,true)" counter="200" autofocus/>
                <v-autocomplete data-test="ConceptsCU_OperationsTypes" :readonly="mode=='D' || editing" density="compact" :items="useStore().getOperationstypesForNewConcepts" v-model="new_concept.operationstypes" :label="$t('Select an operation type')" item-title="localname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" data-test="ConceptsCU_Button" @click="accept()" :disabled="!form_valid">{{ button() }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import { useStore } from '@/store'
    import { RulesSelection, RulesString } from 'vuetify_rules'
    import { parseResponseError, myheaders } from '@/functions'
    export default {
        components: {
        },
        props: {
            // An account object
            concept: {
                required: true // Null to create, io object to update
            },
            mode: {
                required: true // Can be CUD
            }
        },
        data(){ 
            return {
                form_valid:false,
                new_concept: null,
                editing:false,
            }
        },
        methods: {
            parseResponseError,
            RulesSelection,
            RulesString,
            useStore,
            myheaders,
            title(){
                if (this.mode=="D"){
                    return this.$t("Deleting concept")
                } else if (this.mode=="U"){
                    return this.$t("Updating concept")
                } else if (this.mode=="C"){
                    return this.$t("Creating a new concept")
                }
            },
            button(){
                if (this.mode=="U"){
                    return this.$t("Update")
                } else if (this.mode=="C"){
                    return this.$t("Add")
                } else if (this.mode=="D"){
                    return this.$t("Delete")
                }
            },
            accept(){
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }
                if (this.mode=="U"){
                    axios.put(this.new_concept.url, this.new_concept,  this.myheaders())
                    .then((response) => {
                        useStore().concepts.set(response.data.url,response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="C"){
                    axios.post(`${useStore().apiroot}/api/concepts/`, this.new_concept,  this.myheaders())
                    .then((response) => {
                        useStore().concepts.set(response.data.url,response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="D"){
                    var r
                    r = confirm(this.$t("Do you want to delete this concept?"))
                    if(r == false) {
                        return
                    }  
                    axios.delete(this.new_concept.url, this.myheaders())
                    .then((response) => {
                        useStore().concepts.delete(response.data.url,response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                }
            },
        },
        created(){
            this.new_concept=Object.assign({},this.concept)
        }
    }
</script>

