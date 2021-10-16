<template>
    <div>    
        <h1>{{ title() }}
            <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>
        </h1>           
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
    import moment from 'moment-timezone';
    import MyDateTimePicker from './MyDateTimePicker.vue'
    import MyMenuInline from './MyMenuInline.vue'
    export default {
        components: {
            MyDateTimePicker,
            MyMenuInline,
        },
        props: {
            // An account object
            quote: {
                required: true // Null to create, io object to update
            },
        },
        watch:{
            'newquote.products': function (newVal){
                console.log("CHANGED")
                var product=this.$store.getters.getObjectByUrl("products", newVal)
                this.stockmarket=this.$store.getters.getObjectByUrl("stockmarkets",product.stockmarkets)
                console.log(this.stockmarket)
            },
        },
        data(){ 
            return {
                form_valid:false,
                newquote: null,
                stockmarket:null,
                editing:false,
                menuinline_items: [
                    {
                        subheader: this.$t("Date and time options"),
                        children: [
                            {
                                name: this.$t("Set the time at the close of the stock market"),
                                icon: "mdi-calendar",
                                code: function(this_){
                                   this_.newquote.datetime=moment(`${this_.newquote.datetime.slice(0,10)}T${this_.stockmarket.closes}`)
                                },
                            },
                            {
                                name: this.$t("Set the time at the close of the futures stock market"),
                                icon: "mdi-calendar ",
                                code: function(this_){
                                   this_.newquote.datetime=moment(`${this_.newquote.datetime.slice(0,10)}T${this_.stockmarket.closes_futures}`)
                                },
                            },
                        ]
                    },
                ],
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
            console.log(this.newquote)
            console.log("AHORA")
        }
    }
</script>

