<template>
    <v-autocomplete :readonly="readonly" :items="new_investments" v-model="new_value" :label="mylabel"  item-title="fullname" :return-object="returnObject" item-value="url" :multiple="multiple">
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
        investments: {
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
            return (this.multiple)? this.$t('Select an investment'): this.$t('Select investments')
        }
    },
    data(){ 
        return {
            new_value:null,
            new_investments: null,
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
        if (this.investments.length==0){//Default value
            this.new_investments=this.getArrayFromMap(this.useStore().investments)
        } else {
            this.new_investments=this.investments
        }
    }
}
</script>