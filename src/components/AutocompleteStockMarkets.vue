<template>
    <v-autocomplete :readonly="readonly" :items="getArrayFromMap(store().stockmarkets)" v-model="new_value" :label="mylabel"  item-title="localname" :return-object="returnObject" item-value="url">
        <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" :prepend-icon="`mr-3 fi fib fi-${item.country}`" :title="item.localname" />
        </template>         
        <template v-slot:selection="{ props, item }">
            <v-list-item v-bind="props" :prepend-icon="`pl-6 mr-3 fi fib fi-${item.country}`" :title="item.localname" />
        </template> 
    </v-autocomplete>
</template>

<script>

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
    created(){
        this.new_value=this.modelValue
    }
}
</script>