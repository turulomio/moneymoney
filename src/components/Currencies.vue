<template>
    <div>    
        <h1>{{ $t('Used currencies') }}</h1>
        <v-card outlined class="ma-4 pa-4">
            <v-data-table dense :headers="headers" :items="items" sort-by="from" class="elevation-1 cursorpointer" hide-default-footer disable-pagination :key="key">
                <template v-slot:[`item.datetime`]="{ item }">
                    {{localtime(item.datetime)}}
                </template>     
                <template v-slot:[`item.supported`]="{ item }">
                    <v-icon small v-if="item.supported" >mdi-check-outline</v-icon>
                </template>       
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon v-if="item.can_c" small class="mr-2" @click="addItem(item)">mdi-plus</v-icon>
                    <v-icon v-if="item.can_rud" small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                    <v-icon v-if="item.can_rud" small @click="deleteItem(item)">mdi-delete</v-icon>
                </template>
            </v-data-table>
        </v-card>

        <!-- QUOTES CU -->
        <v-dialog v-model="dialog_quotescu" width="50%">
            <v-card class="pa-4">
                <QuotesCU :quote="quote" :mode="quote_mode" :key="key" @cruded="on_QuotesCU_cruded" />
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import axios from 'axios'
    import QuotesCU from './QuotesCU.vue'
    import {empty_quote} from '../empty_objects.js'
    export default {
        name:"Currencies",
        components:{
            QuotesCU,
        },
        data(){ 
            return{
                headers: [
                    { text: this.$t('From'), sortable: true, value: 'from'},
                    { text: this.$t('To'), sortable: true, value: 'to'},
                    { text: this.$t('Supported'), sortable: true, value: 'supported'},
                    { text: this.$t('Date and time'), sortable: true, value: 'datetime'},
                    { text: this.$t('Factor'), value: 'quote'},
                    { text: this.$t('Actions'), value: 'actions', sortable: false , width: "10%"},
                ],
                items:[],
                dialog_quotescu:false,
                quote:null,
                quote_mode: null,
                key:0,
            }
        },
        methods: {
            empty_quote,
            editItem (item) {
                this.quote= {
                    url: item.quote_url,
                    datetime: item.datetime,
                    quote: item.quote,
                    products: item.product_url,
                }
                this.quote_mode="U"
                this.key=this.key+1
                this.dialog_quotescu=true
            },
            addItem (item) {
                this.quote= {
                    url: null,
                    datetime: new Date(),
                    quote: null,
                    products: item.product_url,
                }
                this.quote_mode="C"
                this.key=this.key+1
                this.dialog_quotescu=true
            },
            deleteItem (item) {
                this.quote= {
                    url: item.quote_url,
                    datetime: item.datetime,
                    quote: item.quote,
                    products: item.product_url,
                }
                this.quote_mode="D"
                this.key=this.key+1
                this.dialog_quotescu=true
            },
            update_table(){
                axios.get(`${this.$store.state.apiroot}/currencies/`, this.myheaders())
                .then((response) => {
                    this.items=response.data
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            on_AccountsoperationsSearch_cruded(){
                this.update_table()
            },
            on_QuotesCU_cruded(){
                this.dialog_quotescu=false
                this.update_table()
            },
        },
        mounted(){
            this.update_table()
        }
    }
</script>

