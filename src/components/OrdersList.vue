
<template>
    <div>    
        <h1>{{ $t('Orders list') }}
            <MyMenuInline :items="menuinline_items" @selected="MyMenuInlineSelection"></MyMenuInline>
        </h1>
        <div class="d-flex justify-center mb-4">
            <v-card width="20%" class="pa-5">
                <v-select dense :label="$t('Filter by order state')" v-model="state" :items="items_state" item-value="id" item-text="name" @change="update_table()" :sort-by="getSort()"></v-select>
            </v-card>
        </div>
        <v-card outlined class="ma-4 pa-4">
            <v-data-table dense :headers="headers" :items="data" :sort-by="getSort()" :sort-desc="getSortDesc()" class="elevation-1" hide-default-footer disable-pagination :loading="loading_table">
                <template v-slot:[`item.price`]="{ item }">
                    <div v-html="currency_html(item.price, item.currency )"></div>
                </template>  
                <template v-slot:[`item.amount`]="{ item }">
                    <div v-html="currency_html(item.amount, item.currency )"></div>
                </template>  
                <template v-slot:[`item.percentage_from_price`]="{ item }">
                    <div v-html="percentage_html(item.percentage_from_price )"></div>
                </template>  
                <template v-slot:[`item.executed`]="{ item }">
                    <div v-html="localtime(item.executed )"></div>
                </template>  
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small class="mr-2" @click="viewItem(item)">mdi-eye</v-icon>
                    <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                    <v-icon small @click="deleteItem(item)" v-if="item.is_deletable">mdi-delete</v-icon>
                </template>                            
            </v-data-table>
        </v-card>
        <v-dialog v-model="dialog" max-width="550">
            <v-card class="pa-4">
                <v-card-title class="headline">{{dialog_title()}}</v-card-title>
                <v-form ref="form" v-model="form_valid" lazy-validation>
                    <v-text-field v-model="order.name" type="text" :label="$t('Order name')" required :placeholder="$t('Order name')" autofocus/>
                    <v-checkbox v-model="order.active" :label="$t('Is active?')" ></v-checkbox>
                </v-form>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="acceptDialog()" :disabled="!form_valid">{{ $t("Log in") }}</v-btn>
                    <v-btn color="error" @click="dialog = false">{{ $t("Cancel") }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialog_view">
            <v-card class="pa-4">
            </v-card>
        </v-dialog>

    </div>
</template>
<script>
    import axios from 'axios'
    import MyMenuInline from './MyMenuInline.vue'
    import {localtime} from '../functions.js'
    export default {
        components:{
            MyMenuInline,
        },
        data(){ 
            return{
                items_state: [
                    {"id":0, "name":this.$t("Active")},
                    {"id":1, "name":this.$t("Expired")},
                    {"id":2, "name":this.$t("Executed")},

                ],
                state: 0,
                headers: [
                    { text: this.$t('Date'), sortable: true, value: 'date',  width: "6%"},
                    { text: this.$t('Expiration'), value: 'expiration',  width: "6%"},
                    { text: this.$t('Investment'), value: 'investmentsname'},
                    { text: this.$t('Shares'), value: 'shares', align:'right',  width: "7%"},
                    { text: this.$t('Price'), value: 'price', align:'right',  width: "7%"},
                    { text: this.$t('Amount'), value: 'amount', align:'right',  width: "7%"},
                    { text: this.$t('% from price'), value: 'percentage_from_price', align:'right',  width: "7%"},
                    { text: this.$t('Executed'), value: 'executed', align:'right',  width: "10%"},
                    { text: this.$t('Actions'), value: 'actions', sortable: false , width: "7%"},
                ],
                data:[],
                menuinline_items: [
                    {
                        subheader: this.$t("Order options"),
                        children: [
                            {
                                name:"Add a new order",
                                icon: "mdi-pencil",
                                code: function(this_){
                                    this_.editing=false
                                    this_.order=this_.empty_order()
                                    this_.dialog=true
                                },
                            },
                        ]
                    },
                ],
                dialog:false,
                form_valid: false,
                order: this.empty_order(),
                editing:false,
                loading_table:false,

                dialog_view:false,
                key:0,
            }
        },
        methods: {
            localtime,
            getSort(){
                if (this.state==0){//Active
                    return "percentage_from_price"
                } else if (this.state==1) { //expired
                    return "expiration"
                } else if (this.state==2) { //executed
                    return "executed"
                }
            },
            getSortDesc(){
                
                if (this.state==0){//Active
                    return true
                } else if (this.state==1) { //expired
                    return true
                } else if (this.state==2) { //executed
                    return true
                }
            },
            dialog_title(){
                if(this.editing==true){
                    return this.$t("Updating order")
                } else {
                    return this.$t("Creating a new order")
                }
            },
            empty_order(){
                return {
                    name: "",
                    active: true,
                }
            },
            MyMenuInlineSelection(item){
                item.code(this)
            },
            editItem (item) {
                this.editing=true
                this.order=item
                this.dialog=true
            },
            viewItem (item) {
                this.key=this.key+1
                this.order=item
                this.dialog_view=true
            },
            deleteItem (item) {
               var r = confirm(this.$t("Do you want to delete this item?"))
               if(r == false) {
                  return
               } 
               r = confirm(this.$t("This order will be deleted. Do you want to continue?"))
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
                this.loading_table=true
                var url=""
                if (this.state==0){//Active
                    url=`${this.$store.state.apiroot}/orders/list/?active=true`
                } else if (this.state==1) { //expired
                    url=`${this.$store.state.apiroot}/orders/list/?expired=true`
                } else if (this.state==2) { //executed
                    url=`${this.$store.state.apiroot}/orders/list/?executed=true`
                }


                axios.get(url, this.myheaders())
                .then((response) => {
                    this.data=response.data
                    console.log(response);
                    this.loading_table=false
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            on_chkActive(){
                this.update_table()
            },
            setCheckboxLabel(){
                if (this.showActive== true){
                    return this.$t("Uncheck to see inactive orders")
                } else {
                    return this.$t("Check to see active orders")
                }
            },
            acceptDialog(){
                if (this.editing==true){               
                    axios.put(this.order.url, this.order, this.myheaders())
                    .then((response) => {
                            console.log(response.data)
                            this.update_table()     
                            this.dialog=false
                            this.editing=false
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else{
                    axios.post(`${this.$store.state.apiroot}/api/orders/`, this.order,  this.myheaders())
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

