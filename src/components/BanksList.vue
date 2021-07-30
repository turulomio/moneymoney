
<template>
    <div>    
        <h1>{{ $t('Banks list') }}
            <MyMenuInline :items="menuinline_items" @selected="MyMenuInlineSelection"></MyMenuInline>

        </h1>
        <v-card outlined class="ma-4 pa-4">
            <v-checkbox v-model="showActive" :label="setCheckboxLabel()" @click="on_chkActive()" ></v-checkbox>
            <v-data-table :headers="headers" :items="data" sort-by="name" class="elevation-1" hide-default-footer :loading="loading_table">
                <template v-slot:[`item.active`]="{ item }">
                    <v-icon small v-if="item.active" >mdi-check-outline</v-icon>
                </template>  
                <template v-slot:[`item.balance_accounts`]="{ item }">
                    <div v-html="localcurrency_html(item.balance_accounts )"></div>
                </template>  
                <template v-slot:[`item.balance_investments`]="{ item }">
                    <div v-html="localcurrency_html(item.balance_investments )"></div>
                </template>  
                <template v-slot:[`item.balance_total`]="{ item }">
                    <div v-html="localcurrency_html(item.balance_total )"></div>
                </template>  
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small class="mr-2" @click="viewItem(item)">mdi-eye</v-icon>
                    <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                    <v-icon small @click="deleteItem(item)" v-if="item.is_deletable">mdi-delete</v-icon>
                </template>                            
                <template v-slot:[`body.append`]="{headers}">
                    <tr style="background-color: WhiteSmoke">
                        <td v-for="(header,i) in headers" :key="i">
                            <div v-if="header.value == 'name'">
                                Total
                            </div>
                            <div v-if="header.value == 'balance_accounts'" align="right" v-html="localcurrency_html(listobjects_sum(data,'balance_accounts'))">
                            </div>
                            <div v-if="header.value == 'balance_investments'" align="right" v-html="localcurrency_html(listobjects_sum(data,'balance_investments'))">
                            </div>
                            <div v-if="header.value == 'balance_total'" align="right" v-html="localcurrency_html(listobjects_sum(data,'balance_total'))">
                            </div>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog v-model="dialog" max-width="550">
            <v-card class="pa-4">
                <v-card-title class="headline">{{dialog_title()}}</v-card-title>
                <v-form ref="form" v-model="form_valid" lazy-validation>
                    <v-text-field v-model="bank.name" type="text" :label="$t('Bank name')" required :placeholder="$t('Bank name')" autofocus/>
                    <v-checkbox v-model="bank.active" :label="$t('Is active?')" ></v-checkbox>
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
                <BanksView :bank="bank" :key="key"></BanksView>
            </v-card>
        </v-dialog>

    </div>
</template>
<script>
    import axios from 'axios'
    import MyMenuInline from './MyMenuInline.vue'
    import BanksView from './BanksView.vue'
    export default {
        components:{
            MyMenuInline,
            BanksView,
        },
        data(){ 
            return{
                showActive:true,
                headers: [
                    { text: this.$t('Name'), sortable: true, value: 'name'},
                    { text: this.$t('Active'), value: 'active',  width: "12%"},
                    { text: this.$t('Accounts balance'), value: 'balance_accounts', align:'right',  width: "12%"},
                    { text: this.$t('Investments balance'), value: 'balance_investments', align:'right',  width: "12%"},
                    { text: this.$t('Total balance'), value: 'balance_total', align:'right',  width: "12%"},
                    { text: this.$t('Actions'), value: 'actions', sortable: false , width: "12%"},
                ],
                data:[],
                menuinline_items: [
                    {
                        subheader: this.$t("Bank options"),
                        children: [
                            {
                                name:"Add a new bank",
                                icon: "mdi-pencil",
                                code: function(this_){
                                    this_.editing=false
                                    this_.bank=this_.empty_bank()
                                    this_.dialog=true
                                },
                            },
                        ]
                    },
                ],
                dialog:false,
                form_valid: false,
                bank: this.empty_bank(),
                editing:false,
                loading_table:false,

                dialog_view:false,
                key:0,
            }
        },
        methods: {
            dialog_title(){
                if(this.editing==true){
                    return this.$t("Updating bank")
                } else {
                    return this.$t("Creating a new bank")
                }
            },
            empty_bank(){
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
                this.bank=item
                this.dialog=true
            },
            viewItem (item) {
                this.key=this.key+1
                this.bank=item
                this.dialog_view=true
            },
            deleteItem (item) {
               var r = confirm(this.$t("Do you want to delete this item?"))
               if(r == false) {
                  return
               } 
               r = confirm(this.$t("This bank will be deleted. Do you want to continue?"))
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
                axios.get(`${this.$store.state.apiroot}/banks/withbalance/?active=${this.showActive}`, this.myheaders())
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
                    return this.$t("Uncheck to see inactive banks")
                } else {
                    return this.$t("Check to see active banks")
                }
            },
            acceptDialog(){
                if (this.editing==true){               
                    axios.put(this.bank.url, this.bank, this.myheaders())
                    .then((response) => {
                            console.log(response.data)
                            this.update_table()     
                            this.dialog=false
                            this.editing=false
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else{
                    axios.post(`${this.$store.state.apiroot}/api/banks/`, this.bank,  this.myheaders())
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

