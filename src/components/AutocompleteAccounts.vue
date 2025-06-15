<template>
    <v-autocomplete :readonly="readonly" :items="new_accounts" v-model="new_value" :label="mylabel"  item-title="fullname" :return-object="returnObject" item-value="url" :multiple="multiple">
      <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" :prepend-icon="`mr-3 fi fib fi-${item.raw.flag}`" :title="item.raw.fullname" :class="(item.active)? 'text-decoration-line-through': ''" />
        </template>         
        <template v-slot:selection="{ props, item }">
            <v-list-item v-bind="props" :prepend-icon="`pl-6 mr-3 fi fib fi-${item.raw.flag}`" :title="item.raw.fullname" />
        </template> 
    </v-autocomplete>
</template>

<script>
import { useStore } from "@/store"
import {getArrayFromMap} from "@/functions"

export default {
    props:{
        modelValue: { 
            required: true,
        },
        returnObject:{
            type: Boolean,
            required:false,
            default:false,
        },
        readonly: {
            type: Boolean,
            required: false,
            default: false
        },
        accounts: {
            type: Array,
            required:false,
            default: new Array(),
        },
        multiple: {
            type: Boolean,
            required: false,
            default: false,
        }
    },
    emits: ['update:modelValue'],
    computed:{
        mylabel(){
            if ('label' in this.$attrs) return this.$attrs.label
            return (this.multiple)? this.$t('Select an account'): this.$t('Select accounts')
        }
    },
    data(){ 
        return {
            new_value:null,
            new_accounts: null,
        }
    },
    watch:{
        value(newValue){
            this.new_value=newValue
        },
        new_value(newValue){
            this.$emit('update:modelValue', newValue)
        },
    },
    methods:{
        useStore,
        getArrayFromMap,
    },
    created(){
        this.new_value=this.modelValue
        if (this.accounts.length==0){//Default value
            this.new_accounts=this.getArrayFromMap(this.useStore().accounts)
        } else {
            this.new_accounts=this.accounts
        }
    }
}
</script>