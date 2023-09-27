<template>
    <div>
        <v-data-table density="compact" :headers="table_headers()" :items="items" class="elevation-1" :sort-by="[{key:'year',order:'asc'}]" fixed-header :height="$attrs.height"    :items-per-page="10000" >
            <template #item.datetime="{item}">
                {{ localtime(item.datetime) }}
            </template>                 
            <template #item.investments="{item}">
                {{ store().investments.get(item.investments).fullname }}
            </template>              
            <template #item.amount="{item}">
                <div class="text-right" v-html="currency_html(item.amount,item.currency)"></div>
            </template>            
            <template #item.actions="{item}">
                <v-icon small class="mr-2" @click="editFOC(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteFOC(item)">mdi-delete</v-icon>
            </template>
                <template #bottom ></template>   
        </v-data-table>   
        <!-- DIVIDEND CU-->
        <v-dialog v-model="dialog_foc" width="35%">
            <v-card class="pa-3">
                <FastOperationsCoverageCU :foc="foc" :mode="foc_mode" :key="key"  @cruded="on_FastOperationsCoverageCU_cruded" />
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import FastOperationsCoverageCU from './FastOperationsCoverageCU.vue'
    export default {
        components:{
            FastOperationsCoverageCU,
        },
        props: {
            items: {
                required: true
            },
        },
        data: function(){
            return {
                dialog_foc:false,
                foc: null,
                foc_mode: null,
                key: 0,
            }
        },
        methods: {
            currency(value){
                return this.currency_html(value, this.product.currency)
            },
            editFOC(item){
                this.foc=item
                this.foc_mode="U"
                this.dialog_foc=true
                this.key=this.key+1
            },
            deleteFOC(item){
                this.foc=item
                this.foc_mode="D"
                this.dialog_foc=true
                this.key=this.key+1
            },
            table_headers(){
                var r= [
                    { title: this.$t('Date and time'), key: 'datetime', sortable: true },
                    { title: this.$t('Investment'), key: 'investments', sortable: true,align:'end' },
                    { title: this.$t('Amount'), key: 'amount', sortable: true,align:'end' },
                    { title: this.$t('Comment'), key: 'comment', sortable: true, align:'end' },
                    { title: this.$t('Actions'), key: 'actions', sortable: false , width:"6%"},
                ]
                return r
            },
            gotoLastRow(){
                //this.$vuetify.goTo(this.$refs[this.items.length-1], { container:  this.$refs[this.$vnode.tag].$el.childNodes[0] }) 
            },
            on_FastOperationsCoverageCU_cruded(){
                this.$emit("cruded")
                this.dialog_foc=false
            },
        },
        created(){
        }
    }
</script>