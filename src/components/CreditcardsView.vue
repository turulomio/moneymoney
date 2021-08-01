
<template>
    <div>    
        <h1>{{ $t(`Credit card details of '${cc.name}'`) }}
            <MyMenuInline :items="menuinline_items" @selected="MyMenuInlineSelection"></MyMenuInline>

        </h1>
        <v-card outlined class="ma-4 pa-4">
            <TableAccountOperations homogeneous :items="items_cco" :currency_account="account.currency" height="400" ref="table_cc" class=" flex-grow-1 flex-shrink-0" :locale='this.$i18n.locale' @editAO="editCCO" @deleteAO="deleteCCO"></TableAccountOperations>
        </v-card>
        <v-dialog v-model="dialog" max-width="550">
            <v-card class="pa-4">
                <v-card-title class="headline">{{dialog_title()}}</v-card-title>

                <v-form ref="form" v-model="form_valid_cco" lazy-validation>
                    <v-autocomplete :items="$store.state.catalogs.accounts.filter(v =>v.active==true)" v-model="cco.creditcards" :label="$t('Select a credit card')" item-text="name" item-value="url" required :rules="RulesSelection(false)"></v-autocomplete>
                    <v-datetime-picker label="Select operation date and time" v-model="cco.datetime" timeFormat="hh:mm:ss" :timePickerProps="{
      format: '24hr', useSeconds:true }"> </v-datetime-picker>
                    <v-autocomplete :items="$store.state.catalogs.concepts" v-model="cco.concepts" :label="$t('Select a concept')" item-text="name" item-value="url" required :rules="RulesSelection(false)"></v-autocomplete>
                    <v-text-field v-model="cco.amount" type="number" :label="$t('Operation amount')" required :placeholder="$t('Account number')" :rules="RulesString(30,true)" counter="30"/>
                    <v-text-field v-model="cco.comment" type="text" :label="$t('Operation comment')" required :placeholder="$t('Operation comment')" autofocus  counter="200"/>
                </v-form>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="acceptDialog()" :disabled="!form_valid_cco">{{ $t("Log in") }}</v-btn>
                    <v-btn color="error" @click="dialog = false">{{ $t("Cancel") }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import axios from 'axios'
    import MyMenuInline from './MyMenuInline.vue'
    import TableAccountOperations from './TableAccountOperations.vue'
    import {localtime} from '../functions.js'
    export default {
        components:{
            MyMenuInline,
            TableAccountOperations,
        },
        props:{
            cc:{
                required:true,
            },
            account:{
                required:true,
            },
        },
        data(){ 
            return{
                menuinline_items: [
                    {
                        subheader: this.$t("Credit card operation options"),
                        children: [
                            {
                                name:"Add a new credit card operation",
                                icon: "mdi-plus",
                                code: function(this_){
                                    this_.editing=false
                                    this_.cco=this_.empty_cco()
                                    this_.dialog=true
                                },
                            },
                        ]
                    },
                ],
                items_cco:[],
                dialog:false,
                form_valid_cco: false,
                cco: this.empty_cco(),
                editing:false,
                loading_cco:false,

                dialog_view:false,
                key:0,
            }
        },
        methods: {
            localtime,
            dialog_title(){
                if(this.editing==true){
                    return this.$t("Updating credit card operation")
                } else {
                    return this.$t("Creating a new credit card operation")
                }
            },
            empty_cco(){
                return {
                    datetime: new Date(),
                    concepts: null,
                    operationstypes:null,
                    amount: 0,
                    comment: "",    
                    creditcards: this.cc.url,
                }
            },
            MyMenuInlineSelection(item){
                item.code(this)
            },
            editCCO (item) {
                this.cco=item
                this.editing=true
                this.dialog=true
            },
            viewItem (item) {
                this.cco=item
                this.dialog_view=true
            },
            deleteCCO (item) {
               var r = confirm(this.$t("Do you want to delete this credit card operation?"))
               if(r == false) {
                  return
               } 
               r = confirm(this.$t("This credit card operation will be deleted. Do you want to continue?"))
               if(r == false) {
                  return
               } 
                axios.delete(item.url, this.myheaders())
                .then((response) => {
                    console.log(response);
                    this.update_table()
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            update_table(){
                this.loading_cco=true
                axios.get(`${this.$store.state.apiroot}/creditcardsoperations/withbalance?paid=false&creditcard=${this.cc.id}`, this.myheaders())
                .then((response) => {
                    this.items_cco=response.data
                    console.log(response.data);
                    this.loading_cco=false
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            acceptDialog(){
                console.log(this.cc)
                console.log(this.$refs)
                if (this.editing==true){               
                    axios.put(this.cco.url, this.cco, this.myheaders())
                    .then((response) => {
                            console.log(response.data)
                            this.update_table()     
                            this.dialog=false
                            this.editing=false
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else{
                    axios.post(`${this.$store.state.apiroot}/api/creditcardoperations/`, this.cco,  this.myheaders())
                    .then((response) => {
                            console.log(response.data)
                            this.update_table()     
                            this.dialog=false
                            this.editing=false
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
            },
        },
        mounted(){
            this.update_table()
        }
    }
</script>

