
<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-text-field v-model="newpc.name" :label="$t('Set name')" :placeholder="$t('Set name')" :rules="RulesString(200,true)" counter="200"/>
                <AutocompleteProducts v-model="newpc.a" :rules="RulesSelection(true)" :label="$t('Select product A (stronger)')" />
                <AutocompleteProducts v-model="newpc.b" :rules="RulesSelection(true)" :label="$t('Select product B')" />
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="accept()" :disabled="!form_valid">{{ button() }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import AutocompleteProducts from './AutocompleteProducts.vue'
    export default {
        components: {

            AutocompleteProducts,
        },
        props: {
            // An account object
            pc: {
                required: true // Null to create, pc object to update
            }
        },
        data(){ 
            return {
                form_valid:false,
                newpc:null,
                editing:false,
            }
        },
        methods: {
            title(){
                if (this.editing){
                    return this.$t("Updating products comparation")
                } else {
                    return this.$t("Creating a products comparation")
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
                if (this.editing==true){
                    axios.put(this.newpc.url, this.newpc,  this.myheaders())
                    .then(() => {
                            this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else{
                    axios.post(`${this.$store.state.apiroot}/api/productspairs/`, this.newpc,  this.myheaders())
                    .then(() => {
                            this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
            },

        },
        created(){
            if (this.pc.url!=null){
                this.editing=true
            }
            this.newpc=Object.assign({},this.pc)
        }
    }
</script>

