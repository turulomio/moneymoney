<template>
    <v-data-table dense :headers="table_headers()" :items="items" class="elevation-1" disable-pagination  hide-default-footer sort-by="datetime" fixed-header :height="$attrs.height" :ref="$vnode.tag">
        <template v-slot:[`item.datetime`]="{ item, index}" >
            <div :ref="index">{{ localtime(item.datetime)}}</div>
        </template>      
        <template v-slot:[`item.gross`]="{ item }">
            <div v-html="currency(item.gross)"></div>
        </template>   
        <template v-slot:[`item.net`]="{ item }">
            <div v-html="currency(item.net)"></div>
        </template>   
        <template v-slot:[`item.commission`]="{ item }">
            <div v-html="currency(item.commission)"></div>
        </template>   
        <template v-slot:[`item.taxes`]="{ item }">
            <div v-html="currency(item.taxes)"></div>
        </template>   
        <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editDividend(item)">mdi-pencil</v-icon>
            <v-icon small class="mr-2" @click="deleteDividend(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:[`body.append`]="{headers}">
            <tr style="background-color: GhostWhite">
                <td v-for="(header,i) in headers" :key="i" >
                    <div v-if="header.value == 'datetime'">
                        Total
                    </div>
                    <div v-if="header.value == 'gross'">
                        <div class="text-right" v-html="currency(listobjects_sum(items,'gross'))"></div>
                    </div>
                    <div v-if="header.value == 'net'">
                        <div class="text-right" v-html="currency(listobjects_sum(items,'net'))"></div>
                    </div>
                    <div v-if="header.value == 'commission'">
                        <div class="text-right" v-html="currency(listobjects_sum(items,'commission'))"></div>
                    </div>
                    <div v-if="header.value == 'taxes'">
                        <div class="text-right" v-html="currency(listobjects_sum(items,'taxes'))"></div>
                    </div>
                </td>
            </tr>
        </template>
    </v-data-table>   
</template>
<script>    
    import {localtime} from '../functions.js'
    export default {
        components:{
        },
        props: {
            items: {
                required: true
            },
            currency_account: {
                required: true
            },
            homogeneous:{
                required:false,
                default:true,
            },
        },
        data: function(){
            return {
            }
        },
        methods: {
            localtime,
            currency(value){
                return this.currency_html(value, this.currency_account)
            },
            editDividend(item){
                window.location.href=`${this.url_root}dividend/update/${item.id}`
            },
            deleteDividend(item){
                window.location.href=`${this.url_root}dividend/delete/${item.id}`
            },
            table_headers(){
                var r= [
                    { text: this.$t('Date and time'), value: 'datetime', sortable: true },
                    { text: this.$t('Concept'), value: 'concepts', sortable: true },
                    { text: this.$t('Gross'), value: 'gross', sortable: false, align:"right"},
                    { text: this.$t('Net'), value: 'net', sortable: false, align:"right"},
                    { text: this.$t('Commission'), value: 'commission', sortable: true , align:"right"},
                    { text: this.$t('Taxes'), value: 'taxes', sortable: true , align:"right"},
                    { text: this.$t('DPS'), value: 'dps', sortable: true , align:"right"},
                    { text: this.$t('Actions'), value: 'actions', sortable: false },
                ]
                if (this.heterogeneus==true){
                    r.splice(1, 0, { text: this.$t('Account'), value: 'account',sortable: true });
                }
                return r
            },
            gotoLastRow(){
                this.$vuetify.goTo(this.$refs[this.items.length-1], { container:  this.$refs[this.$vnode.tag].$el.childNodes[0] }) 
            },
        },
        mounted(){
            this.gotoLastRow()
        }
    }
</script>