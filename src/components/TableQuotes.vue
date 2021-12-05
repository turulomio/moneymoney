<template>
    <div>
        <v-data-table dense :headers="table_headers()" :items="items" class="elevation-1" disable-pagination  hide-default-footer sort-by="datetime" fixed-header :height="$attrs.height" :ref="$vnode.tag">
            <template v-slot:[`item.datetime`]="{ item, index}" >
                <div :ref="index">{{ localtime(item.datetime)}}</div>
            </template>        
            <template v-slot:[`item.quote`]="{ item }">
                <div v-html="this.currency_html(item.quote,this.currency)"></div>
            </template>   
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editQuote(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteQuote(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>   
        <!-- QUOTES CU-->
        <v-dialog v-model="dialog_quotes_cu" width="35%">
            <v-card class="pa-3">
                <QuotesCU :quote="quote" :investment="investment" :key="key"  @cruded="on_QuotesCU_cruded()"></QuotesCU>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>    
    import axios from 'axios'
    import QuotesCU from './QuotesCU.vue'
    import {localtime} from '../functions.js'
    export default {
        components:{
            QuotesCU,
        },
        props: {
            items: {
                required: true
            },
            currency: {
                required: true
            },
        },
        data: function(){
            return {
                dialog_quotes_cu:false,
                quote: null,
                investment: null,
                key: 0,
            }
        },
        methods: {
            localtime,
            editQuote(item){
                this.quote=item
                this.investment={url:this.dividend.investments}
                this.dialog_dividend=true
                this.key=this.key+1
            },
            deleteQuote(item){
               var r = confirm(this.$t("Do you want to delete this dividend?"))
               if(r == false) {
                  return
               } 
                axios.delete(item.url, this.myheaders())
                .then(() => {
                    this.$emit("cruded")
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            table_headers(){
                var r= [
                    { text: this.$t('Date and time'), value: 'datetime', sortable: true },
                    { text: this.$t('Quote'), value: 'quote', sortable: true },
                    { text: this.$t('Actions'), value: 'actions', sortable: false },
                ]
                return r
            },
            gotoLastRow(){
                this.$vuetify.goTo(this.$refs[this.items.length-1], { container:  this.$refs[this.$vnode.tag].$el.childNodes[0] }) 
            },
            on_QuotesCU_cruded(){
                this.$emit("cruded")
            }
        },
        mounted(){
            // this.gotoLastRow()
            // this.key=this.key+1
            // console.log("DIVIDENDS TABLE")
        }
    }
</script>