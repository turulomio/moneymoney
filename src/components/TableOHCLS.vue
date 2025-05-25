<template>
    <div>
        <v-data-table density="compact" :headers="table_headers()" :items="items" class="elevation-1" :sort-by="[{key:'datetime',order:'asc'}]" fixed-header :height="$attrs.height" :items-per-page="10000" >
            <template #item.datetime="{item}">
                <div>{{ localtime(item.datetime)}}</div>
            </template>        
            <template #item.open="{item}">
                <div v-html="currency_html(item.open,product.currency, product.decimals)"></div>
            </template>     
            <template #item.close="{item}">
                <div v-html="currency_html(item.close,product.currency, product.decimals)"></div>
            </template>     
            <template #item.high="{item}">
                <div v-html="currency_html(item.high,product.currency, product.decimals)"></div>
            </template>     
            <template #item.low="{item}">
                <div v-html="currency_html(item.low,product.currency, product.decimals)"></div>
            </template>   
            <template #item.actions="{item}">
                <v-icon small class="mr-2" @click="deleteOHCL(item)">mdi-delete</v-icon>
            </template>
                <template #bottom ></template>   
        </v-data-table>
    </div>
</template>
<script>    
    import axios from 'axios'
    import { useStore } from "@/store"
    import { localtime } from 'vuetify_rules'
    import { parseResponseError, currency_html, myheaders } from '@/functions'
    export default {
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
                key: 0,
            }
        },
        methods: {
            useStore,
            localtime,
            parseResponseError,
            currency_html,
            myheaders,
            deleteOHCL(item){
               var r = confirm(this.$t("Do you want to delete this OHCL quotes?"))
               if(r == false) {
                  return
               } 
                var headers={...this.myheaders(),data:{product:this.product.url,date:item.date}}
                axios.delete(`${this.useStore().apiroot}/products/quotes/ohcl/`, headers)
                .then(() => {
                    this.$emit("cruded")
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            table_headers(){
                var r= [
                    { title: this.$t('Date and time'), key: 'date', sortable: true },
                    { title: this.$t('Open'), key: 'open', sortable: true },
                    { title: this.$t('High'), key: 'high', sortable: true },
                    { title: this.$t('Close'), key: 'close', sortable: true },
                    { title: this.$t('Low'), key: 'low', sortable: true },
                    { title: this.$t('Actions'), key: 'actions', sortable: false },
                ]
                return r
            },
            gotoLastRow(){
                this.$vuetify.goTo(this.$refs[this.items.length-1], { container:  this.$refs[this.$vnode.tag].$el.childNodes[0] }) 
            },
        },
    }
</script>