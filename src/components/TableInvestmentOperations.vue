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
            {{ currency_string(item.price, currency(item))}}
            </template>
                         
            <template v-slot:[`item.name`]="{ item }">
                <div v-html="$store.getters.getObjectPropertyByUrl('investments', item.investments,'fullname')"></div>
            </template>  
            <template v-slot:[`item.gross_account`]="{ item }">
            {{ currency_string(item.gross_account, currency(item))}}
            </template>
            <template v-slot:[`item.gross_investment`]="{ item }">
            {{ currency_string(item.gross_investment, currency(item))}}
            </template>
            <template v-slot:[`item.gross_user`]="{ item }">
            {{ currency_string(item.gross_user, currency(item))}}
            </template>
            
            <template v-slot:[`item.commission`]="{ item }">
            {{ currency_string(item.commission, currency(item))}}
            </template>
            <template v-slot:[`item.taxes`]="{ item }">
            {{ currency_string(item.taxes, currency(item))}}
            </template>
            
            <template v-slot:[`item.net_account`]="{ item }">
            {{ currency_string(item.net_account, currency(item))}}
            </template>
            <template v-slot:[`item.net_investment`]="{ item }">
            {{ currency_string(item.net_investment, currency(item))}}
            </template>
            <template v-slot:[`item.net_user`]="{ item }">
            {{ currency_string(item.net_user, currency(item))}}
            </template>
            
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editIO(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteIO(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>
        <!-- IO CU-->
        <v-dialog v-model="dialog_io" width="65%">
            <v-card class="pa-3">
                <InvestmentsoperationsCU :io="io" :mode="io_mode" :key="key"  @cruded="on_InvestmentsoperationsCU_cruded()" />
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import InvestmentsoperationsCU from './InvestmentsoperationsCU.vue'
    export default {
        name:"TableInvestmentOperations",
        components:{
            InvestmentsoperationsCU,
        },
        props: {
            items: {
                required: true
            },
            showactions:{ //Used to edit io operation
                required:false,
                default:true
            },
            output:{ // "investmnt", account or user to see table ouput
                required:true,
                default: "investment",
            },
            showinvestment:{// Items must have accounts attribute
                type: Boolean,
                required:false,
                default: false,
            },
        },
        data: function(){
            return {
                selected: [],
                key:0,  

                dialog_io:false,
                io:null,
                io_mode:null,
            }
        },
        methods: {
            // Currencies are part of the item
            currency(item){
                if (this.output=="account"){
                    return item.currency_account
                } else if (this.output=="investment"){
                    return item.currency_product
                } else if (this.output=="user"){
                    return item.currency_user
                }
            },
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
                if (this.showinvestment==true){
                    r.splice(1, 0, { text: this.$t('Name'), value: 'name',sortable: true });
                }
                return r
            },
            editIO(item){
                this.io=item
                this.io_mode="U"
                this.key=this.key+1
                this.dialog_io=true
            },
            deleteIO(item){
                this.io=item
                this.io_mode="D"
                this.key=this.key+1
                this.dialog_io=true
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
