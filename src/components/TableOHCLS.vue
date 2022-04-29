<template>
    <div>
        <v-data-table dense :headers="table_headers()" :items="items" class="elevation-1" disable-pagination  hide-default-footer sort-by="datetime" fixed-header :height="$attrs.height" :ref="$vnode.tag">
            <template v-slot:[`item.datetime`]="{ item, index}" >
                <div :ref="index">{{ localtime(item.datetime)}}</div>
            </template>        
            <template v-slot:[`item.open`]="{ item }">
                <div v-html="currency_html(item.open,product.currency, product.decimals)"></div>
            </template>     
            <template v-slot:[`item.close`]="{ item }">
                <div v-html="currency_html(item.close,product.currency, product.decimals)"></div>
            </template>     
            <template v-slot:[`item.high`]="{ item }">
                <div v-html="currency_html(item.high,product.currency, product.decimals)"></div>
            </template>     
            <template v-slot:[`item.low`]="{ item }">
                <div v-html="currency_html(item.low,product.currency, product.decimals)"></div>
            </template>   
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="deleteOHCL(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>   
        <!-- QUOTES CU-->
        <v-dialog v-model="dialog_quotes_cu" width="35%">
            <v-card class="pa-3">
                <QuotesCU :quote="quote" :investment="investment" :key="key"  @cruded="on_QuotesCU_cruded()"></QuotesCU>
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
            items: {
                required: true
            },
            product: {   // Must be a product object
                required: true
            },
        },
        data: function(){
            return {
                dialog_quotes_cu:false,
                quote: null,
                investment: null,
                key: 0,
            }
        },
        methods: {
            editQuote(item){
                this.quote=item
                this.investment={url:this.dividend.investments}
                this.dialog_dividend=true
                this.key=this.key+1
            },
            deleteOHCL(item){
               var r = confirm(this.$t("Do you want to delete this OHCL quotes?"))
               if(r == false) {
                  return
               } 
               console.log(item)
                var headers={...this.myheaders(),data:{product:this.product.url,date:item.date}}
                axios.delete(`${this.$store.state.apiroot}/products/quotes/ohcl/`, headers)
                .then(() => {
                    this.$emit("cruded")
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            table_headers(){
                var r= [
                    { text: this.$t('Date and time'), value: 'date', sortable: true },
                    { text: this.$t('Open'), value: 'open', sortable: true },
                    { text: this.$t('High'), value: 'high', sortable: true },
                    { text: this.$t('Close'), value: 'close', sortable: true },
                    { text: this.$t('Low'), value: 'low', sortable: true },
                    { text: this.$t('Actions'), value: 'actions', sortable: false },
                ]
                return r
            },
            gotoLastRow(){
                this.$vuetify.goTo(this.$refs[this.items.length-1], { container:  this.$refs[this.$vnode.tag].$el.childNodes[0] }) 
            },
            on_QuotesCU_cruded(){
                this.$emit("cruded")
            }
        },
        mounted(){
            // this.gotoLastRow()
            // this.key=this.key+1
            // console.log("DIVIDENDS TABLE")
        }
    }
</script>