
<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-text-field :readonly="mode=='D'" v-model="newpc.name" :label="$t('Set name')" :placeholder="$t('Set name')" :rules="RulesString(200,true)" counter="200"/>
                <AutocompleteProducts :readonly="mode=='D'" v-model="newpc.a" :rules="RulesSelection(true)" :label="$t('Select product A (stronger)')" />
                <AutocompleteProducts :readonly="mode=='D'" v-model="newpc.b" :rules="RulesSelection(true)" :label="$t('Select product B')" />
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
            pc: {
                required: true // PC object
            },
            mode: {
                required: true // Can be CUD
            }
        },
        data(){ 
            return {
                form_valid:false,
                newpc:null,
            }
        },
        methods: {
            title(){
                if (this.mode=="U"){
                    return this.$t("Updating a products comparation")
                } else  if (this.mode=="C"){
                    return this.$t("Creating a products comparation")
                } else  if (this.mode=="D"){
                    return this.$t("Deleting a products comparation")
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
            accept(){
                if (this.mode=="U"){
                    axios.put(this.newpc.url, this.newpc,  this.myheaders())
                    .then(() => {
                            this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="C"){
                    axios.post(`${this.$store.state.apiroot}/api/productspairs/`, this.newpc,  this.myheaders())
                    .then(() => {
                            this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="D"){
                    var r = confirm(this.$t("Do you want to delete this products comparation?"))
                    if(r == false) {
                        return
                    } 
                    axios.delete(this.newpc.url, this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                }
            },

        },
        created(){
            this.newpc=Object.assign({},this.pc)
        }
    }
</script>

