<template>
    <div>    
        <h1>{{ $t('Used currencies') }}</h1>
        <v-card outlined class="ma-4 pa-4">
            <v-data-table dense :headers="headers" :items="items" sort-by="from" class="elevation-1 cursorpointer" hide-default-footer disable-pagination :key="key">
                <template v-slot:[`item.datetime`]="{ item }">
                    {{localtime(item.datetime)}}
                </template>         
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon v-if="item.supported" small class="mr-2" @click="addItem(item)">mdi-plus</v-icon>
                    <v-icon v-if="item.factor" small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                    <v-icon v-if="item.factor" small @click="deleteItem(item)">mdi-delete</v-icon>
                </template>                  
                <template v-slot:[`body.append`]="{headers}">
                    <tr class="totalrow">
                        <td v-for="(header,i) in headers" :key="i">
                            <div v-if="header.value == 'localname'">
                                Total
                            </div>
                            <div v-if="header.value == 'balance_user'" class="d-flex justify-end" v-html="localcurrency_html(listobjects_sum(accounts_items,'balance_user'))">
                            </div>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>

        <!-- QUOTES CU -->
        <v-dialog v-model="dialog_quotescu" width="35%">
            <v-card class="pa-4">
                <QuotesCU :quote="quote" :key="key" />
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
                    { text: this.$t('From'), sortable: true, value: 'from', width:"21%"},
                    { text: this.$t('To'), sortable: true, value: 'to', width:"21%"},
                    { text: this.$t('Date and time'), sortable: true, value: 'datetime', width:"21%"},
                    { text: this.$t('Factor'), value: 'factor',  width: "8%"},
                    { text: this.$t('Actions'), value: 'actions', sortable: false , width: "7%"},
                ],
                items:[],
                dialog_quotescu:false,
                quote:null,
                key:0,
            }
        },
        methods: {
            empty_quote,
            editItem (item) {
                this.account=item
                this.account_deleting=false
                this.key=this.key+1
                this.dialog=true
            },
            addItem (item) {
                this.key=this.key+1
                this.account=item
                this.dialog_view=true
            },
            deleteItem (item) {
                this.account=item
                this.key=this.key+1
                this.account_deleting=true
                this.dialog=true
            },
            update_table(){
                axios.get(`${this.$store.state.apiroot}/currencies/`, this.myheaders())
                .then((response) => {
                    this.items=response.data
                    console.log(this.items)
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

