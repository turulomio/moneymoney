<!--
    Actions:
       - cruded
       - onedit
-->


<template>
    <div>
        <v-data-table dense v-model="selected" :headers="table_headers()" :items="items" class="elevation-1" disable-pagination  hide-default-footer sort-by="datetime" fixed-header :height="$attrs.height" ref="table_o" :key="$attrs.key" :loading="$attrs.loading">
            <template v-slot:[`item.datetime`]="{ item,index }">
            <div :ref="index">{{ localtime(item.datetime)}}</div>
            </template>           
           <template v-slot:[`item.operationstypes`]="{ item }">
               <div v-html="$store.getters.getObjectPropertyByUrl('operationstypes',item.operationstypes,'localname')"></div>
           </template>
            <template v-slot:[`item.price`]="{ item }">
            {{ currency_string(item.price, currency_investment)}}
            </template>
                         
            <template v-slot:[`item.name`]="{ item }">
                <div v-html="$store.getters.getObjectPropertyByUrl('investments', item.investments,'fullname')"></div>
            </template>  
            <template v-slot:[`item.gross_account`]="{ item }">
            {{ currency_string(item.gross_account, currency_account)}}
            </template>
            <template v-slot:[`item.gross_investment`]="{ item }">
            {{ currency_string(item.gross_investment, currency_investment)}}
            </template>
            <template v-slot:[`item.gross_user`]="{ item }">
            {{ currency_string(item.gross_user, currency_user)}}
            </template>
            
            <template v-slot:[`item.commission`]="{ item }">
            {{ currency_string(item.commission, currency_investment)}}
            </template>
            <template v-slot:[`item.taxes`]="{ item }">
            {{ currency_string(item.taxes, currency_investment)}}
            </template>
            
            <template v-slot:[`item.net_account`]="{ item }">
            {{ currency_string(item.net_account, currency_account)}}
            </template>
            <template v-slot:[`item.net_investment`]="{ item }">
            {{ currency_string(item.net_investment, currency_investment)}}
            </template>
            <template v-slot:[`item.net_user`]="{ item }">
            {{ currency_string(item.net_user, currency_user)}}
            </template>
            
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editIO(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteIO(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>
    </div>
</template>

<script>    
    import axios from 'axios'
    import {localtime} from '../functions.js'
    export default {
        props: {
            items: {
                required: true
            },
            currency_account: {
                required: true,
                default:"EUR",
            },
            currency_investment: {
                required: true,
                default:"EUR",
            },
            currency_user: {
                required: true,
                default:"EUR",
            },
            heterogeneus:{
                type: Boolean,
                required:false,
                default:false
            },
            showactions:{ //Used to edit io operation
                required:false,
                default:true
            },
            output:{ // "investmnt", account or user to see table ouput
                required:true,
                default: "investment",
            },
        },
        data: function(){
            return {
                selected: [],
                key:0,  
            }
        },
        computed:{
        },
        methods: {
            localtime,
            table_headers(){
                var r
                if (this.output=="account"){
                    r= [
                        { text: this.$t('Date and time'), value: 'datetime',sortable: true },
                        { text: this.$t('Operation'), value: 'operationstypes',sortable: true },
                        { text: this.$t('Shares'), value: 'shares',sortable: false, align:"right"},
                        { text: this.$t('Price'), value: 'price',sortable: false, align:"right"},
                        { text: this.$t('Gross'), value: 'gross_account',sortable: false, align:"right"},
                        { text: this.$t('Commission'), value: 'commission',sortable: false, align:"right"},
                        { text: this.$t('Taxes'), value: 'taxes',sortable: false, align:"right"},
                        { text: this.$t('Net'), value: 'net_account',sortable: false, align:"right"},
                        { text: this.$t('Currency factor'), value: 'currency_conversion',sortable: false, align:"right"},
                        { text: this.$t('Comment'), value: 'comment',sortable: false},
                    ]
                } else if (this.output=="investment"){                
                    r= [
                        { text: this.$t('Date and time'), value: 'datetime',sortable: true },
                        { text: this.$t('Operation'), value: 'operationstypes',sortable: true },
                        { text: this.$t('Shares'), value: 'shares',sortable: false, align:"right"},
                        { text: this.$t('Price'), value: 'price',sortable: false, align:"right"},
                        { text: this.$t('Gross'), value: 'gross_investment',sortable: false, align:"right"},
                        { text: this.$t('Commission'), value: 'commission',sortable: false, align:"right"},
                        { text: this.$t('Taxes'), value: 'taxes',sortable: false, align:"right"},
                        { text: this.$t('Net'), value: 'net_investment',sortable: false, align:"right"},
                        { text: this.$t('Currency factor'), value: 'currency_conversion',sortable: false, align:"right"},
                        { text: this.$t('Comment'), value: 'comment',sortable: false},
                    ]
                } else if (this.output=="user"){
                    r= [
                        { text: this.$t('Date and time'), value: 'datetime',sortable: true },
                        { text: this.$t('Operation'), value: 'operationstypes',sortable: true },
                        { text: this.$t('Shares'), value: 'shares',sortable: false, align:"right"},
                        { text: this.$t('Price'), value: 'price',sortable: false, align:"right"},
                        { text: this.$t('Gross'), value: 'gross_user',sortable: false, align:"right"},
                        { text: this.$t('Commission'), value: 'commission',sortable: false, align:"right"},
                        { text: this.$t('Taxes'), value: 'taxes',sortable: false, align:"right"},
                        { text: this.$t('Net'), value: 'net_user',sortable: false, align:"right"},
                        { text: this.$t('Currency factor'), value: 'currency_conversion',sortable: false, align:"right"},
                        { text: this.$t('Comment'), value: 'comment',sortable: false},
                    ]
                }

                if (this.showactions==true){
                    r.push({ text: this.$t('Actions'), value: 'actions', sortable: false })
                }
                
                if (this.currency_investment==this.currency_account){
                    r.splice(8,1)
                }
                if (this.heterogeneus==true){
                    r.splice(1, 0, { text: this.$t('Name'), value: 'name',sortable: true });
                }
                return r
            },
            editIO(item){
                this.$emit("onedit",item)
            },
            deleteIO(item){
                var r = confirm(this.$t("Do you want to delete this investment operation?"))
                if(r == false) {
                    return
                } 
                axios.delete(`${this.$store.state.apiroot}/api/investmentsoperations/${item.id}/`, this.myheaders())
                .then((response) => {
                    console.log(response);
                    this.$emit("cruded")
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            gotoLastRow(){
                this.$vuetify.goTo(this.$refs[this.items.length-1], { container:  this.$refs.table_o.$el.childNodes[0] }) 
            },
            on_InvestmentsoperationsCU_cruded(){
                this.dialog_io=false
                this.$emit("cruded")
            }
        },
        mounted(){
            this.gotoLastRow()
        }
    }
</script>
