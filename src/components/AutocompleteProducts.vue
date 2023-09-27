<template>
    <v-autocomplete :readonly="readonly" :items="new_products" v-model="new_value" :label="mylabel"  item-title="fullname" :return-object="returnObject" item-value="url">
      <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" :prepend-icon="`mr-3 fi fib fi-${item.flag}`" :title="item.fullname" />
        </template>         
        <template v-slot:selection="{ props, item }">
            <v-list-item v-bind="props" :prepend-icon="`pl-6 mr-3 fi fib fi-${item.flag}`" :title="item.fullname" />
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
        products: {
            type: Array,
            required:false,
            default: new Array(),
        }
    },
    emits: ['update:modelValue'],
    computed:{
        mylabel(){
            if ('label' in this.$attrs) return this.$attrs.label
            return this.$t('Select a product')
        }
    },
    data(){ 
        return {
            new_value:null,
            new_products: null,
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
        // on_custom_filter(a,b,c){
        //     if(this.new_value.length<1) {
        //         return
        //     } 
        //     console.log(a,b,c)
        // },
        // on_update_modelValue(){
        //     console.log("AOHOARA")
        //     if(this.new_value.length<1) {
        //         this.products_filtered=[]
        //     } else {
        //         this.products_filtered=this.new_products.filter(o => o.includes(this.new_value))
        //     }
        //     console.log(this.products_filtered.length)
        //     // this.$emit("update:modelValue", this.new_value)
        // },
    },
    created(){
        this.new_value=this.modelValue
        if (this.products.length==0){//Default value
            this.new_products=this.getArrayFromMap(this.store().products)
        } else {
            this.new_products=this.products
        }
    }
}
</script>