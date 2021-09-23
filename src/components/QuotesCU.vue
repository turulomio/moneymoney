<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-autocomplete dense :items="$store.state.products" v-model="newquote.products" :label="$t('Select a product')" item-text="name" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <MyDateTimePicker v-model="newquote.datetime" :label="$t('Set quote date and time')"></MyDateTimePicker>
                <v-text-field dense v-model.number="newquote.quote" type="number" :label="$t('Set quote')" :placeholder="$t('Set quote')" :rules="RulesInteger(10,true)" counter="10" autofocus/>
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
    import {empty_quote} from '../empty_objects.js'
    import MyDateTimePicker from './MyDateTimePicker.vue'
    export default {
        components: {
            MyDateTimePicker,
        },
        props: {
            // An account object
            quote: {
                required: true // Null to create, io object to update
            },
        },
        data(){ 
            return {
                form_valid:false,
                newquote: null,
                editing:false,
            }
        },
        methods: {
            empty_quote,
            title(){
                if (this.editing){
                    return this.$t("Updating quote")
                } else {
                    return this.$t("Creating a new quote")
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
                console.log("Accepting")
                if (this.editing==true){
                    axios.put(this.newquote.url, this.newquote,  this.myheaders())
                    .then((response) => {
                            console.log(response.data)
                            this.$emit("cruded")
                            this.editing=false
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else{
                    axios.post(`${this.$store.state.apiroot}/api/quotes/`, this.newquote,  this.myheaders())
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
            if ( this.quote.url!=null){ // EDITING TIENE IO URL
                this.editing=true
            } else { // NEW IO BUT SETTING VALUES WITH URL=null
                this.editing=false
            }
            this.newquote=Object.assign({},this.quote)
        }
    }
</script>

