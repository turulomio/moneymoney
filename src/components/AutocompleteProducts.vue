<template>
    <v-autocomplete :items="$store.state.products" v-model="new_value" :label="mylabel" item-value="url" :rules="$attrs.rules" @change="on_change">
        <template slot="item" slot-scope="{ item }">
            <v-list-tile-content>
                <v-icon :class="'mr-2 fi fib fi-'+item.flag" small :title="$store.getters.getCountryNameByCode(item.flag)"></v-icon>{{item.fullname}}
            </v-list-tile-content>
        </template>

        <template v-slot:selection="{ item }">
            <v-list-tile-content>
                <v-icon :class="'mr-2 fi fib fi-'+item.flag" small :title="$store.getters.getCountryNameByCode(item.flag)"></v-icon>{{item.fullname}}
            </v-list-tile-content>
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
            if (this.returnObject){
                this.new_value=item
            } else {
                this.new_value=item.url
            }
            this.new_value=item.url
            this.$emit("input", this.new_value)
        },
    },
    created(){
        console.log(this.$attrs)
        this.new_value=this.value
    }
}
</script>