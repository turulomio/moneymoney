<template>
    <v-autocomplete :items="$store.state.products" v-model="new_value" :label="mylabel" :return-object="returnObject" item-value="url" :rules="$attrs.rules" @change="on_change">

        <template slot="item" slot-scope="{ item }">
            <div><v-icon :class="'mr-3 fi fib fi-'+item.flag" small :title="$store.getters.getCountryNameByCode(item.flag)"></v-icon>
                {{item.fullname}}</div>
        </template>

        <template slot="selection" slot-scope="{ item }">       
            <div><v-icon :class="'mr-3 fi fib fi-'+item.flag" small :title="$store.getters.getCountryNameByCode(item.flag)"></v-icon>
                {{item.fullname}}</div>
      </template>

    </v-autocomplete>
</template>

<script>
export default {
    name: "AutocompleteProducts",
    props:{
        value: { 
            required: true,
        },
        returnObject:{
            type: Boolean,
            required:false,
            default:false,
        }
    },
    computed:{
        mylabel(){
            if ('label' in this.$attrs) return this.$attrs.label
            return this.$t('Select a product')
        }
    },
    data(){ 
        return {
            new_value:null,
        }
    },
    methods:{
        on_change(item){
            this.new_value=item
            this.$emit("input", this.new_value)
        },
    },
    created(){
        this.new_value=this.value
    }
}
</script>