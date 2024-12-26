<!--
    Value:
        Can be:
            - A Date iso string "2022-12-12"
            - null. Se grabaría como null
-->


<template>
    <div>
        <v-menu v-model="menu" :disabled="readonly" :close-on-content-click="false">
        <template v-slot:activator="{ props }">
            <div class="d-flex flex-row">
                <v-text-field v-model="new_value" style="min-width: 200px;" :label="label" v-bind="props" readonly :clearable="new_clearable" prepend-icon="mdi-calendar-clock" @click:prepend.stop="on_click_prepend_icon"/>
            </div>
        </template>
        <v-date-picker :readonly="readonly" density="compact" v-model="dt" show-adjancent-months hide-header ></v-date-picker> 
    </v-menu>    
    </div>
</template>
<script>
    //import { useDate } from 'vuetify'
    export default {    
        props: {
            modelValue:{ //v-model in vue3
                required:true
            },
            readonly: {
                type: Boolean,
                required: false,
                default: false,
            },
            clearable: { //Hides null icon
                type: Boolean,
                required: false,
                default: false,
            }
        },
        emits: ['update:modelValue'],
        data: function(){
            return {
                dt: null,
                new_value: null,
                menu:false,
            }
        },
        watch: {
            new_value (newValue) {
                this.dt=this.string2dt(newValue)
                this.$emit('update:modelValue', newValue)
                this.menu=false
            },
            modelValue (newValue) {
                this.new_value = newValue
            },
            dt(newValue){
                this.new_value=this.dt2string(newValue)
            }
        },
        computed: {
            label(){
                if (this.$attrs.label){
                    return this.$attrs.label
                } else {
                    return this.$t("Select a date")
                }
            }
        },
        methods: {
            string2dt(s){
                if (!s) return null
                return new Date(s)
            },
            dt2string(dt){
                if (!dt) return null
                return `${dt.getFullYear()}-${(dt.getMonth()+1).toString().padStart(2,"0")}-${dt.getDate().toString().padStart(2,"0")}`
            },
            on_click_prepend_icon(){
                if (this.readonly) return
                this.new_value=this.dt2string(new Date())
            },
        },
        created(){
            this.new_clearable=this.clearable
            if (this.readonly) this.new_clearable=false // If readonly can't be clearable
            this.new_value=this.modelValue
            this.dt=this.string2dt(this.new_value)
        },
    }
</script>
