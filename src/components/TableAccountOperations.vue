<template>
    <v-data-table :show-select="showselected" v-model="selected" dense :headers="table_headers()" :items="items" class="elevation-1" disable-pagination  hide-default-footer sort-by="datetime" fixed-header v-bind="$attrs"  :ref="$vnode.tag" :single-select="false" item-key="datetime">
        <template v-slot:[`item.datetime`]="{ item }" >
        {{ localtime(item.datetime)}}
        </template>      
        <template v-slot:[`item.amount`]="{ item }">
            <div v-html="currency_html(item.amount,item.currency)"></div>
        </template>   
        <template v-slot:[`item.balance`]="{ item }">
            <div v-html="currency_html(item.balance, item.currency)"></div>
        </template>   
        <template v-slot:[`item.concepts`]="{ item }">
            <div v-html="$store.getObjectPropertyByUrl('concepts', item.concepts, 'name')"></div>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editAO(item)">mdi-pencil</v-icon>
            <v-icon small class="mr-2" @click="deleteAO(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:[`body.append`]="{headers}" v-if="total_currency!=null">
            <tr style="background-color: GhostWhite">
                <td v-for="(header,i) in headers" :key="i" >
                    <div v-if="header.value == 'datetime'">
                        Total
                    </div>
                    <div v-if="header.value == 'amount'">
                        <div class="text-right" v-html="currency_html(listobjects_sum(items,'amount'),total_currency)"></div>
                    </div>
                </td>
            </tr>
        </template>
    </v-data-table>   
</template>

<script>     
    import {localtime, listobjects_sum} from '../functions.js'
    export default {
    props: {
        items: {
            required: true
        },
        total_currency: { // Only in homogeneus. Each item must have it's currency. This is only for totals.
                        // If null doesn't show total. Total can be showed in homogeneos or not. It depends on the query if has same currency
            required: true,
            default: null,
        },
        homogeneous:{ //Only hides account if true
            required:true,
            default:true,
        },
        showselected:{
            required:false,
            default: false,
        },
        showactions:{
            required:false,
            default: true,
        }
    },

    data: function(){
        return {
            selected: [],
        }
    },
    watch: {
        selected(){
            this.$emit("changeSelected",this.selected)
        }
    },
    methods: {
        localtime,
        listobjects_sum,
        editAO(item){
            this.$emit('editAO', item)
        },
        deleteAO(item){
            this.$emit('deleteAO', item)
        },
        table_headers(){
            var r= [
                { text: this.$t('Date and time'), value: 'datetime', sortable: true, width:"12%" },
                { text: this.$t('Concept'), value: 'concepts', sortable: true, width:"20%"},
                { text: this.$t('Amount'), value: 'amount', sortable: false, align:"right", width:"8%"},
                { text: this.$t('Balance'), value: 'balance', sortable: false, align:"right", width:"8%"},
                { text: this.$t('Comment'), value: 'comment', sortable: true},
            ]
            if (this.showactions==true){
                r.push({ text: this.$t('Actions'), value: 'actions', sortable: false     , width:"6%"})
            }
            return r
        },
        gotoLastRow(){
           this.$vuetify.goTo(100000, { container:  this.$refs[this.$vnode.tag].$el.childNodes[0] ,duration: 500}) 
        },
    },
    mounted(){
        console.log(this.items)
    }
}
</script>
