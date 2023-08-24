<template>
    <div>
        <v-data-table density="compact" v-model="selected" :headers="table_headers()" :items="items" class="elevation-1" :sort-by="[{key:'datetime',order:'asc'}]" fixed-header :height="$attrs.height" ref="table_o" :key="$attrs.key" :loading="$attrs.loading"    :items-per-page="10000" >

            <template #item.datetime="{item}">
              <div>{{ localtime(item.raw.datetime)}}</div>
            </template>             
            <template #item.investments="{item}">
                <div>{{ getMapObjectById("investments",item.raw.investments_id).fullname }}</div>
            </template>                    
            <template #item.operationstypes="{item}">
                <!-- <div v-html="store().operationstypes.get(item.operationstypes)"></div> -->
                <div>{{ getMapObjectById("operationstypes",item.raw.operationstypes_id).localname }}</div>
            </template>
            <template #item.price="{item}">
            {{ currency_string(item.raw.price, currency(item.raw))}}
            </template>
            <template #item.gross_account="{item}">
            {{ currency_string(item.raw.gross_account, currency(item.raw))}}
            </template>
            <template #item.gross_investment="{item}">
            {{ currency_string(item.raw.gross_investment, currency(item.raw))}}
            </template>
            <template #item.gross_user="{item}">
            {{ currency_string(item.raw.gross_user, currency(item.raw))}}
            </template>
            
            <template #item.commission="{item}">
            {{ currency_string(item.raw.commission, currency(item.raw))}}
            </template>
            <template #item.taxes="{item}">
            {{ currency_string(item.raw.taxes, currency(item.raw))}}
            </template>
            
            <template #item.net_account="{item}">
            {{ currency_string(item.raw.net_account, currency(item.raw))}}
            </template>
            <template #item.net_investment="{item}">
            {{ currency_string(item.raw.net_investment, currency(item.raw))}}
            </template>
            <template #item.net_user="{item}">
            {{ currency_string(item.raw.net_user, currency(item.raw))}}
            </template>
            
            <template #item.actions="{item}">
                <v-icon small class="mr-2" @click="copyIO(item.raw)">mdi-content-copy</v-icon>
                <v-icon small class="mr-2" @click="editIO(item.raw)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteIO(item.raw)">mdi-delete</v-icon>
            </template>
                <template #bottom ></template>   
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
    import { empty_investment_operation } from '@/empty_objects.js'
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
            empty_investment_operation,
            table_headers(){
                var r
                if (this.output=="account"){
                    r= [
                        { title: this.$t('Date and time'), key: 'datetime',sortable: true },
                        { title: this.$t('Operation'), key: 'operationstypes',sortable: true },
                        { title: this.$t('Shares'), key: 'shares',sortable: false, align:'end'},
                        { title: this.$t('Price'), key: 'price',sortable: false, align:'end'},
                        { title: this.$t('Gross'), key: 'gross_account',sortable: false, align:'end'},
                        { title: this.$t('Commission'), key: 'commission',sortable: false, align:'end'},
                        { title: this.$t('Taxes'), key: 'taxes',sortable: false, align:'end'},
                        { title: this.$t('Net'), key: 'net_account',sortable: false, align:'end'},
                        { title: this.$t('Currency factor'), key: 'currency_conversion',sortable: false, align:'end'},
                        { title: this.$t('Comment'), key: 'comment',sortable: false},
                    ]
                } else if (this.output=="investment"){                
                    r= [
                        { title: this.$t('Date and time'), key: 'datetime',sortable: true },
                        { title: this.$t('Operation'), key: 'operationstypes',sortable: true },
                        { title: this.$t('Shares'), key: 'shares',sortable: false, align:'end'},
                        { title: this.$t('Price'), key: 'price',sortable: false, align:'end'},
                        { title: this.$t('Gross'), key: 'gross_investment',sortable: false, align:'end'},
                        { title: this.$t('Commission'), key: 'commission',sortable: false, align:'end'},
                        { title: this.$t('Taxes'), key: 'taxes',sortable: false, align:'end'},
                        { title: this.$t('Net'), key: 'net_investment',sortable: false, align:'end'},
                        { title: this.$t('Currency factor'), key: 'currency_conversion',sortable: false, align:'end'},
                        { title: this.$t('Comment'), key: 'comment',sortable: false},
                    ]
                } else if (this.output=="user"){
                    r= [
                        { title: this.$t('Date and time'), key: 'datetime',sortable: true },
                        { title: this.$t('Operation'), key: 'operationstypes',sortable: true },
                        { title: this.$t('Shares'), key: 'shares',sortable: false, align:'end'},
                        { title: this.$t('Price'), key: 'price',sortable: false, align:'end'},
                        { title: this.$t('Gross'), key: 'gross_user',sortable: false, align:'end'},
                        { title: this.$t('Commission'), key: 'commission',sortable: false, align:'end'},
                        { title: this.$t('Taxes'), key: 'taxes',sortable: false, align:'end'},
                        { title: this.$t('Net'), key: 'net_user',sortable: false, align:'end'},
                        { title: this.$t('Currency factor'), key: 'currency_conversion',sortable: false, align:'end'},
                        { title: this.$t('Comment'), key: 'comment',sortable: false},
                    ]
                }

                if (this.showactions==true){
                    r.push({ title: this.$t('Actions'), key: 'actions', sortable: false })
                }
                
                // if (this.currency_product==this.currency_account){
                //     r.splice(8,1)
                // }
                if (this.showinvestment==true){
                    r.splice(1, 0, { title: this.$t('Name'), key: 'name',sortable: true });
                }
                return r
            },
            copyIO(item){
                this.io=this.empty_investment_operation()
                this.io.operationstypes=this.hyperlinked_url("operationstypes",item.operationstypes_id)
                this.io.shares=item.shares
                this.io.taxes=item.taxes
                this.io.commission=item.commission
                this.io.price=item.price
                this.io.comment=item.comment
                this.io.currency_conversion=item.currency_conversion
                this.io.investments=this.hyperlinked_url("investments",item.investments_id)
                this.io_mode="C"
                this.key=this.key+1
                this.dialog_io=true
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
                //this.$vuetify.goTo(this.$refs[this.items.length-1], { container:  this.$refs.table_o.$el.childNodes[0] }) 
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
