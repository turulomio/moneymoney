<template>
    <div>    
        <h1>{{ title() }}
            <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>
        </h1>           
        <div class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid">                
                <MyDateTimePicker :readonly="mode=='D'" v-model="new_quote.datetime" :label="$t('Set quote date and time')" />
                <AutocompleteProducts :readonly="mode=='D'" v-model="new_quote.products" :rules="RulesSelection(true)"  />
                <v-text-field  :readonly="mode=='D'" v-model.number="new_quote.quote"  :label="$t('Set quote')" :placeholder="$t('Set quote')" :rules="RulesFloatGEZ(12,true,product_object.decimals)" counter="12" autofocus/>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="accept()">{{ button() }}</v-btn>
            </v-card-actions>
        </div>
    </div>
</template>
<script>
    import axios from 'axios'
    import {empty_quote} from '../empty_objects.js'
    import { RulesSelection } from 'vuetify_rules'
    import AutocompleteProducts from './AutocompleteProducts.vue'
    import moment from 'moment-timezone';
    import MyDateTimePicker from './MyDateTimePicker.vue'
    import MyMenuInline from './MyMenuInline.vue'
    export default {
        components: {
            MyDateTimePicker,
            MyMenuInline,
            AutocompleteProducts,
        },
        props: {
            quote: { //A quote object
                required: true 
            },
            mode: {
                requited: true
            }
        },
        computed:{
            product_object: function(){

                return this.store().products.get(this.new_quote.products)
            },
            product_stockmarket: function(){
                return this.store().stockmarkets.get(this.product_object.stockmarkets)
            },
        },
        data(){ 
            return {
                form_valid:false,
                new_quote: null,
                editing:false,
                menuinline_items: [
                    {
                        subheader: this.$t("Date and time options"),
                        children: [
                            {
                                name: this.$t("Set the time at the start of the futures stock market"),
                                icon: "mdi-calendar",
                                code: function(){
                                   this.new_quote.datetime=moment(`${this.new_quote.datetime.slice(0,10)}T${this.product_stockmarket.starts_futures}`).toISOString()
                                }.bind(this),
                            },
                            {
                                name: this.$t("Set the time at the start of the stock market"),
                                icon: "mdi-calendar ",
                                code: function(){
                                   this.new_quote.datetime=moment(`${this.new_quote.datetime.slice(0,10)}T${this.product_stockmarket.starts}`).toISOString()
                                }.bind(this),
                            },
                            {
                                name: this.$t("Set the time at the close of the stock market"),
                                icon: "mdi-calendar ",
                                code: function(){
                                   this.new_quote.datetime=moment(`${this.new_quote.datetime.slice(0,10)}T${this.product_stockmarket.closes}Z`).toISOString()
                                }.bind(this),
                            },
                            {
                                name: this.$t("Set the time at the close of the futures stock market"),
                                icon: "mdi-calendar ",
                                code: function(){
                                   this.new_quote.datetime=moment(`${this.new_quote.datetime.slice(0,10)}T${this.product_stockmarket.closes_futures}`).toISOString()
                                }.bind(this),
                            },
                        ]
                    },
                ],
            }
        },
        methods: {
            RulesSelection,
            empty_quote,
            title(){
                if (this.mode=="C") return this.$t("Add a quote")
                if (this.mode=="U") return this.$t("Update quote")
                if (this.mode=="D") return this.$t("Delete quote")
            },
            button(){
                if (this.mode=="C") return this.$t("Add")
                if (this.mode=="U") return this.$t("Update")
                if (this.mode=="D") return this.$t("Delete")
            },
            accept(){
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }
                if (this.mode=="U"){
                    axios.put(this.new_quote.url, this.new_quote,  this.myheaders())
                    .then(() => {
                            this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="C") {
                    axios.post(`${this.store().apiroot}/api/quotes/`, this.new_quote,  this.myheaders())
                    .then(() => {
                            this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="D") {
                    var r = confirm(this.$t("Do you want to delete this quote?"))
                    if(r == false) {
                        return
                    } 
                    axios.delete(this.new_quote.url, this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
            },
        },
        created(){
            this.new_quote=Object.assign({},this.quote)
        }
    }
</script>

