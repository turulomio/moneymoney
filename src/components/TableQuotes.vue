<template>
    <div>
        <v-data-table density="compact" :headers="table_headers()" :items="items" class="elevation-1" :sort-by="[{key:'datetime',order:'asc'}]" fixed-header :height="$attrs.height" :loading="$attrs.loading" :items-per-page="10000" >

            <template #item.datetime="{item}">
                <div>{{ localtime(item.raw.datetime)}}</div>
            </template>        
            <template #item.quote="{item}">
                <div v-html="currency_html(item.raw.quote,item.raw.currency,item.raw.decimals)"></div>
            </template>   
            <template #item.actions="{item}">
                <v-icon small class="mr-2" @click="editQuote(item.raw)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteQuote(item.raw)">mdi-delete</v-icon>
            </template>
                <template #bottom ></template>   
        </v-data-table>   
        <!-- QUOTES CU-->
        <v-dialog v-model="dialog_quotes_cu" width="65%">
            <v-card class="pa-3">
                <QuotesCU :quote="quote" :mode="quote_mode" :key="key"  @cruded="on_QuotesCU_cruded()"></QuotesCU>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import QuotesCU from './QuotesCU.vue'
    export default {
        components:{
            QuotesCU,
        },
        props: {
            items: { //List of object with  datetime, quote, id, product (url), decimal, currency, name attributes
                required: true
            },
            show_name:{ // Show product name
                type: Boolean,
                required: false,
                default: false,
            },
            no_delete_confirmation:{
                type: Boolean,
                required: false,
                default: false,
            },
            
        },
        data: function(){
            return {
                dialog_quotes_cu:false,
                quote: null,
                key: 0,
            }
        },
        methods: {
            editQuote(item){
                this.quote=item
                this.quote_mode="U"
                this.key=this.key+1
                this.dialog_quotes_cu=true
            },
            deleteQuote(item){
                this.quote=item
                this.quote_mode="D"
                this.key=this.key+1
                this.dialog_quotes_cu=true
            },
            table_headers(){
                var r= [
                    { title: this.$t('Date and time'), key: 'datetime', sortable: true },
                    { title: this.$t('Product'), key: 'name', sortable: true },
                    { title: this.$t('Quote'), key: 'quote', sortable: true ,align:'end'},
                    { title: this.$t('Actions'), key: 'actions', sortable: false },
                ]
                return r
            },
            on_QuotesCU_cruded(){
                this.dialog_quotes_cu=false
                this.$emit("cruded")
            }
        },
    }
</script>