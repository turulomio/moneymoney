<template>
    <div>
        <v-data-table dense :headers="table_headers()" :items="items" class="elevation-1" disable-pagination  hide-default-footer :sort-by="$attrs.sort_by" fixed-header :height="$attrs.height" :loading="$attrs.loading">
            <template v-slot:[`item.datetime`]="{ item }" >
                <div>{{ localtime(item.datetime)}}</div>
            </template>        
            <template v-slot:[`item.quote`]="{ item }">
                <div v-html="currency_html(item.quote,item.currency,item.decimals)"></div>
            </template>   
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editQuote(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteQuote(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>   
        <!-- QUOTES CU-->
        <v-dialog v-model="dialog_quotes_cu" width="35%">
            <v-card class="pa-3">
                <QuotesCU :quote="quote" :key="key"  @cruded="on_QuotesCU_cruded()"></QuotesCU>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>    
    import axios from 'axios'
    import QuotesCU from './QuotesCU.vue'
    export default {
        components:{
            QuotesCU,
        },
        props: {
            items: { //List of object with  datetime, quote, id, product (url), decimal, currency, name attributes
                required: true
            },
            show_name:{ // Show product name
                type: Boolean,
                required: false,
                default: false,
            },
            no_delete_confirmation:{
                type: Boolean,
                required: false,
                default: false,
            },
            
        },
        data: function(){
            return {
                dialog_quotes_cu:false,
                quote: null,
                key: 0,
            }
        },
        methods: {
            editQuote(item){
                this.quote=item
                this.key=this.key+1
                this.dialog_quotes_cu=true
            },
            deleteQuote(item){
                if (this.no_delete_confirmation==false){
                    var r = confirm(this.$t("Do you want to delete this quote?"))
                    if(r == false) {
                        return
                    } 
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
                    { text: this.$t('Product'), value: 'name', sortable: true },
                    { text: this.$t('Quote'), value: 'quote', sortable: true ,align:"right"},
                    { text: this.$t('Actions'), value: 'actions', sortable: false },
                ]
                return r
            },
            on_QuotesCU_cruded(){
                this.dialog_quotes_cu=false
                this.$emit("cruded")
            }
        },
    }
</script>