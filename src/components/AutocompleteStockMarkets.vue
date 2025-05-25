<template>
    <v-autocomplete :readonly="readonly" :items="getArrayFromMap(useStore().stockmarkets)" v-model="new_value" :label="mylabel"  item-title="localname" :return-object="returnObject" item-value="url">
        <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" :prepend-icon="`mr-3 fi fib fi-${item.raw.country}`" :title="item.raw.localname" />
        </template>         
        <template v-slot:selection="{ props, item }">
            <v-list-item v-bind="props" :prepend-icon="`pl-6 mr-3 fi fib fi-${item.raw.country}`" :title="item.raw.localname" />
        </template> 
    </v-autocomplete>
</template>

<script>

import { useStore } from "@/store"
import {getArrayFromMap} from "@/functions"

export default {
    name: "AutocompleteProducts",
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
    },
    emits: ['update:modelValue'],
    computed:{
        mylabel(){
            if ('label' in this.$attrs) return this.$attrs.label
            return this.$t('Select a stock market')
        }
    },
    data(){ 
        return {
            new_value:null,
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
        getArrayFromMap,
        useStore,
    },
    created(){
        this.new_value=this.modelValue
    }
}
</script>