<!--
    Value:
        Can be:
            - A Date iso string  new Date().toISOString().split("T")[0]
            - null. Se grabaría 
-->


<template>
    <div v-if="this.currency_from!=this.currency_to">
        <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
            <template v-slot:activator="{ on, attrs }">
                <v-row justify="center" align="center">
                    <v-text-field  class="ma-3" prepend-icon="mdi-ab-testing" v-model="newvalue" :name="$attrs.name" :label="$attrs.label" readonly v-bind="attrs" v-on="on" @click="on_click()"></v-text-field>
                </v-row>
            </template>
            <v-card class="pa-6">
                <v-text-field v-model="currency_from_value" :suffix="currency_from"></v-text-field>
                <v-text-field v-model="currency_to_value" :suffix="currency_to"></v-text-field>
                <v-card-actions>
                    <v-btn class="ml-4" color="error" @click="on_close()" >{{$t("Set") }}</v-btn>
                </v-card-actions> 
            </v-card>
        </v-menu>
    </div>
</template>
<script>
    export default {    
        props: {
            value: {
                required: true
            },
            currency_from: {
                required: true
            },
            currency_to: {
                required: true
            },
            decimals: {
                required: false,
                default:10
            }
            
        },
        data: function(){
            return {
                menu: false,
                newvalue: null,
                currency_from_value: 1,
                currency_to_value: 1,
                representation:"",
            }
        },
        watch: {
            currency_from_value(){
                this.update_value()
            },
            currency_to_value(){
                this.update_value()
            },
        },
        methods: {
            update_value(){
                this.newvalue=this.my_round(this.currency_to_value/this.currency_from_value, this.decimals)
                this.$emit('input', this.newvalue)
            },
            on_click(){
                this.update_internal_values()
            },
            on_close(){
                this.menu=false
            },
            update_internal_values(){
                this.currency_to_value=1
                this.currency_from_value=this.my_round(1/this.newvalue, this.decimals)
            },
        },
        created(){
            this.newvalue=this.value
            this.update_internal_values()
        },
    }
</script>
