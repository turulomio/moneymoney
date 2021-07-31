<template>
    <v-data-table dense :headers="table_headers()" :items="items" class="elevation-1" disable-pagination  hide-default-footer sort-by="datetime" fixed-header v-bind="$attrs"  :ref="$vnode.tag">
        <template v-slot:[`item.datetime`]="{ item }" >
        {{ localtime(item.datetime)}}
        </template>      
        <template v-slot:[`item.amount`]="{ item }">
            <div v-html="currency(item.amount)"></div>
        </template>   
        <template v-slot:[`item.balance`]="{ item }">
            <div v-html="currency(item.balance)"></div>
        </template>   
        <template v-slot:[`item.concepts`]="{ item }">
            <div v-html="get_concept(item.concepts).name"></div>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editAO(item)">mdi-pencil</v-icon>
            <v-icon small class="mr-2" @click="deleteAO(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:[`body.append`]="{headers}">
            <tr style="background-color: GhostWhite">
                <td v-for="(header,i) in headers" :key="i" >
                    <div v-if="header.value == 'datetime'">
                        Total
                    </div>
                    <div v-if="header.value == 'amount'">
                        <div class="text-right" v-html="currency(listobjects_sum(items,'amount'))"></div>
                    </div>
                </td>
            </tr>
        </template>
    </v-data-table>   
</template>

<script>     
    import {currency_generic_html, localtime, get_concept,listobjects_sum} from '../functions.js'
    export default {
    props: {
        items: {
            required: true
        },
        currency_account: {
            required: true
        },
        url_root:{
            required:true
        },
        homogeneous:{
            required:true,
            default:true,
        },
        locale:{
            required:true,
            default: "es",
        }
    },

    data: function(){
        return {
        }
    },
    methods: {
        currency_generic_html,
        localtime,
        listobjects_sum,
        get_concept,
        currency(value){
            return this.currency_generic_html(value, this.currency_account, this.locale)
        },
        editAO(item){
            window.location.href=`${this.url_root}accountoperation/update/${item.id}`
        },
        deleteAO(item){
            window.location.href=`${this.url_root}accountoperation/delete/${item.id}`
        },
        table_headers(){
            return [
                { text: this.$t('Date and time'), value: 'datetime', sortable: true },
                { text: this.$t('Concept'), value: 'concepts', sortable: true },
                { text: this.$t('Amount'), value: 'amount', sortable: false, align:"right"},
                { text: this.$t('Balance'), value: 'balance', sortable: false, align:"right"},
                { text: this.$t('Comment'), value: 'comment', sortable: true, width:"30%"},
                { text: this.$t('Actions'), value: 'actions', sortable: false },
            ]
        },
        gotoLastRow(){
           this.$vuetify.goTo(100000, { container:  this.$refs[this.$vnode.tag].$el.childNodes[0] ,duration: 500}) 
        },
    },
}
</script>
