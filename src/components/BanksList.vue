
<template>
    <div>    
        <h1>{{ $t('Banks list') }}
            <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>
        </h1>
        <v-card outlined class="ma-4 pa-4">
            <v-checkbox v-model="showActive" :label="setCheckboxLabel()" @click="on_chkActive()" ></v-checkbox>
            <v-data-table dense :headers="headers" :items="data" sort-by="name" class="elevation-1" hide-default-footer :loading="loading_table">
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
        <v-dialog v-model="dialog" width="35%">
            <v-card class="pa-4">
                <BanksCU :bank="bank" :deleting="bank_deleting" :key="key" @cruded="on_BanksCU_cruded()"></BanksCU>
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
    import BanksCU from './BanksCU.vue'
    import BanksView from './BanksView.vue'
    import {empty_bank} from '../empty_objects.js'
    export default {
        components:{
            MyMenuInline,
            BanksCU,
            BanksView,
        },
        data(){ 
            return{
                showActive:true,
                headers: [
                    { text: this.$t('Name'), sortable: true, value: 'localname'},
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
                                name:this.$t("Add a new bank"),
                                icon: "mdi-pencil",
                                code: function(this_){
                                    this_.editing=false
                                    this_.bank_deleting=false
                                    this_.bank=this_.empty_bank()
                                    this_.key=this_.key+1
                                    this_.dialog=true
                                },
                            },
                        ]
                    },
                ],
                dialog:false,
                bank: null,
                bank_deleting: false,
                loading_table:false,

                dialog_view:false,
                key:0,
            }
        },
        methods: {
            deleteItem (item) {
                this.bank=item
                this.bank_deleting=true
                this.key=this.key+1
                this.dialog=true
            },
            empty_bank,
            editItem (item) {
                this.bank=item
                this.bank_deleting=false
                this.key=this.key+1
                this.dialog=true
            },
            viewItem (item) {
                this.bank=item
                this.key=this.key+1
                this.dialog_view=true
            },

            update_table(){
                this.loading_table=true
                axios.get(`${this.$store.state.apiroot}/banks/withbalance/?active=${this.showActive}`, this.myheaders())
                .then((response) => {
                    this.data=response.data
                    this.loading_table=false
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            on_BanksCU_cruded(){
                this.dialog=false
                this.update_table()
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

        },
        mounted(){
            this.update_table()
        }
    }
</script>

